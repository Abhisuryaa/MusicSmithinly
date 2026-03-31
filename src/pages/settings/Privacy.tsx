import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-bold">Privacy & Security</h1>
          </div>
          <p className="text-white/60">Manage your data, privacy, and account security.</p>
        </motion.div>
        
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Social</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-white/80 block font-medium">Private Session</span>
                <span className="text-white/50 text-sm">Temporarily hide your listening activity from followers.</span>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative shrink-0">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
              </div>
            </label>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors w-full text-left">
              Change Password
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors w-full text-left mt-4">
              Manage Two-Factor Authentication
            </button>
            <button className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors w-full text-left mt-12">
              Sign Out Everywhere
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
