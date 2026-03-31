import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, ArrowLeft, Loader2 } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Track } from '@/data/mockData';

export function LanguageExplore() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const displayLanguage = language ? language.charAt(0).toUpperCase() + language.slice(1) : '';

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        let searchTerm = language;
        let country = 'US';
        
        if (language?.toLowerCase() === 'hindi') {
          searchTerm = 'bollywood';
          country = 'IN';
        } else if (language?.toLowerCase() === 'tamil') {
          searchTerm = 'tamil';
          country = 'IN';
        } else if (language?.toLowerCase() === 'telugu') {
          searchTerm = 'telugu';
          country = 'IN';
        } else if (language?.toLowerCase() === 'malayalam') {
          searchTerm = 'malayalam';
          country = 'IN';
        } else if (language?.toLowerCase() === 'punjabi') {
          searchTerm = 'punjabi';
          country = 'IN';
        } else if (language?.toLowerCase() === 'english') {
          searchTerm = 'pop';
          country = 'US';
        }

        const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&media=music&entity=song&limit=200&country=${country}`);
        const data = await response.json();
        
        const fetchedTracks: Track[] = data.results
          .filter((item: any) => item.previewUrl) // Only keep tracks with previews
          .map((item: any) => ({
            id: item.trackId.toString(),
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName || 'Unknown Album',
            coverUrl: item.artworkUrl100.replace('100x100bb', '500x500bb'),
            duration: formatDuration(item.trackTimeMillis),
            audioUrl: item.previewUrl,
            language: displayLanguage
          }));
          
        setTracks(fetchedTracks);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (language) {
      fetchTracks();
    }
  }, [language, displayLanguage]);

  const formatDuration = (millis: number) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-20 z-20 bg-[#050505]/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-xl">
          <button 
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 mt-8 flex items-end gap-4 relative"
        >
          <div className="flex-1">
            <h1 className="font-display text-4xl font-bold mb-2">{displayLanguage} Songs</h1>
            <p className="text-white/60">Discover the best {displayLanguage} tracks</p>
          </div>

          <button 
            onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform interactive"
          >
            <Play className="w-4 h-4 fill-current" /> Play All
          </button>

          <button 
            onClick={() => navigate('/liked')}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors interactive"
            title="Liked Songs"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors interactive"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isHeaderMenuOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[#181818] border border-white/10 rounded-lg p-2 shadow-xl z-30 min-w-[120px]">
              <button 
                onClick={() => setIsHeaderMenuOpen(false)}
                className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 1) }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => playTrack(track, tracks)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden relative shrink-0">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{track.title}</h4>
                  <p className="text-white/50 text-sm truncate">{track.artist}</p>
                </div>
                <div className="hidden md:block text-white/50 text-sm w-1/3 truncate">
                  {track.album}
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white/50 hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <span className="text-white/50 text-sm">{track.duration}</span>
                  <button className="text-white/50 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl text-white/60">No {displayLanguage} songs available right now.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
