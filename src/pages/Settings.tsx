import { motion } from 'framer-motion';
import { Bell, Shield, Monitor, Headphones, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Settings() {
  const navigate = useNavigate();
  const sections = [
    { id: 'appearance', icon: Monitor, title: 'Appearance', description: 'Theme, player visuals, and display options.' },
    { id: 'audio', icon: Headphones, title: 'Audio Quality', description: 'Streaming quality, downloads, and equalizer.' },
    { id: 'notifications', icon: Bell, title: 'Notifications', description: 'Push notifications, emails, and updates.' },
    { id: 'privacy', icon: Shield, title: 'Privacy & Security', description: 'Account security, connected apps, and data.' },
    { id: 'subscription', icon: CreditCard, title: 'Subscription', description: 'Manage your Smithin Music Premium plan.' },
  ];

  return (
    <div className="min-h-screen pb-32 pt-24 px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive w-max mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl font-bold mb-2">Settings</h1>
          <p className="text-white/60">Manage your account settings and preferences.</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <Link to={`/settings/${section.id}`} key={section.id} className="block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex items-center gap-6 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-1">{section.title}</h3>
                  <p className="text-sm text-white/50">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
