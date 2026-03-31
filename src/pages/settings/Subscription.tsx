import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Subscription() {
  return (
    <div className="min-h-screen pb-32 pt-28 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-bold">Subscription</h1>
          </div>
          <p className="text-white/60">Manage your Smithin Music Premium plan.</p>
        </motion.div>
        
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-purple-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                Current Plan
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Premium Individual</h2>
              <p className="text-white/60 mb-6">$10.99 / month</p>
              
              <ul className="space-y-3 mb-8">
                {['Ad-free music listening', 'Play anywhere - even offline', 'On-demand playback', 'High fidelity lossless audio'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-purple-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  Update Payment Method
                </button>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
