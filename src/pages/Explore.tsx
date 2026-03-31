import { languages } from '@/data/mockData';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LanguageCard({ language, index }: { language: typeof languages[0], index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const navigate = useNavigate();

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ perspective: 1000 }}
      className="interactive"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/explore/${language.name.toLowerCase()}`)}
        className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${language.color} p-6 relative overflow-hidden group cursor-pointer shadow-lg`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
        <h3 
          className="font-display text-2xl font-bold text-white relative z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          {language.name}
        </h3>
        
        {/* Decorative elements */}
        <div 
          className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl"
          style={{ transform: "translateZ(10px)" }}
        />
      </motion.div>
    </motion.div>
  );
}

export function Explore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-32 pt-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-20 z-20 bg-[#050505]/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-xl mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors interactive w-max"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl font-bold mb-6">Explore</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="What do you want to listen to?" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all interactive shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        </motion.div>

        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Browse Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {languages.map((language, i) => (
              <LanguageCard key={language.id} language={language} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
