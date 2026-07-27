import React, { useState } from 'react';
import { Play, Tv, Sparkles, Volume2, ShieldAlert } from 'lucide-react';

export default function LiveDarshan() {
  const [isPlaying, setIsPlaying] = useState(false);

  const mockThumbnails = [
    { id: 1, title: "Main Sanctum", url: "/assets/about-bg.png" },
    { id: 2, title: "Temple Shikhar", url: "/assets/hero-bg.png" },
    { id: 3, title: "Navratri Aarti", url: "/assets/gallery-festival.png" }
  ];

  return (
    <section id="darshan-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="glass-card rounded-[28px] overflow-hidden shadow-2xl border border-light-gold-border/30">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Player (Lg size) */}
          <div className="lg:col-span-8 relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
            {!isPlaying ? (
              <>
                {/* Thumbnail Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] group-hover:scale-105"
                  style={{ backgroundImage: `url('/assets/hero-bg.png')` }}
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10" />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative z-20 w-20 h-20 rounded-full bg-primary-gold text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
                  aria-label="Play Live Darshan"
                >
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </button>

                <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-red-600 px-3 py-1 rounded-full">
                    LIVE BROADCAST
                  </span>
                </div>
              </>
            ) : (
              <iframe
                className="w-full h-full absolute inset-0 z-20 border-0"
                src="https://www.youtube.com/embed/wulPPdw-FUk?autoplay=1"
                title="Dongargarh Maa Bamleshwari Temple Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Right Column: Information & Details */}
          <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-[#FFF9F2] border-t lg:border-t-0 lg:border-l border-light-gold-border/20">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-primary-gold">
                  <Tv className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest font-bold">Darshan Portal</span>
                </div>
                <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-deep-maroon">
                  Watch Live Darshan
                </h3>
              </div>

              <p className="text-sm text-text-dark/90 leading-relaxed">
                Connect with the divine energy of Maa Bamleshwari Devi from anywhere in the world. Our daily live darshan stream allows devotees to participate in the morning and evening aartis.
              </p>

              {/* Timings summary */}
              <div className="p-4 rounded-[20px] bg-deep-maroon/5 border border-deep-maroon/10 space-y-2.5">
                <h5 className="font-serif font-bold text-deep-maroon text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-gold" />
                  <span>Aarti Broadcasting Hours</span>
                </h5>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Morning Aarti:</span>
                  <span className="text-deep-maroon font-bold">5:30 AM – 6:00 AM</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Evening Aarti:</span>
                  <span className="text-deep-maroon font-bold">7:00 PM – 7:30 PM</span>
                </div>
              </div>
            </div>

            {/* Thumbnail selector / Carousel */}
            <div className="mt-8 space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-temple-brown">
                Alternative Views
              </h5>
              <div className="flex space-x-3">
                {mockThumbnails.map((thumb) => (
                  <button
                    key={thumb.id}
                    onClick={() => setIsPlaying(false)}
                    className="relative w-1/3 aspect-video rounded-lg overflow-hidden border border-light-gold-border/40 shadow-sm focus:outline-none hover:opacity-90 group transition-all"
                  >
                    <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white text-center px-1 truncate w-full">
                        {thumb.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
