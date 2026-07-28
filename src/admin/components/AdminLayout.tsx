/**
 * Admin Layout Wrapper
 * Sidebar + Header + Content area
 * Protected: redirects to /admin/login if not authenticated
 */
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a0a0a' }}>
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: '#D4AF37' }} />
          <p className="text-sm" style={{ color: 'rgba(255,249,242,0.4)', fontFamily: 'Inter, sans-serif' }}>
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleNavigate = (page: string) => {
    navigate(`/admin/${page}`);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F8F4EE' }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(s => !s)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed left-0 top-0 z-50 lg:hidden"
            >
              <AdminSidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                isCollapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader activePage={activePage} onMobileMenuToggle={() => setMobileOpen(s => !s)} />
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
