import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlaylists, addTrackToPlaylist } from '@/hooks/useFirestore';
import { Track } from '@/data/mockData';

interface AddToPlaylistModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({ track, isOpen, onClose }: AddToPlaylistModalProps) {
  const { user } = useAuth();
  const { playlists, loading } = useUserPlaylists(user?.uid);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addTrackToPlaylist(playlistId, track);
      onClose();
    } catch (error) {
      console.error("Failed to add track to playlist:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                <p className="text-sm text-white/50 mt-1">Select a playlist for "{track.title}"</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : playlists.length > 0 ? (
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group text-left"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        {playlist.coverUrl ? (
                          <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-6 h-6 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">{playlist.title}</h3>
                        <p className="text-xs text-white/40 truncate">{playlist.tracks?.length || 0} songs</p>
                      </div>
                      <Plus className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 mb-4">You haven't created any playlists yet.</p>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-purple-500 text-white rounded-full text-sm font-semibold"
                  >
                    Go to Profile to Create
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
