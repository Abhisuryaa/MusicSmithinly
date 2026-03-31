import { motion } from 'framer-motion';
import { ArrowLeft, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Appearance() {
  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Monitor className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-bold">Appearance</h1>
          </div>
          <p className="text-white/60">Customize how Smithin Music looks and feels.</p>
        </motion.div>
        
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Theme</h3>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-white/10 border border-purple-500 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.2)]">Dark</button>
              <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors">Light</button>
              <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors">System</button>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Player Visuals</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/80">Enable 3D Album Art</span>
              <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </label>
            <div className="h-px bg-white/10 w-full my-6" />
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/80">Show Lyrics Background</span>
              <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
