import React, { useState } from 'react';
import { Landmark, Mail, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

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
                माँ बम्लेश्वरी देवी मंदिर
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#E8D7A5] font-semibold block">
                Bamleshwari Temple Trust
              </span>
            </div>
          </button>
          <p className="text-xs leading-relaxed max-w-sm">
            Preserving and managing the sacred heritage of Dongargarh Hill, the historic Maa Bamleshwari Devi shrine in Rajnandgaon District, Chhattisgarh, India.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary-gold hover:text-deep-maroon flex items-center justify-center text-white transition-colors" aria-label="Youtube">
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
