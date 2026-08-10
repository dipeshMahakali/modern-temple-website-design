import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { publicApi } from '../api/client';
import { getImageUrl } from '../utils/image';
import CardImage from './CardImage';

interface EventData {
  id?: number;
  title: string;
  event_date: string;
  end_date?: string;
  description: string;
  banner_url?: string;
  location?: string;
  category: string;
  is_featured: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicApi.getEvents(50);
        if (res.data && res.data.length > 0) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const defaultEvents = [
    {
      title: "Sharadiya Navratri Mahotsav",
      event_date: "2026-10-12",
      end_date: "2026-10-20",
      description: "The largest annual festival at Dongargarh. The temple is kept open 24 hours for darshan. Millions of pilgrims visit, lighting thousands of Jyoti Kalash. Special trains, security, and medical camps are arranged by the Chhattisgarh Government and the Trust.",
      banner_url: "/assets/gallery-festival.png",
      category: "Mega Event",
      location: "Dongargarh Hill",
      is_featured: true
    },
    {
      title: "Chaitra Navratri Utsav",
      event_date: "2026-03-28",
      end_date: "2026-04-05",
      description: "Celebrate the sacred spring Navratri with Jyoti Kalash lighting, special Maha Aarti, and Shringar ceremonies performed daily on the hilltop shrine of Maa Bamleshwari.",
      banner_url: "/assets/about-bg.png",
      category: "Vasant Utsav",
      location: "Dongargarh Hill",
      is_featured: false
    },
    {
      title: "Mandir Patotsav (Foundation Day)",
      event_date: "2026-06-20",
      description: "Annual Patotsav festival commemorating the temple's sacred foundation. Features special flag-hoisting (Dhwaj Arohan) atop the Badi Bamleshwari temple spire and grand Mahaprasad distribution.",
      banner_url: "/assets/hero-bg.png",
      category: "Annual Ritual",
      location: "Dongargarh Hill",
      is_featured: false
    }
  ];

  const currentEvents = events.length > 0 ? events : defaultEvents;

  const formatDate = (dateStr: string, endDateStr?: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const start = new Date(dateStr).toLocaleDateString('en-US', options);
      if (endDateStr) {
        const end = new Date(endDateStr).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;
      }
      return start;
    } catch {
      return dateStr;
    }
  };

  const getEventImage = (item: EventData) => {
    return getImageUrl(item.banner_url, "/assets/hero-bg.png");
  };

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
          {currentEvents.map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] overflow-hidden border border-light-gold-border/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
            >
              {/* Event Image */}
              <div className="relative h-60 overflow-hidden">
                <CardImage src={getEventImage(event)} alt={event.title} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                <span className="absolute top-4 left-4 bg-primary-gold text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md z-20">
                  {event.category}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Date & Details */}
                  <div className="flex items-center space-x-2 text-primary-gold text-xs font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.event_date, event.end_date)}</span>
                  </div>
                  <h3 className="font-serif font-bold text-deep-maroon text-xl md:text-2xl leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-light-gold-border/20 flex items-center justify-between text-xs text-text-muted font-medium">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Full Day Darshan</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location || "Dongargarh Hill"}</span>
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
