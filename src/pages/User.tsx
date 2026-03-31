import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Edit3, Settings, Play, MoreHorizontal, Clock, LogOut, Plus, X, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockTracks, mockArtists } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { useUserPlaylists, useLikedSongs, useRecentlyPlayed, removeFromLikedSongs, deletePlaylist } from '@/hooks/useFirestore';
import { usePlayer } from '@/contexts/PlayerContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function User() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { playlists, loading: playlistsLoading } = useUserPlaylists(user?.uid);
  const { likedSongs, loading: likedSongsLoading } = useLikedSongs(user?.uid);
  const { recentlyPlayed, loading: recentlyPlayedLoading } = useRecentlyPlayed(user?.uid);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [playlistMenuOpenId, setPlaylistMenuOpenId] = useState<string | null>(null);

  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { playTrack } = usePlayer();

  const handleRemoveLikedSong = async (trackId: string) => {
    if (!user) return;
    try {
      await removeFromLikedSongs(user.uid, trackId);
      setMenuOpenId(null);
    } catch (error) {
      console.error("Error removing liked song:", error);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
      window.location.reload(); // To trigger the intro animation again
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlaylistTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'playlists'), {
        title: newPlaylistTitle.trim(),
        description: newPlaylistDescription.trim(),
        ownerId: user.uid,
        isPublic: true,
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', // Default cover
        createdAt: serverTimestamp()
      });
      setIsCreatingPlaylist(false);
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pb-32 pt-28 px-8 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-32 pt-28 px-8 flex flex-col items-center justify-center text-center">
        <UserIcon className="w-24 h-24 text-white/20 mb-6" />
        <h1 className="text-3xl font-bold mb-4">You are not logged in</h1>
        <p className="text-white/60 mb-8 max-w-md">Sign in to view your profile, playlists, and liked songs.</p>
        <button 
          onClick={() => {
            navigate('/');
            window.location.reload();
          }} 
          className="px-8 py-3 bg-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 pt-24 px-8 relative">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive w-max mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] shrink-0 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-24 h-24 text-white" />
              )}
            </div>
            <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-8 h-8 text-white" />
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pb-4 flex-1"
          >
            <span className="text-sm font-medium text-white/70 uppercase tracking-widest mb-2 block">Profile</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">{user?.displayName || 'User'}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-6">
              <span className="hover:text-white cursor-pointer transition-colors"><strong className="text-white">{playlists.length}</strong> Public Playlists</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="hover:text-white cursor-pointer transition-colors"><strong className="text-white">245</strong> Followers</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="hover:text-white cursor-pointer transition-colors"><strong className="text-white">128</strong> Following</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10">
                Edit Profile
              </button>
              <Link to="/settings" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10">
                <Settings className="w-5 h-5" />
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors border border-white/10" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Top Tracks & Playlists */}
          <div className="lg:col-span-2 space-y-12">
            {/* Top Tracks */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Liked Songs</h2>
                <button onClick={() => navigate('/liked')} className="text-sm font-medium text-white/60 hover:text-white transition-colors">See All</button>
              </div>
              <div className="space-y-2">
                {likedSongsLoading ? (
                  <div className="text-white/40">Loading liked songs...</div>
                ) : likedSongs.length > 0 ? (
                  likedSongs.slice(0, 4).map((likedSong, index) => {
                    const track = likedSong;
                    if (!track) return null;
                    return (
                      <div 
                        key={likedSong.id} 
                        onClick={() => playTrack(track, likedSongs)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
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
                        <div className="hidden md:block text-white/50 text-sm truncate w-1/3 hover:underline">
                          {track.album}
                        </div>
                        <span className="text-white/50 text-sm w-12 text-right">{track.duration}</span>
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === track.id ? null : track.id); }}
                            className="text-white/50 hover:text-white transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {menuOpenId === track.id && (
                            <div className="absolute right-0 top-8 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl z-30">
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
                    );
                  })
                ) : (
                  <div className="text-white/40">No liked songs yet.</div>
                )}
              </div>
            </section>

            {/* Public Playlists */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Public Playlists</h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsCreatingPlaylist(true)}
                    className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create
                  </button>
                  <button 
                    onClick={() => navigate('/playlists')}
                    className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                  >
                    See All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {playlistsLoading ? (
                  <div className="text-white/40 col-span-full">Loading playlists...</div>
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="group bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 relative">
                      <div className="absolute top-2 right-2 z-20">
                        <button 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation();
                            setPlaylistMenuOpenId(playlistMenuOpenId === playlist.id ? null : playlist.id); 
                          }}
                          className="p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-5 h-5 text-white" />
                        </button>
                        {playlistMenuOpenId === playlist.id && (
                          <div className="absolute right-0 top-10 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl min-w-[120px]">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePlaylist(playlist.id);
                                setPlaylistMenuOpenId(null);
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
                  ))
                ) : (
                  <div className="text-white/40 col-span-full">No playlists created yet.</div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Recently Played */}
          <div className="space-y-12">
            {/* Recently Played */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Recently Played</h2>
              </div>
              <div className="space-y-3">
                {recentlyPlayedLoading ? (
                  <div className="text-white/40">Loading recently played...</div>
                ) : recentlyPlayed.length > 0 ? (
                  recentlyPlayed.slice(0, 5).map((track) => (
                    <div 
                      key={`recent-${track.id}`} 
                      onClick={() => playTrack(track, recentlyPlayed)}
                      className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white/90 text-sm font-medium truncate group-hover:text-purple-400 transition-colors">{track.title}</h4>
                        <p className="text-white/50 text-xs truncate">{track.artist}</p>
                      </div>
                      <Clock className="w-3 h-3 text-white/30" />
                    </div>
                  ))
                ) : (
                  <div className="text-white/40">No recently played songs.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Create Playlist Modal */}
      {isCreatingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#181818] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Playlist</h2>
              <button 
                onClick={() => setIsCreatingPlaylist(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="My Awesome Playlist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                <textarea 
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
                  placeholder="Add an optional description"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreatingPlaylist(false)}
                  className="px-6 py-2.5 rounded-full font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newPlaylistTitle.trim()}
                  className="px-6 py-2.5 rounded-full font-medium bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
