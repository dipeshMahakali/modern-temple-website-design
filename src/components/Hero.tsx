import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Heart, ShieldAlert } from 'lucide-react';

const TempleIcon = () => (
  <svg
    className="w-full h-full text-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Flag (Dhvaj) - Vibrantly colored */}
    <path d="M32 4 V12" stroke="#FFD700" strokeWidth="1.5" />
    <path d="M32 4 H44 L38 8 H32" fill="#E53935" stroke="#E53935" strokeWidth="0.5" />
    <circle cx="32" cy="3" r="1" fill="#FFD700" />

    {/* Kalasha (Golden dome top) */}
    <path d="M29 12 C29 10 35 10 35 12 Z" fill="#FFD700" />
    <circle cx="32" cy="10" r="1.5" fill="#FFD700" />

    {/* Shikhara (Main Spire) with layered carvings */}
    <path d="M32 12 C28 20 26 30 25 44 H39 C38 30 36 20 32 12Z" fill="currentColor" />

    {/* Horizontal bands of the shikhara */}
    <path d="M28 20 H36" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <path d="M27 28 H37" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <path d="M26 36 H38" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

    {/* Vertical accent lines representing carvings */}
    <path d="M32 12 V44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M30 16 C30 25 28 35 27 44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M34 16 C34 25 36 35 37 44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

    {/* Mandapa base levels (Steps / Tiers) */}
    <path d="M21 44 H43 V48 H21 Z" fill="currentColor" opacity="0.9" />
    <path d="M17 48 H47 V52 H17 Z" fill="currentColor" opacity="0.9" />
    <path d="M13 52 H51 V57 H13 Z" fill="currentColor" opacity="0.9" />
  </svg>
);

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

      {/* Floating Elements (Spiritual Temple Spires) */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block animate-fade-in">
        {/* Floating Temple 1 (Top Left) */}
        <motion.div
          className="absolute top-24 left-[10%] w-16 h-16"
          animate={{ y: [0, -15, 0], rotate: [-8, 4, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <TempleIcon />
        </motion.div>

        {/* Floating Temple 2 (Top Right) */}
        <motion.div
          className="absolute top-28 right-[12%] w-14 h-14"
          animate={{ y: [0, 12, 0], rotate: [6, -6, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <TempleIcon />
        </motion.div>

        {/* Floating Temple 3 (Top Center Left) */}
        <motion.div
          className="absolute top-16 left-[38%] w-12 h-12"
          animate={{ y: [0, -10, 0], rotate: [-4, 6, -4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <TempleIcon />
        </motion.div>

        {/* Floating Temple 4 (Bottom Left) */}
        <motion.div
          className="absolute bottom-32 left-[8%] w-16 h-16"
          animate={{ y: [0, 15, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <TempleIcon />
        </motion.div>

        {/* Floating Temple 5 (Bottom Right) */}
        <motion.div
          className="absolute bottom-24 right-[10%] w-16 h-16"
          animate={{ y: [0, -12, 0], rotate: [8, -4, 8] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <TempleIcon />
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
            Historic Shakti Peeth & Pilgrimage Sanctuary
          </span>
        </motion.div>

        {/* Hindi Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-devanagari font-bold text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] gold-text-glow"
        >
          जय माँ बम्लेश्वरी
        </motion.h1>

        {/* English Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-[#E8D7A5] tracking-wide mb-6 font-semibold"
        >
          Welcome to Dongargarh Maa Bamleshwari Temple
        </motion.h2>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/80 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-sans"
        >
          Explore one of Chhattisgarh's most revered Shakti Peeths, perched majestically on the 1,600-foot high hills of Dongargarh in Rajnandgaon, drawing millions of seeking souls.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => {
              setActivePage('darshan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-white text-deep-maroon font-bold px-6 py-3.5 rounded-full shadow-xl hover:bg-white-card/90 transition-all duration-300 hover:-translate-y-1 focus:outline-none text-sm"
          >
            <Play className="w-4 h-4 fill-deep-maroon text-deep-maroon" />
            <span>Live Darshan</span>
          </button>

          <button
            onClick={() => {
              setActivePage('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-primary-gold text-white font-bold px-6 py-3.5 rounded-full shadow-xl hover:bg-primary-gold/90 transition-all duration-300 hover:-translate-y-1 focus:outline-none text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Temple History</span>
          </button>

          <button
            onClick={() => {
              setActivePage('instructions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-transparent text-[#E8D7A5] border border-light-gold-border/40 font-semibold px-6 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 focus:outline-none text-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Plan Your Visit</span>
          </button>

          <button
            onClick={() => {
              setActivePage('donate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center space-x-2 bg-deep-maroon text-white font-bold px-6 py-3.5 rounded-full shadow-xl hover:bg-deep-maroon/90 transition-all duration-300 hover:-translate-y-1 focus:outline-none text-sm border border-primary-gold/25"
          >
            <Heart className="w-4 h-4 text-primary-gold fill-primary-gold" />
            <span>Donate</span>
          </button>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave/Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF9F2] to-transparent z-20" />
    </div>
  );
}
