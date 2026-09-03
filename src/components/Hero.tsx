import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';
import { getImageUrl } from '../utils/image';

const TempleIcon = () => (
  <svg
    className="w-full h-full text-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M32 4 V12" stroke="#FFD700" strokeWidth="1.5" />
    <path d="M32 4 H44 L38 8 H32" fill="#E53935" stroke="#E53935" strokeWidth="0.5" />
    <circle cx="32" cy="3" r="1" fill="#FFD700" />
    <path d="M29 12 C29 10 35 10 35 12 Z" fill="#FFD700" />
    <circle cx="32" cy="10" r="1.5" fill="#FFD700" />
    <path d="M32 12 C28 20 26 30 25 44 H39 C38 30 36 20 32 12Z" fill="currentColor" />
    <path d="M28 20 H36" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <path d="M27 28 H37" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <path d="M26 36 H38" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <path d="M32 12 V44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M30 16 C30 25 28 35 27 44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M34 16 C34 25 36 35 37 44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M21 44 H43 V48 H21 Z" fill="currentColor" opacity="0.9" />
    <path d="M17 48 H47 V52 H17 Z" fill="currentColor" opacity="0.9" />
    <path d="M13 52 H51 V57 H13 Z" fill="currentColor" opacity="0.9" />
  </svg>
);

interface HeroProps {
  setActivePage: (page: string) => void;
}

interface HeroConfigData {
  heading: string;
  heading_devanagari?: string;
  subtitle?: string;
  description?: string;
  bg_image_url?: string;
  bg_video_url?: string;
  overlay_opacity: number;
  buttons?: Array<{ label: string; action: string; variant: string }>;
}

export default function Hero({ setActivePage }: HeroProps) {
  const [config, setConfig] = useState<HeroConfigData | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await publicApi.getHero();
        if (res.data && typeof res.data === 'object' && !Array.isArray(res.data) && res.data.heading) {
          setConfig(res.data);
        }
      } catch (err) {
        console.error('Failed to load hero configuration:', err);
      }
    };
    fetchHero();
  }, []);

  const defaultHero: HeroConfigData = {
    heading: "जय माँ बम्लेश्वरी",
    heading_devanagari: "जय माँ बम्लेश्वरी",
    subtitle: "Welcome to Dongargarh Maa Bamleshwari Temple",
    description: "Explore one of Chhattisgarh's most revered Shakti Peeths, perched majestically on the 1,600-foot high hills of Dongargarh in Rajnandgaon, drawing millions of seeking souls.",
    bg_image_url: "/assets/hero-bg.png",
    overlay_opacity: 0.5,
    buttons: [
      { label: "Live Darshan", action: "darshan", variant: "white" },
      { label: "Temple History", action: "history", variant: "gold" },
      { label: "Plan Your Visit", action: "instructions", variant: "transparent" },
      { label: "Donate", action: "donate", variant: "maroon" }
    ]
  };

  const current = config || defaultHero;

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'white':
        return "bg-white text-deep-maroon hover:bg-amber-50 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300";
      case 'gold':
        return "bg-gradient-to-r from-[#D4AF37] via-[#E8D7A5] to-[#B8860B] text-[#3D1414] font-extrabold hover:brightness-110 shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-300 border border-[#FFF8DC]/40";
      case 'maroon':
        return "bg-[#6B1E1E] text-white hover:bg-[#8B2626] border border-[#D4AF37]/40 shadow-[0_8px_25px_rgba(107,30,30,0.4)] hover:scale-105 transition-all duration-300";
      case 'transparent':
      case 'outline':
      default:
        return "bg-black/50 backdrop-blur-md text-white border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#3D1414] shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 font-bold";
    }
  };

  const getButtonIcon = (action: string) => {
    switch (action) {
      case 'darshan':
        return 'Play';
      case 'history':
        return 'Calendar';
      case 'instructions':
        return 'ShieldAlert';
      case 'donate':
        return 'Heart';
      default:
        return 'ArrowRight';
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video with Dynamic Overlay */}
      {current.bg_video_url ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={current.bg_video_url}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-[center_top] z-0 scale-105 transition-transform duration-[10000ms]"
          style={{
            backgroundImage: `url('${getImageUrl(current.bg_image_url, '/assets/hero-bg.png')}')`,
          }}
        />
      )}
      
      {/* Dynamic Overlay Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#6B1E1E]/50 via-black/60 to-[#FFF9F2] z-10" 
        style={{ opacity: current.overlay_opacity || 0.5 }}
      />

      {/* Floating Elements (Spiritual Temple Spires) */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block animate-fade-in">
        <motion.div
          className="absolute top-24 left-[10%] w-16 h-16"
          animate={{ y: [0, -15, 0], rotate: [-8, 4, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <TempleIcon />
        </motion.div>

        <motion.div
          className="absolute top-28 right-[12%] w-14 h-14"
          animate={{ y: [0, 12, 0], rotate: [6, -6, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <TempleIcon />
        </motion.div>

        <motion.div
          className="absolute top-16 left-[38%] w-12 h-12"
          animate={{ y: [0, -10, 0], rotate: [-4, 6, -4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <TempleIcon />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-[8%] w-16 h-16"
          animate={{ y: [0, 15, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <TempleIcon />
        </motion.div>

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
        {current.heading_devanagari && (
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-devanagari font-bold text-5xl md:text-7xl lg:text-8xl text-white tracking-wide mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] gold-text-glow"
          >
            {current.heading_devanagari}
          </motion.h1>
        )}

        {/* English Title */}
        {current.subtitle && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-[#E8D7A5] tracking-wide mb-6 font-semibold"
          >
            {current.subtitle}
          </motion.h2>
        )}

        {/* Subtitle description */}
        {current.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/80 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-sans"
          >
            {current.description}
          </motion.p>
        )}

        {/* CTA Actions */}
        {current.buttons && Array.isArray(current.buttons) && current.buttons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
          >
            {current.buttons.map((btn, index) => (
              <button
                key={index}
                onClick={() => {
                  setActivePage(btn.action);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center justify-center space-x-2 font-bold px-6 py-3.5 rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none text-sm ${getButtonStyles(btn.variant)}`}
              >
                <DynamicIcon name={getButtonIcon(btn.action)} className="w-4 h-4" />
                <span>{btn.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Decorative Bottom Wave/Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF9F2] to-transparent z-20" />
    </div>
  );
}
