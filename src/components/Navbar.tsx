import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, Compass } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Temple', id: 'about' },
    { name: 'Temple History', id: 'history' },
    { name: 'Darshan', id: 'darshan' },
    { name: 'Events', id: 'events' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Trust', id: 'trust' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3 shadow-md border-b border-light-gold-border/20'
          : 'bg-transparent py-5'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg md:text-xl text-deep-maroon block leading-tight tracking-wide">
              શ્રી મહાકાળી મંદિર
            </span>
            <span className="text-xs uppercase tracking-widest text-temple-brown font-medium block">
              Pavagadh Temple
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none relative py-1 ${
                activePage === link.id
                  ? 'text-deep-maroon font-bold'
                  : 'text-text-dark/80 hover:text-deep-maroon'
              }`}
            >
              {link.name}
              {activePage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-gold rounded-full" />
              )}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('donate')}
            className="px-6 py-2.5 rounded-full gold-gradient text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
          >
            Donate
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="xl:hidden flex items-center space-x-4">
          <button
            onClick={() => handleNavClick('donate')}
            className="px-4 py-1.5 rounded-full gold-gradient text-white font-semibold text-xs shadow-md focus:outline-none"
          >
            Donate
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-deep-maroon p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 top-[60px] bg-[#FFF9F2] z-40 px-6 py-8 flex flex-col space-y-6 overflow-y-auto animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left text-lg font-semibold border-b border-light-gold-border/20 pb-3 transition-colors ${
                activePage === link.id ? 'text-deep-maroon' : 'text-text-dark/80'
              }`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('instructions')}
            className="text-left text-lg font-semibold border-b border-light-gold-border/20 pb-3 text-text-dark/80"
          >
            Important Instructions
          </button>
        </div>
      )}
    </nav>
  );
}
