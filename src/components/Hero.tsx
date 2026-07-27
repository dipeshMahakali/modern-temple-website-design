import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Heart, ShieldAlert } from 'lucide-react';

interface HeroProps {
  setActivePage: (page: string) => void;
}

export default function Hero({ setActivePage }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-[10000ms]"
        style={{ 
          backgroundImage: `url('/assets/hero-bg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B1E1E]/50 via-black/60 to-[#FFF9F2] z-10" />

      {/* Floating Elements (Spiritual Bells & Flags) */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
        {/* Floating Bell 1 */}
        <motion.div
          className="absolute top-24 left-[15%] w-16 h-16 opacity-30"
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="https://img.icons8.com/color/96/temple-bell.png" alt="Bell" className="w-full h-full filter invert brightness-200" />
        </motion.div>

        {/* Floating Bell 2 */}
        <motion.div
          className="absolute top-36 right-[15%] w-14 h-14 opacity-25"
          animate={{ y: [0, 12, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <img src="https://img.icons8.com/color/96/temple-bell.png" alt="Bell" className="w-full h-full filter invert brightness-200" />
        </motion.div>

        {/* Floating Kalash */}
        <motion.div
          className="absolute bottom-32 left-[10%] w-16 h-16 opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="https://img.icons8.com/external-flat-round-flat-round-ananyabiru/96/external-kalash-diwali-flat-round-flat-round-ananyabiru.png" alt="Kalash" className="w-full h-full filter invert brightness-200" />
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="relative z-30 text-center max-w-4xl px-6 mt-16 flex flex-col items-center">
        {/* Small Ribbon / Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-primary-gold/25 border border-primary-gold/40 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-primary-gold animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#E8D7A5] font-semibold">
            UNESCO World Heritage Precinct & Shakti Peeth
          </span>
        </motion.div>

        {/* Gujarati Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-gujarati font-bold text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] gold-text-glow"
        >
          જય શ્રી મહાકાળી માતાજી
        </motion.h1>

        {/* English Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-[#E8D7A5] tracking-wide mb-6 font-semibold"
        >
          Shree Mahakali Mataji Temple, Pavagadh
        </motion.h2>

        {/* Subtitle description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/80 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-sans"
        >
          Experience the divine presence at Gujarat's historic hilltop shrine, standing tall for over 1500 years as a sacred source of ultimate power and architectural heritage.
        </motion.p>

        {/* CTA Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => {
              setActivePage('darshan');
              window.scrollTo({ top: 500, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-white text-deep-maroon font-bold px-8 py-4 rounded-full w-full sm:w-auto shadow-xl hover:bg-white-card/90 transition-all duration-300 hover:-translate-y-1"
          >
            <Play className="w-4 h-4 fill-deep-maroon text-deep-maroon" />
            <span>Live Darshan</span>
          </button>
          
          <button
            onClick={() => {
              setActivePage('donate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-primary-gold text-white font-bold px-8 py-4 rounded-full w-full sm:w-auto shadow-xl hover:bg-primary-gold/90 transition-all duration-300 hover:-translate-y-1"
          >
            <Heart className="w-4 h-4" />
            <span>Donate Online</span>
          </button>

          <button
            onClick={() => {
              setActivePage('instructions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-transparent text-[#E8D7A5] border border-light-gold-border/40 font-semibold px-8 py-4 rounded-full w-full sm:w-auto hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Instructions</span>
          </button>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave/Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF9F2] to-transparent z-20" />
    </div>
  );
}
