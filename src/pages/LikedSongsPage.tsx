import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, MoreHorizontal, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLikedSongs, removeFromLikedSongs } from '@/hooks/useFirestore';
import { usePlayer } from '@/contexts/PlayerContext';
import { motion } from 'framer-motion';

export function LikedSongsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likedSongs, loading } = useLikedSongs(user?.uid);
  const { playTrack } = usePlayer();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleRemoveLikedSong = async (trackId: string) => {
    if (!user) return;
    try {
      await removeFromLikedSongs(user.uid, trackId);
      setMenuOpenId(null);
    } catch (error) {
      console.error("Error removing liked song:", error);
    }
  };

  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-0 z-20 bg-[#050505]/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-xl">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <h1 className="font-display text-4xl font-bold mb-8 mt-8">Liked Songs</h1>

        {loading ? (
          <div className="text-white/40">Loading...</div>
        ) : (
          <div className="space-y-2">
            {likedSongs.map((track, index) => (
              <div 
                key={track.id} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer relative"
                onClick={() => playTrack(track, likedSongs)}
              >
                <span className="w-6 text-center text-white/50 font-medium group-hover:hidden">{index + 1}</span>
                <button className="w-6 text-center text-white hidden group-hover:block">
                  <Play className="w-4 h-4 mx-auto fill-current" />
                </button>
                <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded object-cover shadow-md" referrerPolicy="no-referrer" />
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">{track.title}</h4>
                  <p className="text-white/50 text-sm truncate hover:underline">{track.artist}</p>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === track.id ? null : track.id); }}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {menuOpenId === track.id && (
                    <div className="absolute right-0 top-12 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl z-30">
                      <button 
                        onClick={() => handleRemoveLikedSong(track.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
