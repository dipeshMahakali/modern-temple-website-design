import React from 'react';
import { Sun, Flame, Sparkles, BookOpen, Coffee, Moon, Briefcase, HelpCircle } from 'lucide-react';

export default function Timings() {
  const events = [
    {
      time: "4:00 AM",
      title: "Temple Opening & Mangala Aarti",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200"
    },
    {
      time: "5:30 AM",
      title: "Morning Shringar & Aarti",
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      bg: "from-yellow-50 to-amber-50",
      border: "border-yellow-200"
    },
    {
      time: "1:00 PM - 2:00 PM",
      title: "Mid-day Temple Closing",
      icon: <Coffee className="w-5 h-5 text-red-500" />,
      bg: "from-red-50 to-orange-50",
      border: "border-red-200"
    },
    {
      time: "7:00 PM",
      title: "Evening Aarti (Sandhya Aarti)",
      icon: <Flame className="w-5 h-5 text-orange-500 animate-pulse" />,
      bg: "from-orange-50 to-rose-50",
      border: "border-orange-200"
    },
    {
      time: "7:00 AM - 7:00 PM",
      title: "Passenger Ropeway Hours",
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200"
    },
    {
      time: "10:00 PM",
      title: "Temple Closing (Shayan)",
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      bg: "from-indigo-50 to-purple-50",
      border: "border-indigo-200"
    },
    {
      time: "8:00 AM - Onwards",
      title: "Trust Office Hours",
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-200"
    },
    {
      time: "Open 24 Hours",
      title: "Navratri Special Darshan",
      icon: <HelpCircle className="w-5 h-5 text-rose-500" />,
      bg: "from-rose-50 to-pink-50",
      border: "border-rose-200"
    }
  ];

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
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[24px] border ${event.border} bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-48`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-temple-brown bg-light-gold-border/25 px-3 py-1 rounded-full">
                  {event.time}
                </span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100">
                  {event.icon}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-serif font-bold text-deep-maroon text-base md:text-lg leading-snug">
                  {event.title}
                </h4>
                <p className="text-xs text-text-muted mt-1 font-medium">Shri Bamleshwari Trust Schedule</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
