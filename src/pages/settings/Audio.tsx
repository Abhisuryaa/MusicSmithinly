import { motion } from 'framer-motion';
import { ArrowLeft, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Audio() {
  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-bold">Audio Quality</h1>
          </div>
          <p className="text-white/60">Manage your streaming and download quality.</p>
        </motion.div>
        
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Streaming Quality</h3>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer">
              <option value="auto" className="bg-black text-white">Auto (Recommended)</option>
              <option value="low" className="bg-black text-white">Low (24kbps)</option>
              <option value="normal" className="bg-black text-white">Normal (96kbps)</option>
              <option value="high" className="bg-black text-white">High (160kbps)</option>
              <option value="very-high" className="bg-black text-white">Very High (320kbps)</option>
              <option value="lossless" className="bg-black text-white">Lossless (ALAC up to 24-bit/192 kHz)</option>
            </select>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-medium mb-4">Equalizer</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/80">Enable Equalizer</span>
              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
              </div>
            </label>
            <p className="text-sm text-white/40 mt-2">Fine-tune your audio experience with custom EQ presets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
