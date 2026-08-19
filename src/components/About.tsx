import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';
import { getImageUrl } from '../utils/image';
import CardImage from './CardImage';

interface AboutProps {
  setActivePage: (page: string) => void;
}

export default function About({ setActivePage }: AboutProps) {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await publicApi.getTempleInfo('about');
        if (res.data) {
          setInfo(res.data);
        }
      } catch (err) {
        console.error('Failed to load about info:', err);
      }
    };
    fetchInfo();
  }, []);

  const defaultInfo = {
    about_title_small: "Divine Grace Since Time Immemorial",
    about_title_large: "Maa Bamleshwari Temple",
    about_desc_1: "Perched atop the majestic Dongargarh Hill, the temple of Badi Bamleshwari Devi is one of Chhattisgarh's most celebrated and ancient Shakti Peeths. The hill itself rises 1,600 feet, acting as a spiritual landmark visible from miles across the Rajnandgaon district.",
    about_desc_2: "For generations, the temple has drawn millions of devotees from Chhattisgarh and all over India. Believed to have been established over 2,200 years ago by Raja Veersen, the shrine features Badi Bamleshwari at the summit and Chhoti Bamleshwari at the base, creating a beautiful and sacred pilgrimage experience.",
    about_trust_title: "Shri Bamleshwari Mandir Trust Samiti",
    about_trust_desc: "Preserving spiritual heritage & offering welfare services for devotees.",
    about_bg_image: "/assets/about-bg.png"
  };

  const current = { ...defaultInfo, ...info };

  const quickFacts = [
    {
      icon: "MapPin",
      title: "Sacred Location",
      desc: "Dongargarh Hill, Rajnandgaon, Chhattisgarh. Height of 1,600 feet (488 m)."
    },
    {
      icon: "Compass",
      title: "Shakti Peeth",
      desc: "Veneration of Maa Bamleshwari Devi, a powerful manifestation of Durga."
    },
    {
      icon: "ShieldCheck",
      title: "Passenger Ropeway",
      desc: "Chhattisgarh's only passenger ropeway, carrying pilgrims to the summit."
    }
  ];

  return (
    <section id="about-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Image & Accents */}
        <div className="lg:col-span-6 relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-primary-gold rounded-tl-[28px] pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-primary-gold rounded-br-[28px] pointer-events-none" />
          <div className="overflow-hidden rounded-[28px] shadow-2xl h-[500px]">
            <CardImage
              src={getImageUrl(current.about_bg_image, '/assets/about-bg.png')}
              alt="Shri Bamleshwari Mandir Sanctuary"
              className="w-full h-full"
              imgClassName="transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 glass-card p-5 rounded-[20px] shadow-lg flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white shrink-0">
              <DynamicIcon name="Landmark" className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-deep-maroon text-sm">{current.about_trust_title}</h4>
              <p className="text-xs text-text-muted">{current.about_trust_desc}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">
              {current.about_title_small}
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon leading-tight">
              {current.about_title_large}
            </h2>
          </div>

          <p className="text-text-dark/95 leading-relaxed text-sm md:text-base">
            {current.about_desc_1}
          </p>

          <p className="text-text-muted leading-relaxed text-sm">
            {current.about_desc_2}
          </p>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {quickFacts.map((fact, idx) => (
              <div key={idx} className="bg-white/50 border border-light-gold-border/20 p-4 rounded-[20px] shadow-sm flex flex-col space-y-2">
                <div className="w-9 h-9 rounded-full bg-primary-gold/10 flex items-center justify-center shrink-0">
                  <DynamicIcon name={fact.icon} className="w-5 h-5 text-primary-gold" />
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
