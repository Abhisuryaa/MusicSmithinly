import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, getDocs, orderBy, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { Track } from '../data/mockData';

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: any;
  tracks?: Track[];
}

export interface LikedSong extends Track {
  likedAt: any;
}

export function useUserPlaylists(userId: string | undefined) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'playlists'),
      where('ownerId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPlaylists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Playlist[];
      // Sort client-side to avoid needing a composite index
      newPlaylists.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setPlaylists(newPlaylists);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching playlists:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { playlists, loading };
}

export function useLikedSongs(userId: string | undefined) {
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLikedSongs([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${userId}/liked_songs`)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLikedSongs = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as LikedSong[];
      
      newLikedSongs.sort((a, b) => {
        const timeA = a.likedAt?.toMillis?.() || 0;
        const timeB = b.likedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      
      setLikedSongs(newLikedSongs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching liked songs:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { likedSongs, loading };
}

export const toggleLikeSong = async (userId: string, track: Track, isLiked: boolean) => {
  if (!userId) return;
  
  const docRef = doc(db, `users/${userId}/liked_songs`, track.id);
  
  try {
    if (isLiked) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        ...track,
        likedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const addTrackToPlaylist = async (playlistId: string, track: Track) => {
  const playlistRef = doc(db, 'playlists', playlistId);
  try {
    await updateDoc(playlistRef, {
      tracks: arrayUnion(track)
    });
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
};

export const removeTrackFromPlaylist = async (playlistId: string, track: Track) => {
  const playlistRef = doc(db, 'playlists', playlistId);
  try {
    await updateDoc(playlistRef, {
      tracks: arrayRemove(track)
    });
  } catch (error) {
    console.error("Error removing track from playlist:", error);
    throw error;
  }
};

export const deletePlaylist = async (playlistId: string) => {
  const playlistRef = doc(db, 'playlists', playlistId);
  try {
    await deleteDoc(playlistRef);
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
};

export const removeFromLikedSongs = async (userId: string, trackId: string) => {
  const docRef = doc(db, `users/${userId}/liked_songs`, trackId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error removing from liked songs:", error);
    throw error;
  }
};

export function useRecentlyPlayed(userId: string | undefined) {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecentlyPlayed([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${userId}/recently_played`)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tracks = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Track[];
      
      tracks.sort((a: any, b: any) => {
        const timeA = a.playedAt?.toMillis?.() || 0;
        const timeB = b.playedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      
      setRecentlyPlayed(tracks);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recently played:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { recentlyPlayed, loading };
}

export const addToRecentlyPlayed = async (userId: string, track: Track) => {
  if (!userId) return;
  
  const docRef = doc(db, `users/${userId}/recently_played`, track.id);
  
  try {
    await setDoc(docRef, {
      ...track,
      playedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding to recently played:", error);
  }
};
