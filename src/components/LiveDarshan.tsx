import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Tv, Sparkles, Video, Radio, Layers, CheckCircle2 } from 'lucide-react';
import { publicApi } from '../api/client';
import { getImageUrl } from '../utils/image';

interface CameraStream {
  id: number | string;
  title: string;
  videoUrl: string;
  url: string;
}

export default function LiveDarshan() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [info, setInfo] = useState<Record<string, string>>({});
  const [streams, setStreams] = useState<CameraStream[]>([
    { id: 1, title: 'Main Sanctum', videoUrl: 'https://www.youtube.com/watch?v=wulPPdw-FUk', url: '/assets/about-bg.png' },
    { id: 2, title: 'Temple Shikhar', videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A', url: '/assets/hero-bg.png' },
    { id: 3, title: 'Navratri Aarti', videoUrl: 'https://www.youtube.com/watch?v=1F3ROuQ3Nvg', url: '/assets/gallery-festival.png' }
  ]);
  const [activeStreamId, setActiveStreamId] = useState<number | string>(1);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await publicApi.getTempleInfo('darshan');
        if (res.data) {
          setInfo(res.data);

          if (res.data.live_alt_views) {
            try {
              const parsed = JSON.parse(res.data.live_alt_views);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setStreams(parsed);
                setActiveStreamId(parsed[0].id);
              }
            } catch (e) {
              console.error('Failed to parse alternative streams:', e);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load live darshan settings:', err);
      }
    };
    fetchInfo();
  }, []);

  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return 'https://www.youtube.com/embed/wulPPdw-FUk?autoplay=1&enablejsapi=1';
    let videoId = 'wulPPdw-FUk';

    if (rawUrl.includes('youtube.com/watch?v=')) {
      videoId = rawUrl.split('watch?v=')[1]?.split('&')[0] || videoId;
    } else if (rawUrl.includes('youtu.be/')) {
      videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0] || videoId;
    } else if (rawUrl.includes('youtube.com/embed/')) {
      videoId = rawUrl.split('embed/')[1]?.split('?')[0] || videoId;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
  };

  const activeStream = streams.find(s => s.id === activeStreamId) || streams[0] || {
    id: 1,
    title: 'Main Sanctum',
    videoUrl: 'https://www.youtube.com/watch?v=wulPPdw-FUk',
    url: '/assets/about-bg.png'
  };

  const alternativeStreams = streams.filter(s => s.id !== activeStreamId);

  const handleStreamSelect = (selectedId: number | string) => {
    setActiveStreamId(selectedId);
    setIsPlaying(true);
  };

  const portalSubtitle = info.live_portal_subtitle || 'Darshan Portal';
  const portalTitle = info.live_portal_title || 'Watch Live Darshan';
  const portalDesc = info.live_portal_description || 'Connect with the divine energy of Maa Bamleshwari Devi from anywhere in the world. Our daily live darshan stream allows devotees to participate in the morning and evening aartis.';
  const morningTime = info.aarti_morning_time || '5:30 AM – 6:00 AM';
  const eveningTime = info.aarti_evening_time || '7:00 PM – 7:30 PM';

  return (
    <section id="darshan-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border border-light-gold-border/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left Column: Main Live Broadcast Player (7 Cols, full height fill) */}
          <div className="lg:col-span-7 relative bg-black flex flex-col justify-center items-center group overflow-hidden min-h-[380px] lg:min-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStream.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full h-full absolute inset-0"
              >
                {!isPlaying ? (
                  <>
                    {/* Background Thumbnail */}
                    <div
                      className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-[8000ms] group-hover:scale-105"
                      style={{ backgroundImage: `url('${getImageUrl(activeStream.url, '/assets/hero-bg.png')}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="pointer-events-auto w-22 h-22 rounded-full bg-primary-gold text-white flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none group/play"
                        aria-label="Play Live Darshan"
                      >
                        <Play className="w-9 h-9 fill-white translate-x-1 group-hover/play:scale-110 transition-transform" />
                      </button>
                      <span className="text-white/90 text-xs font-medium tracking-wider mt-3 drop-shadow-md">
                        Click to start Live Stream
                      </span>
                    </div>

                    {/* Live Broadcast Badge */}
                    <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
                      <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-red-500" />
                        LIVE BROADCAST • {activeStream.title}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full relative">
                    <iframe
                      className="w-full h-full absolute inset-0 z-20 border-0"
                      src={getEmbedUrl(activeStream.videoUrl)}
                      title={`Maa Bamleshwari Temple Live - ${activeStream.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {/* Active Camera Overlay Badge */}
                    <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-bold tracking-wide shadow-lg">
                      <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      <span>{activeStream.title}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Portal Info & Animated Alternative Camera Views (5 Cols) */}
          <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-[#FFF9F2] border-t lg:border-t-0 lg:border-l border-light-gold-border/20">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-primary-gold">
                  <Tv className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest font-bold">{portalSubtitle}</span>
                </div>
                <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-deep-maroon">
                  {portalTitle}
                </h3>
              </div>

              <p className="text-sm text-text-dark/90 leading-relaxed">
                {portalDesc}
              </p>

              {/* Aarti Broadcasting Hours */}
              <div className="p-4 rounded-[22px] bg-deep-maroon/5 border border-deep-maroon/10 space-y-2.5 shadow-xs">
                <h5 className="font-serif font-bold text-deep-maroon text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-gold" />
                  <span>Aarti Broadcasting Hours</span>
                </h5>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Morning Aarti:</span>
                  <span className="text-deep-maroon font-bold">{morningTime}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Evening Aarti:</span>
                  <span className="text-deep-maroon font-bold">{eveningTime}</span>
                </div>
              </div>
            </div>

            {/* Alternative Views Selector Grid with Animated Swap */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-temple-brown flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary-gold" />
                  <span>Alternative Views</span>
                </h5>
                <span className="text-[10px] text-text-muted font-medium">Click to switch camera angle</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {alternativeStreams.map((stream) => (
                    <motion.button
                      key={stream.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      onClick={() => handleStreamSelect(stream.id)}
                      className="relative aspect-video rounded-xl overflow-hidden border border-light-gold-border/40 shadow-sm focus:outline-none group transition-all"
                    >
                      <img
                        src={getImageUrl(stream.url, '/assets/hero-bg.png')}
                        alt={stream.title}
                        className="w-full h-full object-cover object-[center_top] group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5 transition-opacity group-hover:opacity-90">
                        <div className="flex items-center space-x-1.5">
                          <Video className="w-3 h-3 text-primary-gold shrink-0" />
                          <span className="text-[10px] font-bold text-white truncate w-full">
                            {stream.title}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
