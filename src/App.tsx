import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicApi } from './api/client';
import { motion, AnimatePresence } from 'framer-motion';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Timings from './components/Timings';
import LiveDarshan from './components/LiveDarshan';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Events from './components/Events';
import Timeline from './components/Timeline';
import Trustees from './components/Trustees';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DonatePage from './components/DonatePage';
import InstructionsPage from './components/InstructionsPage';
import PrivacyTerms from './components/PrivacyTerms';
import CardImage from './components/CardImage';

// Admin Components
import LoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import PagesPage from './admin/pages/PagesPage';
import TimelinePage from './admin/pages/TimelinePage';
import GalleryPage from './admin/pages/GalleryPage';
import NavigationPage from './admin/pages/NavigationPage';
import SeoPage from './admin/pages/SeoPage';
import TempleInfoPage from './admin/pages/TempleInfoPage';
import ContactMessagesPage from './admin/pages/ContactMessagesPage';
import SectionsPage from './admin/pages/SectionsPage';
import EventsPage from './admin/pages/EventsPage';
import TimingsPage from './admin/pages/TimingsPage';
import ServicesPage from './admin/pages/ServicesPage';
import StatsPage from './admin/pages/StatsPage';
import TrusteesPage from './admin/pages/TrusteesPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import InstructionsAdminPage from './admin/pages/InstructionsPage';
import BankDetailsPage from './admin/pages/BankDetailsPage';
import HeroPage from './admin/pages/HeroPage';
import MediaPage from './admin/pages/MediaPage';
import UsersPage from './admin/pages/UsersPage';
import AuditLogsPage from './admin/pages/AuditLogsPage';

import { Landmark } from 'lucide-react';

const sectionComponents: Record<string, React.ComponentType<any>> = {
  'hero': Hero,
  'stats': Stats,
  'about': About,
  'timings': Timings,
  'live-darshan': LiveDarshan,
  'services': Services,
  'timeline': Timeline,
  'trustees': Trustees,
  'testimonials': Testimonials,
  'contact': Contact,
  'gallery': Gallery,
  'events': Events,
};

function PageUnavailable({ activePage }: { activePage: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-[#FFF9F2]">
      <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-white shadow-xl mb-6">
        <Landmark className="w-10 h-10" />
      </div>
      <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-deep-maroon mb-4">
        Page Temporarily Unavailable
      </h2>
      <p className="text-text-muted text-sm max-w-md mb-8 leading-relaxed font-sans">
        The "{activePage.charAt(0).toUpperCase() + activePage.slice(1)}" page is currently down for maintenance or has been deactivated by the temple administrator.
      </p>
      <button
        onClick={() => { window.location.reload(); }}
        className="px-8 py-3 rounded-full gold-gradient text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        Retry / Refresh
      </button>
    </div>
  );
}

// ─── Public Website ────────────────────────────────────────────────────────────
function PublicWebsite() {
  const [activePage, setActivePage] = useState<string>('home');
  const [sections, setSections] = useState<any[]>([]);
  const [pageAvailable, setPageAvailable] = useState<boolean>(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (activePage === 'home') {
        setPageAvailable(true);
        return;
      }
      try {
        const res = await publicApi.getPageStatus(activePage);
        setPageAvailable(res.data?.is_available !== false);
      } catch (err) {
        setPageAvailable(true); // default fallback
      }
    };
    checkStatus();
  }, [activePage]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await publicApi.getSectionsList();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setSections(res.data);
        }
      } catch (err) {
        console.error("Failed to load sections list:", err);
      }
    };
    loadSections();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const defaultSections = [
    { slug: 'hero', is_visible: true, display_order: 0 },
    { slug: 'stats', is_visible: true, display_order: 1 },
    { slug: 'about', is_visible: true, display_order: 2 },
    { slug: 'timings', is_visible: true, display_order: 3 },
    { slug: 'live-darshan', is_visible: true, display_order: 4 },
    { slug: 'services', is_visible: true, display_order: 5 },
    { slug: 'gallery', is_visible: true, display_order: 6 },
    { slug: 'timeline', is_visible: true, display_order: 7 },
    { slug: 'trustees', is_visible: true, display_order: 8 },
    { slug: 'testimonials', is_visible: true, display_order: 9 },
    { slug: 'contact', is_visible: true, display_order: 10 }
  ];

  const currentSections = sections.length > 0 ? sections : defaultSections;

  const renderContent = () => {
    if (!pageAvailable) {
      return <PageUnavailable activePage={activePage} />;
    }
    switch (activePage) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            {currentSections
              .sort((a, b) => a.display_order - b.display_order)
              .map((sec) => {
                const Component = sectionComponents[sec.slug];
                if (!Component) return null;
                return (
                  <div
                    key={sec.slug}
                    style={{
                      background: sec.background || undefined,
                      padding: sec.spacing || undefined,
                    }}
                    className={sec.animation || ""}
                  >
                    <Component setActivePage={setActivePage} isHomePage={sec.slug === 'gallery'} />
                  </div>
                );
              })}
          </motion.div>
        );
      case 'about':
        return (
          <motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">About Dongargarh Shrine</span>
              <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-deep-maroon">Divine Sanctum</h1>
              <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 h-[400px]">
                <CardImage src="/assets/about-bg.png" alt="Inner Shrine Sanctum" className="rounded-[28px] shadow-xl w-full h-full" />
              </div>
              <div className="lg:col-span-6 space-y-5">
                <h3 className="font-serif font-bold text-2xl text-deep-maroon">The Legend of King Veersen</h3>
                <p className="text-sm text-text-dark/90 leading-relaxed font-sans">
                  The origin of the temple is associated with Raja Veersen, a historic ruler of Kamavati (now Dongargarh), who was childless and performed deep penance to Lord Shiva and Goddess Parvati. Blessed with a son, Raja Veersen built the temple of Maa Bamleshwari Devi on the hilltop as a tribute of gratitude.
                </p>
                <p className="text-sm text-text-muted leading-relaxed font-sans">
                  Devotees climb the 1,000 steps up the 1,600-foot-high hill or travel via the passenger ropeway to reach the Badi Bamleshwari Temple at the summit. The Shri Bamleshwari Mandir Trust Samiti provides extensive facilities along the pathway, including drinking water stalls, rest points, and safety railings.
                </p>
              </div>
            </div>
            <Trustees />
          </motion.div>
        );
      case 'history':
        return (
          <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <div className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto text-center space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Historical Records</span>
              <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-deep-maroon">Chronological Journey</h1>
              <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
            </div>
            <Timeline />
          </motion.div>
        );
      case 'darshan':
        return (
          <motion.div key="darshan" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <LiveDarshan />
            <Timings />
          </motion.div>
        );
      case 'events':
        return (
          <motion.div key="events" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <Events />
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div key="gallery" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <Gallery setActivePage={setActivePage} isHomePage={false} />
          </motion.div>
        );
      case 'trust':
        return (
          <motion.div key="trust" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <Trustees />
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <Contact />
          </motion.div>
        );
      case 'donate':
        return (
          <motion.div key="donate" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <DonatePage />
          </motion.div>
        );
      case 'instructions':
        return (
          <motion.div key="instructions" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <InstructionsPage />
          </motion.div>
        );
      case 'privacy':
        return (
          <motion.div key="privacy" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <PrivacyTerms initialTab="privacy" />
          </motion.div>
        );
      case 'terms':
        return (
          <motion.div key="terms" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <PrivacyTerms initialTab="terms" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className={`flex-grow ${activePage === 'home' ? 'pt-0' : 'pt-[88px]'}`}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

// ─── Admin Section Router ──────────────────────────────────────────────────────
function AdminSection() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="dashboard" element={
        <AdminLayout activePage="dashboard">
          <DashboardPage />
        </AdminLayout>
      } />
      <Route path="pages" element={
        <AdminLayout activePage="pages">
          <PagesPage />
        </AdminLayout>
      } />
      <Route path="timeline" element={
        <AdminLayout activePage="timeline">
          <TimelinePage />
        </AdminLayout>
      } />
      <Route path="gallery" element={
        <AdminLayout activePage="gallery">
          <GalleryPage />
        </AdminLayout>
      } />
      <Route path="navigation" element={
        <AdminLayout activePage="navigation">
          <NavigationPage />
        </AdminLayout>
      } />
      <Route path="seo" element={
        <AdminLayout activePage="seo">
          <SeoPage />
        </AdminLayout>
      } />
      <Route path="temple-info" element={
        <AdminLayout activePage="temple-info">
          <TempleInfoPage />
        </AdminLayout>
      } />
      <Route path="contact" element={
        <AdminLayout activePage="contact">
          <ContactMessagesPage />
        </AdminLayout>
      } />
      <Route path="messages" element={
        <AdminLayout activePage="contact">
          <ContactMessagesPage />
        </AdminLayout>
      } />
      <Route path="settings" element={
        <AdminLayout activePage="settings">
          <SeoPage />
        </AdminLayout>
      } />
      <Route path="sections" element={
        <AdminLayout activePage="sections">
          <SectionsPage />
        </AdminLayout>
      } />
      <Route path="events" element={
        <AdminLayout activePage="events">
          <EventsPage />
        </AdminLayout>
      } />
      <Route path="timings" element={
        <AdminLayout activePage="timings">
          <TimingsPage />
        </AdminLayout>
      } />
      <Route path="services" element={
        <AdminLayout activePage="services">
          <ServicesPage />
        </AdminLayout>
      } />
      <Route path="stats" element={
        <AdminLayout activePage="stats">
          <StatsPage />
        </AdminLayout>
      } />
      <Route path="trustees" element={
        <AdminLayout activePage="trustees">
          <TrusteesPage />
        </AdminLayout>
      } />
      <Route path="testimonials" element={
        <AdminLayout activePage="testimonials">
          <TestimonialsPage />
        </AdminLayout>
      } />
      <Route path="instructions" element={
        <AdminLayout activePage="instructions">
          <InstructionsAdminPage />
        </AdminLayout>
      } />
      <Route path="bank-details" element={
        <AdminLayout activePage="bank-details">
          <BankDetailsPage />
        </AdminLayout>
      } />
      <Route path="hero" element={
        <AdminLayout activePage="hero">
          <HeroPage />
        </AdminLayout>
      } />
      <Route path="media" element={
        <AdminLayout activePage="media">
          <MediaPage />
        </AdminLayout>
      } />
      <Route path="users" element={
        <AdminLayout activePage="users">
          <UsersPage />
        </AdminLayout>
      } />
      <Route path="audit-logs" element={
        <AdminLayout activePage="audit-logs">
          <AuditLogsPage />
        </AdminLayout>
      } />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

// ─── Main App Entry Point ──────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminSection />} />
      <Route path="/*" element={<PublicWebsite />} />
    </Routes>
  );
}
