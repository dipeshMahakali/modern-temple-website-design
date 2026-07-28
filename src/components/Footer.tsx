import React, { useState, useEffect } from 'react';
import { Landmark, Mail, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { publicApi } from '../api/client';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const res = await publicApi.getTempleInfo();
        if (res.data) {
          setInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to load footer temple info:", err);
      }
    };
    loadInfo();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleFooterLink = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-deep-maroon text-white/80 py-16 px-6 md:px-12 border-t-4 border-primary-gold relative z-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Branding Column */}
        <div className="lg:col-span-4 space-y-5">
          <button
            onClick={() => handleFooterLink('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-full bg-white text-deep-maroon flex items-center justify-center shadow-lg">
              <Landmark className="w-5 h-5 text-deep-maroon" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white block leading-tight">
                {info['temple_name_devanagari'] || 'श्री महाकाली माताजी मंदिर'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#E8D7A5] font-semibold block">
                {info['temple_name'] || 'Shri Mahakali Mataji Temple'}
              </span>
            </div>
          </button>
          <p className="text-xs leading-relaxed max-w-sm">
            {info['address_line1'] ? `${info['address_line1']}, ${info['address_line2'] || ''}, ${info['address_city'] || ''}` : 'Preserving and managing the sacred heritage of Pavagadh Hill, the historic Shri Mahakali Mataji Temple shrine in Panchmahal, Gujarat, India.'}
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 pt-2">
            <a href={info['facebook_url'] || 'https://facebook.com'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href={info['instagram_url'] || 'https://instagram.com'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href={info['youtube_url'] || 'https://youtube.com'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Youtube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.528 3.5 12 3.5 12 3.5s-7.528 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.472 20.5 12 20.5 12 20.5s7.528 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-serif font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {[
              { name: 'Home', id: 'home' },
              { name: 'About Temple', id: 'about' },
              { name: 'History Timeline', id: 'history' },
              { name: 'Live Darshan', id: 'darshan' },
              { name: 'Upcoming Events', id: 'events' },
              { name: 'Photo Gallery', id: 'gallery' },
              { name: 'Trust Members', id: 'trust' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleFooterLink(link.id)}
                  className="hover:text-primary-gold transition-colors focus:outline-none"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Legals Column */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-serif font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            Important Information
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {[
              { name: 'Devotee Instructions', id: 'instructions' },
              { name: 'Online Services & Donations', id: 'donate' },
              { name: 'Privacy Policy', id: 'privacy' },
              { name: 'Terms & Conditions', id: 'terms' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleFooterLink(link.id)}
                  className="hover:text-primary-gold transition-colors focus:outline-none"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8D7A5] block">Temple Timings</span>
            <span className="text-xs text-white block">4:00 AM – 10:00 PM Daily</span>
            <span className="text-[10px] text-white/50 block">Aarti: 4:00 AM, 5:30 AM & 7:00 PM</span>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-serif font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-2">
            Devotional Newsletter
          </h4>
          <p className="text-xs leading-relaxed">
            Subscribe to receive updates on major festivals (Navratri), special darshan schedules, and trust announcements.
          </p>
          
          {subscribed ? (
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center space-y-1.5">
              <Award className="w-5 h-5 text-primary-gold mx-auto" />
              <p className="text-[11px] text-white font-semibold">Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-primary-gold transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 w-9 h-9 rounded-lg bg-primary-gold text-white flex items-center justify-center hover:bg-primary-gold/90 transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
        <p className="font-medium">
          © {new Date().getFullYear()} Shri Bamleshwari Mandir Trust Samiti, Dongargarh. All Rights Reserved.
        </p>
        <p className="text-white/40 text-[10px]">
          Redesigned Premium Heritage Portal & Devotee Services.
        </p>
      </div>
    </footer>
  );
}
