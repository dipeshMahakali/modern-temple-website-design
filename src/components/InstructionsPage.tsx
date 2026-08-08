import React, { useEffect, useState } from 'react';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';

interface RuleData {
  id: number;
  icon: string;
  title: string;
  desc: string;
  display_order: number;
}

interface DetailData {
  id: number;
  group_slug: string;
  title: string;
  description: string;
  items: string[];
  display_order: number;
}

export default function InstructionsPage() {
  const [rules, setRules] = useState<RuleData[]>([]);
  const [details, setDetails] = useState<DetailData[]>([]);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const res = await publicApi.getInstructions();
        if (res.data) {
          if (res.data.rules) setRules(res.data.rules);
          if (res.data.details) setDetails(res.data.details);
        }
      } catch (err) {
        console.error('Failed to load instructions:', err);
      }
    };
    fetchInstructions();
  }, []);

  const defaultRules = [
    {
      icon: "Compass",
      title: "Dress Code Guidelines",
      desc: "All devotees are requested to wear modest and respectful attire. Revealing or informal clothing is strictly prohibited inside the main temple prayer halls."
    },
    {
      icon: "Camera",
      title: "Photography Restrictions",
      desc: "Photography and videography using mobile devices, professional cameras, or drones are strictly banned inside the inner sanctum (*Garbhagriha*) to preserve sanctity."
    },
    {
      icon: "EyeOff",
      title: "Prohibited Items",
      desc: "Do not carry flammable items, matchboxes, weapons, or alcoholic products. Plastic bottles must be disposed of only in designated recycling bins."
    }
  ];

  const defaultDetails = [
    {
      group_slug: "ropeway",
      title: "Ropeway (Udan Khatola) Service",
      description: "Managed by private coordinators under the trust's oversight, the ropeway transports pilgrims from the base station directly up to the Badi Bamleshwari temple peak in under 6 minutes.",
      items: [
        "Operational Timings: 7:00 AM to 7:00 PM on weekdays, and 24 hours during Navratri. Timings may vary depending on weather conditions.",
        "Priority Boarding: Reserved queue priority available for senior citizens, physically challenged pilgrims, and pregnant women.",
        "Ticket Counter: Located at the hill base station. Online pre-booking is recommended during peak festival days."
      ]
    },
    {
      group_slug: "pathway",
      title: "Walking Pathway (Stairs)",
      description: "For devotees wishing to ascend the hill on foot, a recently upgraded pathway is available from the base containing 1,000 steps.",
      items: [
        "Pathway Amenities: Covered steel roofs provide protection from sun/rain. Cold drinking water dispensers are situated at every 200 steps.",
        "Resting Houses: Five clean rest shelter domes with public toilets and benches are distributed along the stairs.",
        "Emergency Support: Trust emergency staff and medical support cabinets are located at the midway checkpost."
      ]
    }
  ];

  const currentRules = rules.length > 0 ? rules : defaultRules;
  const currentDetails = details.length > 0 ? details : defaultDetails;

  return (
    <div className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Pilgrim Information</span>
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-deep-maroon">Important Instructions</h1>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          Please review the official guidelines and regulations issued by the Shree Mahakali Mataji Temple management before commencing your journey.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentRules.map((rule, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[28px] border border-light-gold-border/20 shadow-md flex flex-col justify-between h-64 hover:shadow-xl transition-shadow duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <DynamicIcon name={rule.icon} className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-serif font-bold text-deep-maroon text-lg">{rule.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed font-sans">{rule.desc}</p>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-primary-gold mt-4">Official Guideline</div>
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {currentDetails.map((detail, idx) => {
          const isRopeway = detail.group_slug === 'ropeway';
          const headerIcon = isRopeway ? "Sparkles" : "MapPin";
          return (
            <div key={idx} className="glass-card rounded-[28px] p-8 border border-light-gold-border/25 space-y-6 shadow-lg">
              <div className="flex items-center space-x-3 text-deep-maroon">
                <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center">
                  <DynamicIcon name={headerIcon} className="w-5 h-5 text-primary-gold" />
                </div>
                <h3 className="font-serif font-bold text-xl md:text-2xl">{detail.title}</h3>
              </div>
              
              <p className="text-xs text-text-dark/90 leading-relaxed font-sans">
                {detail.description}
              </p>

              <ul className="space-y-3.5 text-xs text-text-dark/95 leading-relaxed font-sans">
                {detail.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
