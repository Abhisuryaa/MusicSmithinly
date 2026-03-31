import { Home, Compass, Settings, Music } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlaylists } from '@/hooks/useFirestore';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { playlists } = useUserPlaylists(user?.uid);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
  ];

  return (
    <div className="w-20 shrink-0 z-50 relative">
      <aside 
        className={cn(
          "fixed top-0 left-0 h-screen bg-black border-r border-white/5 flex flex-col pt-8 pb-24 transition-all duration-300 overflow-hidden group",
          isOpen ? "w-64 px-6 shadow-[20px_0_50px_rgba(0,0,0,0.5)]" : "w-20 px-4 hover:w-64 hover:px-6 hover:shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
        )}
        onClick={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center mb-10 px-2 whitespace-nowrap overflow-hidden h-10">
          <h1 className="text-2xl font-bold tracking-tighter text-white shrink-0">
            Smithinly
          </h1>
        </div>

        <nav className="space-y-6 w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="space-y-1">
            <p className={cn(
              "text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2 transition-opacity duration-300 whitespace-nowrap",
              isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-2 py-2.5 rounded-lg transition-all duration-300 interactive group/item whitespace-nowrap",
                    isActive 
                      ? "text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                <span className={cn(
                  "font-medium text-sm transition-opacity duration-300",
                  isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>

          <div className="space-y-1">
            <p className={cn(
              "text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2 transition-opacity duration-300 whitespace-nowrap",
              isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              Playlists
            </p>

            {/* User Playlists */}
            {playlists.map((playlist) => (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-2 py-2.5 rounded-lg transition-all duration-300 interactive group/item whitespace-nowrap",
                    isActive 
                      ? "text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )
                }
              >
                <Music className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                <span className={cn(
                  "font-medium text-sm transition-opacity duration-300 truncate",
                  isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {playlist.title}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="mt-auto w-full">
          <NavLink 
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-2 py-2.5 rounded-lg transition-all duration-300 interactive group/item whitespace-nowrap",
                isActive 
                  ? "text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )
            }
          >
            <Settings className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
            <span className={cn(
              "font-medium text-sm transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              Settings
            </span>
          </NavLink>
        </div>
      </aside>
    </div>
  );
}
