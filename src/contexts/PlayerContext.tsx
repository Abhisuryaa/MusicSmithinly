import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { Track, mockTracks } from '@/data/mockData';
import { useAuth } from './AuthContext';
import { addToRecentlyPlayed } from '@/hooks/useFirestore';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLooping: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  queue: Track[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Track[]>(mockTracks);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoopingRef = useRef<boolean>(isLooping);
  const queueRef = useRef<Track[]>(queue);
  const currentTrackRef = useRef<Track | null>(currentTrack);
  const lastActionTime = useRef<number>(0);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    isLoopingRef.current = isLooping;
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = isLoopingRef.current;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (!isLoopingRef.current) {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      const isSameTrack = audio.src === currentTrack.audioUrl;
      
      if (!isSameTrack) {
        audio.pause();
        audio.src = currentTrack.audioUrl;
        audio.load();
        
        if (user) {
          addToRecentlyPlayed(user.uid, currentTrack);
        }

        if (isPlaying) {
          audio.play().catch(err => {
            if (err.name !== 'AbortError') {
              console.error("Playback failed:", err);
            }
          });
        }
      }
    }
  }, [currentTrack, user, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Playback failed:", err);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    console.log("playTrack called. Track:", track.title);
    if (newQueue) {
      console.log("playTrack: Setting new queue with length:", newQueue.length);
      setQueue(newQueue);
    } else {
      console.log("playTrack: No new queue provided. Using existing queue length:", queue.length);
    }
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  const nextTrack = () => {
    const now = Date.now();
    if (now - lastActionTime.current < 300) return;
    lastActionTime.current = now;

    console.log("nextTrack called.");
    const currentQ = queueRef.current;
    const currentT = currentTrackRef.current;
    
    console.log("Current track:", currentT?.title);
    console.log("Queue length:", currentQ.length);
    
    if (!currentT || currentQ.length === 0) {
      console.log("nextTrack: No current track or empty queue.");
      return;
    }
    const currentIndex = currentQ.findIndex(t => t.id === currentT.id);
    console.log("Current track index:", currentIndex);
    
    if (currentIndex === -1) {
      console.log("nextTrack: Current track not found in queue. Playing first track of queue.");
      setCurrentTrack(currentQ[0]);
      setIsPlaying(true);
      return;
    }

    const nextIndex = (currentIndex + 1) % currentQ.length;
    console.log("Next track index:", nextIndex);
    console.log("Next track:", currentQ[nextIndex]?.title);
    setCurrentTrack(currentQ[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const now = Date.now();
    if (now - lastActionTime.current < 300) return;
    lastActionTime.current = now;

    const currentQ = queueRef.current;
    const currentT = currentTrackRef.current;

    if (!currentT || currentQ.length === 0) return;
    const currentIndex = currentQ.findIndex(t => t.id === currentT.id);
    const prevIndex = (currentIndex - 1 + currentQ.length) % currentQ.length;
    setCurrentTrack(currentQ[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      isLooping,
      playTrack, 
      togglePlay, 
      toggleLoop,
      nextTrack, 
      prevTrack,
      progress,
      duration,
      seek,
      volume,
      setVolume,
      queue
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
