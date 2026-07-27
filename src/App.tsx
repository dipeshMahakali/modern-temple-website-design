import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Compass, BookOpen, Clock, Heart, Award } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState<string>('home');

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-0">
            <Hero setActivePage={setActivePage} />
            <Stats />
            <About setActivePage={setActivePage} />
            <Timings />
            <LiveDarshan />
            <Services setActivePage={setActivePage} />
            <Timeline />
            <Trustees />
            <Testimonials />
            <Contact />
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
              <div className="lg:col-span-6">
                <img src="/assets/about-bg.png" alt="Inner Shrine Sanctum" className="rounded-[28px] shadow-xl w-full h-[400px] object-cover" />
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
            <Gallery />
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
      {/* Sticky Header Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Pages Content Area */}
      <main className="flex-grow pt-[76px]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default App;
