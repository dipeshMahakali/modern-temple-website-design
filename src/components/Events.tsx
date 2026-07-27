import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Events() {
  const events = [
    {
      title: "Ashwin Navratri Mahotsav",
      date: "Oct 12 - Oct 20, 2026",
      desc: "The largest annual festival at Pavagadh. The temple is kept open 24 hours for darshan. Special security, lighting, and transportation are arranged by the Gujarat Government and Trust.",
      image: "/assets/gallery-festival.png",
      tag: "Mega Event"
    },
    {
      title: "Chaitra Navratri Utsav",
      date: "Mar 28 - Apr 05, 2026",
      desc: "Celebrate the sacred spring Navratri with continuous Chandi Path, special Maha Aarti, and Havan ceremonies performed daily by expert shastriji pandits.",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop",
      tag: "Vasant Utsav"
    },
    {
      title: "Mandir Patotsav (Foundation Day)",
      date: "Jyeshtha Sud Pancham",
      desc: "An annual commemoration of the temple's reconstruction. Features special flag-hoisting (*Dhwaj Arohan*) atop the golden peak and distributing Mahaprasad to all pilgrims.",
      image: "/assets/hero-bg.png",
      tag: "Annual Ritual"
    }
  ];

  return (
    <section id="events-section" className="py-20 px-6 md:px-12 bg-white-card/20 relative z-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Auspicious Celebrations</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Upcoming Events & Festivals</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
          <p className="text-text-muted text-sm leading-relaxed">
            Participate in the grand festivals and devotional events hosted by the trust. Plan your pilgrimage around these sacred milestones.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] overflow-hidden border border-light-gold-border/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
            >
              {/* Event Image */}
              <div className="relative h-60 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-4 left-4 bg-primary-gold text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {event.tag}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Date & Details */}
                  <div className="flex items-center space-x-2 text-primary-gold text-xs font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-deep-maroon text-xl md:text-2xl leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {event.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-light-gold-border/20 flex items-center justify-between text-xs text-text-muted font-medium">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Full Day Darshan</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pavagadh Spire</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
