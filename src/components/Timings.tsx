import React, { useEffect, useState } from 'react';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';

interface TimingData {
  id: number;
  day_type: string;
  season?: string;
  opening_time: string;
  closing_time: string;
  special_note?: string;
  display_order: number;
}

export default function Timings() {
  const [timings, setTimings] = useState<TimingData[]>([]);

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const res = await publicApi.getTimings();
        if (res.data) {
          setTimings(res.data);
        }
      } catch (err) {
        console.error('Failed to load temple timings:', err);
      }
    };
    fetchTimings();
  }, []);

  const defaultTimings = [
    { day_type: "4:00 AM", opening_time: "4:00 AM", closing_time: "4:30 AM", special_note: "Temple Opening & Mangala Aarti", icon: "Sun" },
    { day_type: "5:30 AM", opening_time: "5:30 AM", closing_time: "6:00 AM", special_note: "Morning Shringar & Aarti", icon: "Sparkles" },
    { day_type: "1:00 PM - 2:00 PM", opening_time: "1:00 PM", closing_time: "2:00 PM", special_note: "Mid-day Temple Closing", icon: "Coffee" },
    { day_type: "7:00 PM", opening_time: "7:00 PM", closing_time: "7:30 PM", special_note: "Evening Aarti (Sandhya Aarti)", icon: "Flame" },
    { day_type: "7:00 AM - 7:00 PM", opening_time: "7:00 AM", closing_time: "7:00 PM", special_note: "Passenger Ropeway Hours", icon: "BookOpen" },
    { day_type: "10:00 PM", opening_time: "10:00 PM", closing_time: "10:15 PM", special_note: "Temple Closing (Shayan)", icon: "Moon" },
    { day_type: "8:00 AM - Onwards", opening_time: "8:00 AM", closing_time: "6:00 PM", special_note: "Trust Office Hours", icon: "Briefcase" },
    { day_type: "Open 24 Hours", opening_time: "12:00 AM", closing_time: "11:59 PM", special_note: "Navratri Special Darshan", icon: "HelpCircle" }
  ];

  const colorMaps = [
    { bg: "from-amber-50 to-orange-50", border: "border-amber-200", defaultIcon: "Sun" },
    { bg: "from-yellow-50 to-amber-50", border: "border-yellow-200", defaultIcon: "Sparkles" },
    { bg: "from-red-50 to-orange-50", border: "border-red-200", defaultIcon: "Coffee" },
    { bg: "from-orange-50 to-rose-50", border: "border-orange-200", defaultIcon: "Flame" },
    { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", defaultIcon: "BookOpen" },
    { bg: "from-indigo-50 to-purple-50", border: "border-indigo-200", defaultIcon: "Moon" },
    { bg: "from-blue-50 to-cyan-50", border: "border-blue-200", defaultIcon: "Briefcase" },
    { bg: "from-rose-50 to-pink-50", border: "border-rose-200", defaultIcon: "HelpCircle" }
  ];

  const getIconName = (specialNote: string, idx: number) => {
    const note = specialNote.toLowerCase();
    if (note.includes('opening') || note.includes('mangala')) return 'Sun';
    if (note.includes('shringar') || note.includes('morning')) return 'Sparkles';
    if (note.includes('closing') || note.includes('mid-day')) return 'Coffee';
    if (note.includes('evening') || note.includes('aarti')) return 'Flame';
    if (note.includes('ropeway')) return 'BookOpen';
    if (note.includes('shayan')) return 'Moon';
    if (note.includes('office') || note.includes('hours')) return 'Briefcase';
    return colorMaps[idx % colorMaps.length].defaultIcon;
  };

  const displayList = timings.length > 0 ? timings : defaultTimings;

  return (
    <section className="py-20 px-6 md:px-12 bg-white-card/40 border-y border-light-gold-border/20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Daily Devotions & Rituals</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Daily Programme Schedule</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
          <p className="text-text-muted text-sm leading-relaxed">
            Follow the daily spiritual schedule of prayers, offerings, and rituals at the shrine. Timings are subject to extension during special festivals like Navratri.
          </p>
        </div>

        {/* Timings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((event, idx) => {
            const colors = colorMaps[idx % colorMaps.length];
            const iconName = (event as any).icon || getIconName(event.special_note || '', idx);
            return (
              <div
                key={idx}
                className={`p-6 rounded-[24px] border ${colors.border} bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-48`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-temple-brown bg-light-gold-border/25 px-3 py-1 rounded-full">
                    {event.day_type}
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100">
                    <DynamicIcon name={iconName} className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif font-bold text-deep-maroon text-base md:text-lg leading-snug">
                    {event.special_note || `${event.opening_time} - ${event.closing_time}`}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 font-medium">Shri Bamleshwari Trust Schedule</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
