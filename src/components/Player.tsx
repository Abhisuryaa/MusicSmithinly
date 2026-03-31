import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Maximize2, Minimize2, ChevronDown, Heart, ListMusic, ListPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useLikedSongs, toggleLikeSong } from '@/hooks/useFirestore';
import { AddToPlaylistModal } from './AddToPlaylistModal';

export function Player() {
  const { currentTrack, isPlaying, isLooping, togglePlay, toggleLoop, nextTrack, prevTrack, progress, duration, seek, volume, setVolume } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const { likedSongs } = useLikedSongs(user?.uid);
  const [isLiking, setIsLiking] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const isLiked = currentTrack ? likedSongs.some(song => song.id === currentTrack.id) : false;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !currentTrack) return;
    
    setIsLiking(true);
    try {
      await toggleLikeSong(user.uid, currentTrack, isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  if (!currentTrack) return null;

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#0a0502] overflow-hidden flex flex-col"
          >
            {/* Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="atmosphere absolute inset-0" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white interactive"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Now Playing</p>
                <p className="text-xs text-white/70 mt-1 font-serif italic">From {currentTrack.artist}</p>
              </div>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white interactive">
                <ListMusic className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12 max-w-2xl mx-auto w-full">
              <div className="flex flex-col items-center w-full gap-8">
                {/* Large Static Album */}
                <motion.div 
                  layoutId="album-art"
                  className="aspect-square w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative group bg-white/5"
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <img 
                    src={currentTrack.coverUrl} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Track Details & Controls */}
                <div className="flex flex-col gap-6 w-full">
                  <div className="text-center">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl lg:text-4xl font-serif font-light text-white tracking-tight leading-tight truncate"
                    >
                      {currentTrack.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg lg:text-xl text-white/60 mt-2 font-light truncate"
                    >
                      {currentTrack.artist}
                    </motion.p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex flex-col gap-3">
                    <div 
                      onClick={handleSeek}
                      className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden group interactive cursor-pointer relative"
                    >
                      <motion.div 
                        className="h-full bg-white relative"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-[11px] text-white/40 font-mono tracking-wider">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <button 
                      onClick={handleLike}
                      disabled={isLiking}
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors interactive"
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-white text-white' : 'text-white/50'}`} />
                    </button>
                    
                    <div className="flex items-center gap-8">
                      <button 
                        onClick={prevTrack}
                        className="text-white/60 hover:text-white transition-colors interactive"
                      >
                        <SkipBack className="w-8 h-8 fill-current" />
                      </button>
                      <motion.button 
                        onClick={togglePlay}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          boxShadow: isPlaying ? "0 0 40px rgba(255,255,255,0.4)" : "0 0 20px rgba(255,255,255,0.2)"
                        }}
                        className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center interactive"
                      >
                        {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                      </motion.button>
                      <button 
                        onClick={nextTrack}
                        className="text-white/60 hover:text-white transition-colors interactive"
                      >
                        <SkipForward className="w-8 h-8 fill-current" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={toggleLoop}
                        className={`p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors interactive ${isLooping ? 'text-purple-400' : 'text-white/50'}`}
                      >
                        <Repeat className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsPlaylistModalOpen(true); }}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors interactive"
                      >
                        <ListPlus className="w-6 h-6 text-white/50" />
                      </button>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-4 mt-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                    <Volume2 className="w-5 h-5 text-white/50" />
                    <div 
                      onClick={handleVolumeChange}
                      className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden interactive cursor-pointer"
                    >
                      <div 
                        className="h-full bg-white/60 rounded-full" 
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-24 glass-panel z-50 flex items-center justify-between px-6 border-t border-white/10">
        {/* Track Info & Static Album */}
        <div 
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-4 w-1/3 cursor-pointer group"
        >
          <motion.div 
            layoutId="album-art"
            className="w-16 h-16 rounded-md overflow-hidden relative interactive bg-white/5"
          >
            <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate group-hover:text-purple-400 transition-colors">{currentTrack.title}</h4>
            <p className="text-white/50 text-xs mt-0.5 truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(e); }}
              disabled={isLiking}
              className="transition-colors interactive hidden sm:block"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-purple-400 text-purple-400' : 'text-white/50 hover:text-white'}`} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaylistModalOpen(true); }}
              className="text-white/50 hover:text-white transition-colors interactive hidden sm:block"
            >
              <ListPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center w-1/3 gap-2">
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-white/50 hover:text-white transition-colors interactive hidden sm:block">
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); prevTrack(); }}
              className="text-white/70 hover:text-white transition-colors interactive"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform interactive shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextTrack(); }}
              className="text-white/70 hover:text-white transition-colors interactive"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleLoop(); }}
              className={`transition-colors interactive ${isLooping ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-[10px] text-white/50 font-mono">{formatTime(progress)}</span>
            <div 
              onClick={handleSeek}
              className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden group interactive cursor-pointer"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </div>
            <span className="text-[10px] text-white/50 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-4 w-1/3">
          <Volume2 className="w-4 h-4 text-white/70" />
          <div 
            onClick={handleVolumeChange}
            className="w-24 h-1 bg-white/10 rounded-full overflow-hidden interactive cursor-pointer"
          >
            <div 
              className="h-full bg-white/70 rounded-full" 
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <button 
            onClick={() => setIsExpanded(true)}
            className="text-white/50 hover:text-white transition-colors ml-2 interactive"
          >
            <Maximize2 className="w-4 h-4" id="expand-button" />
          </button>
        </div>
      </div>

      {currentTrack && (
        <AddToPlaylistModal 
          track={currentTrack} 
          isOpen={isPlaylistModalOpen} 
          onClose={() => setIsPlaylistModalOpen(false)} 
        />
      )}
    </>
  );
}
