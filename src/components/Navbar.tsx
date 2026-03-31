import { Search, Bell, User as UserIcon, Clock, X, Music, PlayCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Track } from '@/data/mockData';
import { usePlayer } from '@/contexts/PlayerContext';
import { searchTracks } from '@/services/musicService';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { playTrack } = usePlayer();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const results = await searchTracks(searchQuery);
        setSearchResults(results.slice(0, 8));
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 left-20 z-30 transition-all duration-500 px-8 flex items-center justify-between",
        scrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      )}
    >
      <div className="flex-1 max-w-md relative group mt-4 mb-4" ref={searchRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
        <input 
          type="text" 
          placeholder="Search for global hits, Indian classics, or artists..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all interactive"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onClick={() => setIsSearchOpen(true)}
        />
        
        {/* Search Popup Window */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#121212] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {searchQuery.trim() ? (
              <>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Search Results</h3>
                  {isSearching && <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />}
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map(track => (
                      <button 
                        key={track.id}
                        onClick={() => {
                          playTrack(track);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{track.title}</p>
                          <p className="text-xs text-white/40 truncate">{track.artist}</p>
                        </div>
                      </button>
                    ))
                  ) : !isSearching ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-white/40">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-8 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                      <p className="text-xs text-white/40">Searching for real music...</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recent Searches</h3>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <Clock className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                    <span className="text-sm text-white/80 group-hover:text-white">Blinding Lights</span>
                    <X className="w-4 h-4 text-white/20 hover:text-white ml-auto" />
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group">
                    <Clock className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                    <span className="text-sm text-white/80 group-hover:text-white">The Weeknd</span>
                    <X className="w-4 h-4 text-white/20 hover:text-white ml-auto" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 mb-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-all interactive",
              isNotifOpen 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-black"></span>
          </button>

          {/* Notification Popup Window */}
          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#121212] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">Mark all as read</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                <div className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 group-hover:text-white"><span className="font-semibold">New Release</span> from The Weeknd</p>
                    <p className="text-xs text-white/40 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 group-hover:text-white">Your weekly <span className="font-semibold">Discover Mix</span> is ready</p>
                    <p className="text-xs text-white/40 mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group opacity-60">
                  <div className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 group-hover:text-white"><span className="font-semibold">Sarah</span> started following you</p>
                    <p className="text-xs text-white/40 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-white/5 text-center">
                <button className="text-xs text-white/60 hover:text-white font-medium transition-colors">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <Link to="/user" className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 pr-4 hover:bg-white/10 transition-all interactive">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="text-sm font-medium text-white/90">{user?.displayName || 'User'}</span>
        </Link>
      </div>
    </header>
  );
}
