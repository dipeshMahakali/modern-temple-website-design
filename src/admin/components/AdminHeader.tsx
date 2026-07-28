/**
 * Admin Header Bar
 * Breadcrumb • Notifications • User Menu • Search
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

interface AdminHeaderProps {
  activePage: string;
  onMobileMenuToggle: () => void;
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  pages: 'Page Management',
  sections: 'Section Management',
  navigation: 'Navigation Builder',
  timeline: 'Royal Chronicle Timeline',
  gallery: 'Photo Gallery',
  events: 'Temple Events',
  media: 'Media Library',
  'temple-info': 'Temple Information',
  timings: 'Temple Timings',
  services: 'Services',
  contact: 'Contact & Messages',
  seo: 'SEO Management',
  users: 'User Management',
  'audit-logs': 'Audit Logs',
  settings: 'System Settings',
};

export default function AdminHeader({ activePage, onMobileMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pageLabel = PAGE_LABELS[activePage] || 'Admin';

  return (
    <header className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(255,249,242,0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}>

      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: '#6B1E1E' }}
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: 'rgba(45,45,45,0.4)' }}>Admin</span>
          <ChevronRight size={12} style={{ color: 'rgba(45,45,45,0.3)' }} />
          <span className="font-semibold" style={{ color: '#2D2D2D' }}>{pageLabel}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search toggle */}
        <AnimatePresence>
          {showSearch ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Search size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <input
                autoFocus
                placeholder="Search..."
                onBlur={() => setShowSearch(false)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}
              />
            </motion.div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2.5 rounded-xl transition-colors"
              style={{ color: 'rgba(45,45,45,0.5)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Search size={17} />
            </button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl transition-colors"
          style={{ color: 'rgba(45,45,45,0.5)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#6B1E1E' }} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(s => !s)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A' }}>
              {user?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-tight" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                {user?.full_name || 'Admin'}
              </p>
              <p className="text-xs capitalize leading-tight" style={{ color: '#D4AF37', fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                style={{
                  background: '#FFF9F2',
                  border: '1px solid rgba(212,175,55,0.2)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                }}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="p-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>{user?.full_name}</p>
                  <p className="text-xs" style={{ color: '#777', fontFamily: 'Inter, sans-serif' }}>{user?.email}</p>
                </div>
                {[
                  { icon: <User size={14} />, label: 'My Profile', action: () => {} },
                  { icon: <Settings size={14} />, label: 'Settings', action: () => {} },
                  { icon: <LogOut size={14} />, label: 'Logout', action: logout, danger: true },
                ].map((item) => (
                  <button key={item.label} onClick={() => { item.action(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left"
                    style={{ color: item.danger ? '#6B1E1E' : '#2D2D2D', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
