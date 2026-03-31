import { HeroScene } from '@/components/HeroScene';
import { MusicCard } from '@/components/MusicCard';
import { Track, mockArtists, mockPlaylists } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Play, Loader2, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchTracks, getRegionalHits } from '@/services/musicService';

const LANGUAGES = [
  { id: 'Hindi', label: 'Hindi' },
  { id: 'Tamil', label: 'Tamil' },
  { id: 'Telugu', label: 'Telugu' },
  { id: 'Punjabi', label: 'Punjabi' },
  { id: 'Malayalam', label: 'Malayalam' },
  { id: 'Kannada', label: 'Kannada' },
];

export function Home() {
  const [regionalTracks, setRegionalTracks] = useState<Track[]>([]);
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [regionalLoading, setRegionalLoading] = useState(true);

  useEffect(() => {
    const fetchRegional = async () => {
      setRegionalLoading(true);
      try {
        const results = await getRegionalHits(selectedLang);
        setRegionalTracks(results.slice(0, 12));
      } catch (error) {
        console.error(`Failed to fetch ${selectedLang} tracks:`, error);
      } finally {
        setRegionalLoading(false);
      }
    };
    fetchRegional();
  }, [selectedLang]);

  return (
    <div className="min-h-screen pb-32 pt-20">
      <HeroScene />
      
      <div className="relative z-10 px-8 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-16"
        >
          <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Listen to the <br />
            <span className="text-gradient">Future of Sound</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl">
            Immerse yourself in a high-fidelity audio experience with spatial sound and curated futuristic beats.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform interactive flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Start Listening
            </button>
            <button className="glass px-8 py-3 rounded-full font-medium text-white hover:bg-white/10 transition-colors interactive">
              Explore Premium
            </button>
          </div>
        </motion.div>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Regional Hits</span>
              </div>
              <h2 className="font-display text-3xl font-bold">Indian Languages</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedLang === lang.id 
                      ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          {regionalLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-white/40 animate-pulse">Fetching {selectedLang} hits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {regionalTracks.map((track, i) => (
                <MusicCard key={track.id} track={track} index={i} queue={regionalTracks} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Trending Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockArtists.map((artist, i) => (
              <motion.div 
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center group interactive cursor-pointer"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 relative">
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">{artist.name}</h3>
                <p className="text-white/50 text-sm">{artist.followers} followers</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Curated Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPlaylists.map((playlist, i) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-panel rounded-2xl p-4 flex gap-6 group interactive cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-display text-xl font-bold mb-2">{playlist.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{playlist.description}</p>
                  <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                    {playlist.tracks.length} Tracks
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
