import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, MoreHorizontal, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlaylists, deletePlaylist } from '@/hooks/useFirestore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function PlaylistsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlists, loading } = useUserPlaylists(user?.uid);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
      setMenuOpenId(null);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-20 z-20 bg-[#050505]/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-xl flex items-center justify-between">
          <button 
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button 
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>

        <h1 className="font-display text-4xl font-bold mb-8 mt-8">Your Playlists</h1>

        {loading ? (
          <div className="text-white/40">Loading playlists...</div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {playlists.map((playlist) => (
              <Link 
                key={playlist.id} 
                to={`/playlist/${playlist.id}`} 
                className="group bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 relative"
              >
                <div className="absolute top-2 right-2 z-20">
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === playlist.id ? null : playlist.id); 
                    }}
                    className="p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                  {menuOpenId === playlist.id && (
                    <div className="absolute right-0 top-10 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl min-w-[120px]">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeletePlaylist(playlist.id);
                        }}
                        className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={playlist.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80'} 
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-1 truncate">{playlist.title}</h3>
                <p className="text-sm text-white/60 line-clamp-2">{playlist.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/40 mb-4">No playlists found</p>
            <button 
              onClick={() => navigate('/user')}
              className="px-6 py-2 bg-purple-500 text-white rounded-full font-medium hover:scale-105 transition-transform"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
