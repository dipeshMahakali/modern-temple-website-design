import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Landmark, Search, Globe, Radio, Heart, ChevronDown, Sparkles, ShieldAlert } from 'lucide-react';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';
import { getImageUrl } from '../utils/image';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../utils/translations';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

interface NavItem {
  id?: number;
  label: string;
  slug: string;
  icon?: string;
}

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'हिंदी (Hindi)' },
  { code: 'CG', name: 'छत्तीसगढ़ी (Chhattisgarhi)' },
];

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [logoIcon, setLogoIcon] = useState<string>('Landmark');
  const [logoImage, setLogoImage] = useState<string>('');

  // Right-side utilities state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const [navRes, infoRes] = await Promise.all([
          publicApi.getNavigation('main'),
          publicApi.getTempleInfo('general')
        ]);
        if (navRes.data && navRes.data.length > 0) {
          setNavItems(navRes.data);
        }
        if (infoRes.data) {
          if (infoRes.data.temple_logo_icon) setLogoIcon(infoRes.data.temple_logo_icon);
          if (infoRes.data.temple_logo_image) setLogoImage(infoRes.data.temple_logo_image);
        }
      } catch (err) {
        console.error('Failed to load navigation or logo settings:', err);
      }
    };
    fetchNav();
  }, []);

  const defaultLinks: NavItem[] = [
    { label: 'Home', slug: 'home' },
    { label: 'About', slug: 'about' },
    { label: 'History', slug: 'history' },
    { label: 'Darshan', slug: 'darshan' },
    { label: 'Events', slug: 'events' },
    { label: 'Gallery', slug: 'gallery' },
    { label: 'Trust', slug: 'trust' },
    { label: 'Donate', slug: 'donate' },
    { label: 'Contact', slug: 'contact' },
  ];

  const currentLinks = navItems.length > 0 ? navItems : defaultLinks;
  const normalLinks = currentLinks.filter(l => l.slug !== 'donate');
  const donateLink = currentLinks.find(l => l.slug === 'donate');

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
    setIsSearchOpen(false);
    if (id === 'darshan') {
      const el = document.getElementById('darshan-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('gallery') || q.includes('photo')) handleNavClick('gallery');
    else if (q.includes('event') || q.includes('festival')) handleNavClick('events');
    else if (q.includes('history') || q.includes('story') || q.includes('timeline')) handleNavClick('history');
    else if (q.includes('darshan') || q.includes('live')) handleNavClick('darshan');
    else if (q.includes('donate') || q.includes('donation')) handleNavClick('donate');
    else handleNavClick('about');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 md:px-6 py-2.5 transition-all duration-300">
      <nav
        className={`w-full max-w-[1440px] transition-all duration-300 rounded-full border border-light-gold-border/40 px-4 lg:px-6 flex items-center justify-between relative ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-2xl py-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)]' 
            : 'bg-white/90 backdrop-blur-xl py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
        }`}
        aria-label="Main Navigation"
      >
        {/* 1. BRANDING LOGO ZONE */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full gold-gradient flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 overflow-hidden shrink-0 ring-2 ring-primary-gold/30">
            {logoImage ? (
              <img src={getImageUrl(logoImage)} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <DynamicIcon name={logoIcon || 'Landmark'} className="w-5 h-5 md:w-5.5 md:h-5.5" />
            )}
          </div>
          <div className="hidden sm:block">
            <span className="font-serif font-extrabold text-base md:text-lg text-deep-maroon block leading-tight tracking-wide">
              {t('temple_title', 'जय माँ बम्लेश्वरी')}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-temple-brown font-semibold block">
              {t('temple_subtitle', 'Dongargarh Temple')}
            </span>
          </div>
        </button>

        {/* 2. CENTERED PRIMARY NAVIGATION */}
        <div className="hidden xl:flex items-center justify-center space-x-1 lg:space-x-3 xl:space-x-4">
          {normalLinks.map((link) => {
            const isActive = activePage === link.slug;
            const translatedLabel = t(link.slug, link.label);

            return (
              <button
                key={link.slug}
                onClick={() => handleNavClick(link.slug)}
                className={`relative text-xs lg:text-xs xl:text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none py-1 px-2 flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-deep-maroon font-bold'
                    : 'text-text-dark/80 hover:text-deep-maroon'
                }`}
              >
                {link.icon && <DynamicIcon name={link.icon} className="w-3.5 h-3.5" />}
                <span>{translatedLabel}</span>

                {/* Sleek Golden Active Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-1.5 right-1.5 h-[2.5px] bg-primary-gold rounded-full shadow-[0_2px_8px_rgba(212,175,55,0.6)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. RIGHT UTILITY ACTIONS & CTA */}
        <div className="hidden xl:flex items-center space-x-2 shrink-0">
          {/* Live Stream Shortcut */}
          <button
            onClick={() => handleNavClick('darshan')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer shadow-xs whitespace-nowrap"
            title={t('watch_live', 'Watch Live Darshan')}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-red-600" />
            <span>{t('darshan', 'Live')}</span>
          </button>

          {/* Expandable Search Input */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white border border-light-gold-border/50 rounded-full px-2.5 py-1 shadow-sm overflow-hidden"
                >
                  <Search className="w-3.5 h-3.5 text-temple-brown shrink-0 mr-1.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search_placeholder', 'Search...')}
                    className="w-full text-xs font-sans focus:outline-none text-text-dark bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-full hover:bg-deep-maroon/5 text-text-dark/80 hover:text-deep-maroon transition-colors cursor-pointer"
                  aria-label="Search"
                  title="Search website"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative z-[100]" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-light-gold-border/40 hover:border-primary-gold/60 text-xs font-semibold text-text-dark/90 hover:bg-deep-maroon/5 transition-all cursor-pointer whitespace-nowrap"
              aria-expanded={isLangOpen}
              aria-label="Language selector"
            >
              <Globe className="w-3.5 h-3.5 text-primary-gold" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border border-light-gold-border/40 shadow-2xl py-1.5 z-[100] overflow-hidden"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'bg-deep-maroon/10 text-deep-maroon font-bold'
                          : 'text-text-dark/80 hover:bg-amber-50'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Golden Donate CTA Button (Admin Controlled & Always Visible) */}
          {donateLink && (
            <button
              onClick={() => handleNavClick('donate')}
              className="px-4 py-1.5 rounded-full gold-gradient text-white font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer flex items-center space-x-1.5 shrink-0 whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20 text-white" />
              <span>{t('donate', donateLink.label || 'Donate')}</span>
            </button>
          )}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="xl:hidden flex items-center space-x-2.5">
          {donateLink && (
            <button
              onClick={() => handleNavClick('donate')}
              className="px-3.5 py-1.5 rounded-full gold-gradient text-white font-semibold text-xs shadow-md focus:outline-none cursor-pointer flex items-center space-x-1"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20" />
              <span>{t('donate', donateLink.label || 'Donate')}</span>
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon focus:outline-none cursor-pointer hover:bg-deep-maroon/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-0 top-[70px] bg-[#FFF9F2]/98 backdrop-blur-2xl z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto border-t border-light-gold-border/30"
          >
            <div className="space-y-6">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-temple-brown absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder', 'Search temple portal...')}
                  className="w-full bg-white border border-light-gold-border/40 rounded-full pl-11 pr-4 py-2.5 text-xs font-sans focus:outline-none shadow-xs text-text-dark"
                />
              </form>

              {/* Mobile Language Switcher Selector */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-light-gold-border/30 rounded-2xl">
                <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary-gold" /> Select Language:
                </span>
                <div className="flex gap-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                        language === lang.code
                          ? 'bg-deep-maroon text-white shadow-xs'
                          : 'text-text-dark/70 hover:bg-amber-50'
                      }`}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {normalLinks.map((link) => {
                  const isActive = activePage === link.slug;
                  const translatedLabel = t(link.slug, link.label);

                  return (
                    <button
                      key={link.slug}
                      onClick={() => handleNavClick(link.slug)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-deep-maroon text-white font-bold shadow-md'
                          : 'text-text-dark/90 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {link.icon && <DynamicIcon name={link.icon} className={`w-4 h-4 ${isActive ? 'text-primary-gold' : 'text-temple-brown'}`} />}
                        <span>{translatedLabel}</span>
                      </div>
                      {isActive && <Sparkles className="w-4 h-4 text-primary-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-light-gold-border/20 space-y-3">
              {donateLink && (
                <button
                  onClick={() => handleNavClick('donate')}
                  className="w-full py-3.5 rounded-2xl gold-gradient text-white font-bold text-center text-sm shadow-lg cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>{t('donate', donateLink.label || 'Donate to Temple')}</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('instructions')}
                className="w-full py-2.5 text-xs font-semibold text-text-muted hover:text-deep-maroon flex items-center justify-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4 text-primary-gold" />
                <span>{t('instructions', 'Important Visitor Instructions')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
