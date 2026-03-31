import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Heart, MoreHorizontal, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { Track } from '@/data/mockData';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { removeTrackFromPlaylist, deletePlaylist } from '@/hooks/useFirestore';

interface PlaylistData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: any;
  tracks?: Track[];
}

export function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const docRef = doc(db, 'playlists', id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPlaylist({ id: docSnap.id, ...docSnap.data() } as PlaylistData);
        setError(null);
      } else {
        setError("Playlist not found");
        setPlaylist(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching playlist:", err);
      setError("Failed to load playlist");
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  const handleRemoveTrack = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    if (!id || !playlist) return;
    try {
      await removeTrackFromPlaylist(id, track);
      // No need to refresh local state manually, onSnapshot will handle it
    } catch (err) {
      console.error("Failed to remove track:", err);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    try {
      await deletePlaylist(id);
      navigate('/playlists');
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen pb-32 pt-28 px-8 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen pb-32 pt-28 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">{error || "Playlist not found"}</h1>
        <Link to="/user" className="px-8 py-3 bg-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Go Back
        </Link>
      </div>
    );
  }

  const playlistTracks = playlist.tracks || [];
  const isOwner = user?.uid === playlist.ownerId;

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative pt-24 pb-12 px-8 flex flex-col gap-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive w-max z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex items-end gap-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img 
              src={playlist.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80'} 
              alt="Background" 
              className="w-full h-full object-cover blur-[100px] opacity-30 scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-52 h-52 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black"
          >
            <img 
              src={playlist.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80'} 
              alt={playlist.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-end pb-2"
          >
            <span className="text-sm font-medium text-white/70 uppercase tracking-widest mb-2">Playlist</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-4">{playlist.title}</h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl mb-4">{playlist.description}</p>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="text-white font-medium">{isOwner ? 'You' : 'User'}</span>
              <span>•</span>
              <span>{playlistTracks.length} songs</span>
              <span>•</span>
              <span>{playlistTracks.length > 0 ? 'about 2 hr 15 min' : '0 min'}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-8 py-6 flex items-center gap-6 sticky top-20 z-20 bg-black/50 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-purple-500 text-white flex items-center justify-center hover:scale-105 transition-transform interactive shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
        <button 
          onClick={() => navigate('/liked')}
          className="text-white/50 hover:text-white transition-colors interactive"
          title="Liked Songs"
        >
          <Heart className="w-8 h-8" />
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/50 hover:text-white transition-colors interactive"
          >
            <MoreHorizontal className="w-8 h-8" />
          </button>
          
          {isMenuOpen && isOwner && (
            <div className="absolute left-0 top-full mt-2 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl z-30 min-w-[120px]">
              <button 
                onClick={handleDeletePlaylist}
                className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-md transition-colors"
              >
                Delete Playlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tracklist */}
      <div className="px-8 pt-6">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-white/50 border-b border-white/10 mb-4">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="w-12 flex justify-end"><Clock className="w-4 h-4" /></div>
        </div>

        <div className="space-y-1">
          {playlistTracks.length > 0 ? (
            playlistTracks.map((track: any, index: number) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <motion.div 
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => playTrack(track, playlistTracks)}
                  className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group interactive items-center cursor-pointer"
                >
                  <div className="w-8 text-center text-white/50 group-hover:text-white">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center gap-0.5 h-3">
                        <motion.div animate={{ height: ['20%', '100%', '20%'] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-0.5 bg-purple-500" />
                        <motion.div animate={{ height: ['100%', '20%', '100%'] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-0.5 bg-purple-500" />
                        <motion.div animate={{ height: ['40%', '100%', '40%'] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-0.5 bg-purple-500" />
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 fill-current hidden group-hover:inline-block" />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                    <div className="flex flex-col">
                      <span className={isCurrent ? 'text-purple-400 font-medium' : 'text-white font-medium'}>{track.title}</span>
                      <span className="text-white/50 text-sm">{track.artist}</span>
                    </div>
                  </div>
                  <div className="text-white/50 text-sm flex items-center">{track.album}</div>
                  <div className="w-12 text-right text-white/50 text-sm flex items-center justify-end gap-4">
                    <span>{track.duration}</span>
                    {isOwner && (
                      <button 
                        onClick={(e) => handleRemoveTrack(e, track)}
                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-white/50 py-8">
              No tracks in this playlist yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
