import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Notifications() {
  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-bold">Notifications</h1>
          </div>
          <p className="text-white/60">Choose what you want to be notified about.</p>
        </motion.div>
        
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-white/80 block font-medium">New Music</span>
                <span className="text-white/50 text-sm">Get notified when artists you follow release new music.</span>
              </div>
              <div className="w-12 h-6 bg-purple-500 rounded-full relative shrink-0">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </label>
            <div className="h-px bg-white/10 w-full" />
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-white/80 block font-medium">Concerts & Events</span>
                <span className="text-white/50 text-sm">Updates about live shows near you.</span>
              </div>
              <div className="w-12 h-6 bg-purple-500 rounded-full relative shrink-0">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </label>
            <div className="h-px bg-white/10 w-full" />
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-white/80 block font-medium">Email Newsletters</span>
                <span className="text-white/50 text-sm">Weekly digests and personalized recommendations.</span>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative shrink-0">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
