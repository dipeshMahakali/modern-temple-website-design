import React from 'react';
import { Compass, MapPin, Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

interface AboutProps {
  setActivePage: (page: string) => void;
}

export default function About({ setActivePage }: AboutProps) {
  const quickFacts = [
    {
      icon: <MapPin className="w-5 h-5 text-primary-gold" />,
      title: "Sacred Location",
      desc: "Pavagadh Hill, Panchmahal, Gujarat. Height of 762 meters (2,500 ft)."
    },
    {
      icon: <Compass className="w-5 h-5 text-primary-gold" />,
      title: "Shakti Peeth",
      desc: "Veneration of the divine feminine where the toe of Sati fell."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary-gold" />,
      title: "UNESCO Heritage Site",
      desc: "Inscribed in 2004 under Champaner-Pavagadh Archaeological Park."
    }
  ];

  return (
    <section id="about-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Image & Accents */}
        <div className="lg:col-span-6 relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-primary-gold rounded-tl-[28px] pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-primary-gold rounded-br-[28px] pointer-events-none" />
          <div className="overflow-hidden rounded-[28px] shadow-2xl">
            <img
              src="/assets/about-bg.png"
              alt="Shree Kalika Mataji Temple Sanctuary"
              className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 glass-card p-5 rounded-[20px] shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-deep-maroon text-sm">Shree Kalika Mataji Mandir Trust</h4>
              <p className="text-xs text-text-muted">Preserving historical values & offering pilgrim welfare services.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">
              Divine Grace Since Time Immemorial
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon leading-tight">
              Shree Kalika Mataji Temple
            </h2>
          </div>

          <p className="text-text-dark/95 leading-relaxed text-sm md:text-base">
            Perched atop the majestic Pavagadh Hill, the temple of Shree Kalika Mataji (Mahakali) is one of India's most celebrated and ancient Shakti Peethas. The hill itself represents a volcanic formation rising precipitously from the surrounding plains, acting as a spiritual beacon visible from miles away.
          </p>

          <p className="text-text-muted leading-relaxed text-sm">
            For generations, the temple has drawn millions of devotees from Gujarat and across India. Sage Vishwamitra is believed to have installed the deity here. In June 2022, a major redevelopment plan saw Prime Minister Narendra Modi hoist the sacred flag atop the newly built Shikhar—a ceremony that was missing for almost 500 years.
          </p>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {quickFacts.map((fact, idx) => (
              <div key={idx} className="bg-white/50 border border-light-gold-border/20 p-4 rounded-[20px] shadow-sm flex flex-col space-y-2">
                <div className="w-9 h-9 rounded-full bg-primary-gold/10 flex items-center justify-center shrink-0">
                  {fact.icon}
                </div>
                <h5 className="font-serif font-semibold text-deep-maroon text-xs">{fact.title}</h5>
                <p className="text-[11px] text-text-muted leading-tight">{fact.desc}</p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 bg-deep-maroon text-white font-bold px-8 py-3.5 rounded-full hover:bg-deep-maroon/90 shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <span>Learn More About Temple</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
