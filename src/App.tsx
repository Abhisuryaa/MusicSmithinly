/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { LanguageExplore } from '@/pages/LanguageExplore';
import { Playlist } from '@/pages/Playlist';
import { User } from '@/pages/User';
import { LikedSongsPage } from '@/pages/LikedSongsPage';
import { PlaylistsPage } from '@/pages/PlaylistsPage';
import { Settings } from '@/pages/Settings';
import { Appearance } from '@/pages/settings/Appearance';
import { Audio } from '@/pages/settings/Audio';
import { Notifications } from '@/pages/settings/Notifications';
import { Privacy } from '@/pages/settings/Privacy';
import { Subscription } from '@/pages/settings/Subscription';
import { IntroAnimation } from '@/components/IntroAnimation';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      setShowIntro(false);
    }
  }, [user, loading]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <PlayerProvider>
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="explore/:language" element={<LanguageExplore />} />
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="user" element={<User />} />
            <Route path="liked" element={<LikedSongsPage />} />
            <Route path="playlists" element={<PlaylistsPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/appearance" element={<Appearance />} />
            <Route path="settings/audio" element={<Audio />} />
            <Route path="settings/notifications" element={<Notifications />} />
            <Route path="settings/privacy" element={<Privacy />} />
            <Route path="settings/subscription" element={<Subscription />} />
            {/* Fallback routes for demo */}
            <Route path="library" element={<div className="p-8 pt-28"><h1 className="text-3xl font-bold">Library</h1></div>} />
            <Route path="create" element={<div className="p-8 pt-28"><h1 className="text-3xl font-bold">Create Playlist</h1></div>} />
            <Route path="liked" element={<div className="p-8 pt-28"><h1 className="text-3xl font-bold">Liked Songs</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
