import { Play, Heart, Plus } from 'lucide-react';
import { Track } from '@/data/mockData';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { useLikedSongs, toggleLikeSong } from '@/hooks/useFirestore';
import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface MusicCardProps {
  track: Track;
  index: number;
  queue?: Track[];
}

export function MusicCard({ track, index, queue }: MusicCardProps) {
  const { user } = useAuth();
  const { likedSongs } = useLikedSongs(user?.uid);
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [isLiking, setIsLiking] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isLiked = likedSongs.some(song => song.id === track.id);
  const isCurrentTrack = currentTrack?.id === track.id;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    setIsLiking(true);
    try {
      await toggleLikeSong(user.uid, track, isLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTrack(track, queue);
  };

  const handleOpenAddModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 interactive p-3"
      >
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <motion.button 
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Play className="w-5 h-5 fill-current ml-1" />
            </motion.button>
          </div>
          
          {/* Hover Sound Wave Animation */}
          <div className={`absolute bottom-2 left-2 right-2 flex items-end justify-center gap-1 h-6 transition-opacity duration-300 ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-t-full"
                animate={{ height: isCurrentTrack && isPlaying ? ['20%', '100%', '20%'] : '20%' }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Actions Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {user && (
              <>
                <button 
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors ${isLiked ? 'opacity-100' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-purple-500 text-purple-500' : 'text-white'}`} />
                </button>
                <button 
                  onClick={handleOpenAddModal}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors text-white"
                  title="Add to Playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div>
          <h3 className={`font-medium text-sm truncate transition-colors ${isCurrentTrack ? 'text-purple-400' : 'text-white'}`}>{track.title}</h3>
          <p className="text-white/50 text-xs mt-1 truncate">{track.artist}</p>
        </div>
      </motion.div>

      <AddToPlaylistModal 
        track={track}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
