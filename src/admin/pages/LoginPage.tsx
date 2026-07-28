/**
 * Premium Admin Login Page
 * Temple branding • Glassmorphism • Gold accents • Burgundy highlights
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(form.email, form.password, form.rememberMe);
      toast.success('Welcome back! 🙏');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 35%, #1a0a14 65%, #0d0d1a 100%)' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(107,30,30,0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
        />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Main Card */}
        <div className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255, 249, 242, 0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.1)',
          }}>

          {/* Header */}
          <div className="relative px-8 pt-10 pb-8 text-center"
            style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%)' }}>
            {/* Temple emblem */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(107,30,30,0.15) 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 8px 32px rgba(212,175,55,0.1)',
              }}>
              <img
                src="/Shakti-peeth-logo-hd-rounded.png"
                alt="Temple Logo"
                className="w-16 h-16 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <Shield className="w-10 h-10 absolute opacity-20" style={{ color: '#D4AF37' }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-xs uppercase tracking-[4px] mb-2 font-semibold" style={{ color: '#D4AF37', opacity: 0.7 }}>
                Sacred Administration
              </p>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#FFF9F2', fontFamily: '"Playfair Display", serif' }}>
                Temple Admin Panel
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,249,242,0.4)', fontFamily: 'Inter, sans-serif' }}>
                Shri Mahakali Mataji Temple, Pavagadh
              </p>
            </motion.div>

            {/* Gold divider */}
            <div className="w-16 h-px mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl text-sm"
                    style={{ background: 'rgba(107,30,30,0.4)', border: '1px solid rgba(107,30,30,0.6)', color: '#FFB0B0' }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,249,242,0.5)' }}>
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                    style={{ color: form.email ? '#D4AF37' : 'rgba(255,249,242,0.3)' }} />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@temple.com"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,249,242,0.06)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      color: '#FFF9F2',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={(e) => { e.target.style.border = '1px solid rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(255,249,242,0.09)'; }}
                    onBlur={(e) => { e.target.style.border = '1px solid rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,249,242,0.06)'; }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,249,242,0.5)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: form.password ? '#D4AF37' : 'rgba(255,249,242,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,249,242,0.06)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      color: '#FFF9F2',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={(e) => { e.target.style.border = '1px solid rgba(212,175,55,0.6)'; e.target.style.background = 'rgba(255,249,242,0.09)'; }}
                    onBlur={(e) => { e.target.style.border = '1px solid rgba(212,175,55,0.2)'; e.target.style.background = 'rgba(255,249,242,0.06)'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,249,242,0.4)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,249,242,0.4)')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    className="relative w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer"
                    style={{
                      background: form.rememberMe ? 'rgba(212,175,55,0.2)' : 'rgba(255,249,242,0.06)',
                      border: form.rememberMe ? '1px solid rgba(212,175,55,0.7)' : '1px solid rgba(255,249,242,0.2)',
                    }}
                    onClick={() => setForm(f => ({ ...f, rememberMe: !f.rememberMe }))}
                  >
                    {form.rememberMe && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,249,242,0.5)' }}>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-xs transition-colors"
                  style={{ color: '#D4AF37', opacity: 0.7 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all relative overflow-hidden mt-2"
                style={{
                  background: isLoading
                    ? 'rgba(212,175,55,0.4)'
                    : 'linear-gradient(135deg, #D4AF37 0%, #B89020 100%)',
                  color: isLoading ? 'rgba(26,10,10,0.6)' : '#1A0A0A',
                  boxShadow: isLoading ? 'none' : '0 8px 32px rgba(212,175,55,0.25)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sign In to Admin Panel
                  </span>
                )}
              </motion.button>
            </form>

            {/* Security notice */}
            <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: 'rgba(255,249,242,0.25)', fontFamily: 'Inter, sans-serif' }}>
              🔒 Protected by JWT authentication • Rate limiting • Brute force protection
            </p>
          </div>
        </div>

        {/* Bottom credit */}
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,249,242,0.2)' }}>
          Shri Mahakali Mataji Temple CMS v1.0
        </p>
      </motion.div>
    </div>
  );
}
