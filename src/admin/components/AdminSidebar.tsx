/**
 * Admin Sidebar Navigation
 * Collapsible • Gold accents • Active state • Smooth transitions
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Layers, Navigation, Clock, Image, Calendar,
  FolderOpen, Info, Clock3, Star, PhoneCall, Search, Users, ScrollText,
  Settings, LogOut, ChevronLeft, ChevronRight, Shield, Globe, Menu, X
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: number;
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <Globe size={18} />, label: 'View Website', id: 'website' },

  { icon: <FileText size={18} />, label: 'Pages', id: 'pages', dividerBefore: true },
  { icon: <Layers size={18} />, label: 'Sections', id: 'sections' },
  { icon: <Navigation size={18} />, label: 'Navigation', id: 'navigation' },

  { icon: <Clock size={18} />, label: 'Timeline', id: 'timeline', dividerBefore: true },
  { icon: <Image size={18} />, label: 'Gallery', id: 'gallery' },
  { icon: <Calendar size={18} />, label: 'Events', id: 'events' },
  { icon: <FolderOpen size={18} />, label: 'Media Library', id: 'media' },

  { icon: <Info size={18} />, label: 'Temple Info', id: 'temple-info', dividerBefore: true },
  { icon: <Clock3 size={18} />, label: 'Timings', id: 'timings' },
  { icon: <Star size={18} />, label: 'Services', id: 'services' },
  { icon: <PhoneCall size={18} />, label: 'Contact', id: 'contact' },

  { icon: <Search size={18} />, label: 'SEO', id: 'seo', dividerBefore: true },
  { icon: <Users size={18} />, label: 'Users', id: 'users' },
  { icon: <ScrollText size={18} />, label: 'Audit Logs', id: 'audit-logs' },
  { icon: <Settings size={18} />, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ activePage, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    window.location.href = '/admin/login';
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden z-30"
      style={{
        background: 'linear-gradient(180deg, #160808 0%, #1F0C0C 50%, #160810 100%)',
        borderRight: '1px solid rgba(212,175,55,0.12)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(107,30,30,0.2) 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <img src="/Shakti-peeth-logo-hd-rounded.png" alt="Temple" className="w-7 h-7 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <p className="text-xs font-bold" style={{ color: '#D4AF37', fontFamily: '"Playfair Display", serif', lineHeight: 1.2 }}>
                Temple CMS
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,249,242,0.3)', fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                Admin Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse button */}
        <button
          onClick={onToggleCollapse}
          className="ml-auto p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'rgba(255,249,242,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,249,242,0.4)')}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 custom-admin-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.dividerBefore && (
                <div className="mx-2 my-2" style={{ height: '1px', background: 'rgba(212,175,55,0.08)' }} />
              )}
              <motion.button
                onClick={() => {
                  if (item.id === 'website') {
                    window.open('/', '_blank');
                    return;
                  }
                  onNavigate(item.id);
                }}
                whileHover={{ x: 2 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative group"
                style={{
                  background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                  color: isActive ? '#D4AF37' : 'rgba(255,249,242,0.5)',
                  border: isActive ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,249,242,0.05)';
                    e.currentTarget.style.color = 'rgba(255,249,242,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,249,242,0.5)';
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: '#D4AF37' }}
                  />
                )}
                <span className="flex-shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                    style={{ background: 'rgba(26,10,10,0.95)', color: '#FFF9F2', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    {item.label}
                  </div>
                )}
              </motion.button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t p-3 space-y-2" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-2 py-2"
          >
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B89020)', color: '#1A0A0A' }}>
              {user.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#FFF9F2', fontFamily: 'Inter, sans-serif' }}>
                {user.full_name}
              </p>
              <p className="text-xs truncate capitalize" style={{ color: '#D4AF37', opacity: 0.7, fontFamily: 'Inter, sans-serif' }}>
                {user.role?.replace('_', ' ')}
              </p>
            </div>
          </motion.div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
          style={{ color: 'rgba(255,149,149,0.5)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(107,30,30,0.3)'; e.currentTarget.style.color = '#FF9595'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,149,149,0.5)'; }}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
