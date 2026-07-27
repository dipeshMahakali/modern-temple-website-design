import React from 'react';
import { Gift, Flag, Ticket, Flame, Home, Image, BookOpen, Calendar, Users, PhoneCall } from 'lucide-react';

interface ServicesProps {
  setActivePage: (page: string) => void;
}

export default function Services({ setActivePage }: ServicesProps) {
  const servicesList = [
    {
      title: "Online Donation",
      desc: "Contribute to temple development, free meals (annakshetra), and educational trust funds.",
      icon: <Gift className="w-6 h-6" />,
      color: "from-amber-500 to-orange-600",
      actionPage: "donate"
    },
    {
      title: "Flag Booking (Dhwaj)",
      desc: "Reserve dates to host the sacred red flag (dhwaja) atop the high-altitude temple spire.",
      icon: <Flag className="w-6 h-6" />,
      color: "from-red-600 to-rose-800",
      actionPage: "donate" // Flag booking goes to Donate page for details
    },
    {
      title: "Darshan Booking",
      desc: "Book fast-track pass queues and senior citizen queue assistant slots online.",
      icon: <Ticket className="w-6 h-6" />,
      color: "from-amber-600 to-yellow-800",
      actionPage: "darshan"
    },
    {
      title: "Special Pooja",
      desc: "Register for Chandi Path, Maha Aarti, and custom family rituals performed by trust pandits.",
      icon: <Flame className="w-6 h-6" />,
      color: "from-orange-500 to-red-700",
      actionPage: "donate"
    },
    {
      title: "Accommodation",
      desc: "Reserve a clean room, dormitory bed, or family suite at the official Machi Trust Bhavan.",
      icon: <Home className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-700",
      actionPage: "contact"
    },
    {
      title: "Temple Gallery",
      desc: "Browse a curated repository of high-resolution images of heritage festivals and architecture.",
      icon: <Image className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-700",
      actionPage: "gallery"
    },
    {
      title: "Temple History",
      desc: "Read detailed notes on ancient origins, Solanki dynasty, and the 2004 UNESCO listing.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-purple-500 to-pink-700",
      actionPage: "history"
    },
    {
      title: "Upcoming Events",
      desc: "View schedules for Chaitra Navratri, Ashwin Navratri, and Trust board meetings.",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-700",
      actionPage: "events"
    },
    {
      title: "Volunteer Work",
      desc: "Register as a trust volunteer to support pilgrims during mega-festival events.",
      icon: <Users className="w-6 h-6" />,
      color: "from-sky-500 to-blue-700",
      actionPage: "contact"
    },
    {
      title: "Contact Desk",
      desc: "Get in touch with administrative officers regarding general inquiries or complaints.",
      icon: <PhoneCall className="w-6 h-6" />,
      color: "from-zinc-700 to-neutral-900",
      actionPage: "contact"
    }
  ];

  return (
    <section id="services-section" className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF9F2] relative z-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Trust E-Services</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Devotee Online Services</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
          <p className="text-text-muted text-sm leading-relaxed">
            Convenient and secure portals managed by the Shree Kalika Mataji Mandir Trust to facilitate your pilgrimage and contributions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {servicesList.map((service, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePage(service.actionPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none flex flex-col justify-between group h-64"
            >
              <div>
                {/* Icon Container with color gradient */}
                <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${service.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h4 className="font-serif font-bold text-deep-maroon text-lg mt-5 mb-2 group-hover:text-primary-gold transition-colors">
                  {service.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed font-sans line-clamp-3">
                  {service.desc}
                </p>
              </div>
              <span className="text-xs font-bold text-primary-gold group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1 mt-4">
                <span>Access Service</span>
                <span>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
