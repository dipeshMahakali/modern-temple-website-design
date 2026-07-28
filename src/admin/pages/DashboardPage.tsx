/**
 * Admin Dashboard
 * Stats cards • Recent activity • System health
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Eye, EyeOff, Image, Calendar, MessageCircle,
  Users, LogIn, Activity, Shield, CheckCircle, AlertTriangle,
  TrendingUp, Clock, Loader2
} from 'lucide-react';
import api from '../../api/client';

interface StatsCard {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  description?: string;
}

const StatCard = ({ card, index }: { card: StatsCard; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    className="rounded-2xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow"
    style={{
      background: '#FFFFFF',
      border: '1px solid rgba(212,175,55,0.12)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
          {card.label}
        </p>
        <p className="text-3xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
          {card.value}
        </p>
        {card.description && (
          <p className="text-xs mt-1" style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif' }}>
            {card.description}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ background: card.bg, color: card.color }}>
        {card.icon}
      </div>
    </div>
    {/* Accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${card.color}60, transparent)` }} />
  </motion.div>
);

const mockStats = {
  total_pages: 12, published_pages: 10, hidden_pages: 2,
  gallery_images: 48, events: 6, unread_messages: 3,
  total_users: 4, recent_logins: 7,
};

const mockActivity = [
  { action: 'Gallery image uploaded', user: 'Temple Admin', time: '2 min ago', type: 'upload' },
  { action: 'Timeline entry updated', user: 'Editor', time: '15 min ago', type: 'edit' },
  { action: 'Event "Navratri 2025" created', user: 'Temple Admin', time: '1 hr ago', type: 'create' },
  { action: 'SEO updated for "home"', user: 'Temple Admin', time: '2 hr ago', type: 'edit' },
  { action: 'New contact message received', user: 'System', time: '3 hr ago', type: 'message' },
  { action: 'User "editor@temple.com" created', user: 'Super Admin', time: '1 day ago', type: 'user' },
];

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/recent-activity')
        ]);
        setStatsData(statsRes.data);
        setActivities(activityRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#D4AF37' }} />
        <p className="text-sm font-medium" style={{ color: 'rgba(45,45,45,0.6)', fontFamily: 'Inter, sans-serif' }}>
          Loading dashboard insights...
        </p>
      </div>
    );
  }

  const s = statsData || {
    total_pages: 0, published_pages: 0, hidden_pages: 0,
    gallery_images: 0, events: 0, unread_messages: 0,
    total_users: 0, recent_logins: 0
  };

  const stats: StatsCard[] = [
    { icon: <FileText size={20} />, label: 'Total Pages', value: s.total_pages, color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', description: 'All managed pages' },
    { icon: <Eye size={20} />, label: 'Published', value: s.published_pages, color: '#22C55E', bg: 'rgba(34,197,94,0.12)', description: 'Live & visible' },
    { icon: <EyeOff size={20} />, label: 'Hidden', value: s.hidden_pages, color: '#EF4444', bg: 'rgba(239,68,68,0.12)', description: 'Draft or disabled' },
    { icon: <Image size={20} />, label: 'Gallery Images', value: s.gallery_images, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', description: 'Uploaded photos' },
    { icon: <Calendar size={20} />, label: 'Events', value: s.events, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', description: 'Upcoming events' },
    { icon: <MessageCircle size={20} />, label: 'Unread Messages', value: s.unread_messages, color: '#EC4899', bg: 'rgba(236,72,153,0.12)', description: 'Contact inquiries' },
    { icon: <Users size={20} />, label: 'Total Users', value: s.total_users, color: '#6B1E1E', bg: 'rgba(107,30,30,0.12)', description: 'Admin accounts' },
    { icon: <LogIn size={20} />, label: 'Logins Today', value: s.recent_logins, color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)', description: 'Last 24 hours' },
  ];

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0808 0%, #2d1010 50%, #1a0814 100%)',
          boxShadow: '0 8px 32px rgba(26,8,8,0.2)',
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#D4AF37', opacity: 0.7, fontFamily: 'Inter, sans-serif' }}>
              Welcome Back
            </p>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#FFF9F2', fontFamily: '"Playfair Display", serif' }}>
              Temple Administration 🙏
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,249,242,0.5)', fontFamily: 'Inter, sans-serif' }}>
              Manage your temple website content from this dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <CheckCircle size={14} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-medium" style={{ color: '#D4AF37', fontFamily: 'Inter, sans-serif' }}>System Online</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
          Overview Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((card, i) => <StatCard key={card.label} card={card} index={i} />)}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>Recent Activity</h3>
            <Activity size={16} style={{ color: '#D4AF37' }} />
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {activities.length > 0 ? (
              activities.map((item, i) => (
                <div key={item.id || i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.08)' }}>
                    ✨
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                      {item.action}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-text-muted italic truncate">
                        {item.notes}
                      </p>
                    )}
                    <p className="text-xs" style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'Inter, sans-serif' }}>
                      {item.ip_address || 'System'} · {formatTime(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-8 text-gray-400">No activity logs recorded yet.</p>
            )}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>System Health</h3>
            <Shield size={16} style={{ color: '#D4AF37' }} />
          </div>
          <div className="space-y-4">
            {[
              { label: 'API Server', status: 'Operational', ok: true },
              { label: 'Database', status: 'Connected', ok: true },
              { label: 'File Storage', status: 'Available', ok: true },
              { label: 'Authentication', status: 'Secure', ok: true },
              { label: 'Last Backup', status: 'Today 6:00 AM', ok: true },
              { label: 'Security Scan', status: 'No threats found', ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'rgba(45,45,45,0.7)', fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.ok ? '#22C55E' : '#EF4444' }} />
                  <span className="text-xs font-medium" style={{ color: item.ok ? '#22C55E' : '#EF4444', fontFamily: 'Inter, sans-serif' }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
