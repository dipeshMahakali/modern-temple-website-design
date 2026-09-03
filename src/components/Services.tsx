import React, { useEffect, useState } from 'react';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';

interface ServicesProps {
  setActivePage: (page: string) => void;
}

interface ServiceItemData {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
  action_page: string;
}

export default function Services({ setActivePage }: ServicesProps) {
  const [services, setServices] = useState<ServiceItemData[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await publicApi.getServices();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      }
    };
    fetchServices();
  }, []);

  const defaultServices = [
    { title: "Online Donation", desc: "Contribute to temple development, free meals (annakshetra), and educational trust funds.", icon: "Gift", color: "from-amber-500 to-orange-600", action_page: "donate" },
    { title: "Flag Booking (Dhwaj)", desc: "Reserve dates to host the sacred red flag (dhwaja) atop the high-altitude temple spire of Maa Bamleshwari.", icon: "Flag", color: "from-red-600 to-rose-800", action_page: "donate" },
    { title: "Darshan Booking", desc: "Book fast-track pass queues and senior citizen queue assistant slots online.", icon: "Ticket", color: "from-amber-600 to-yellow-800", action_page: "darshan" },
    { title: "Special Pooja", desc: "Register for custom Pujas, Jyoti Kalash booking during Navratri, and special rituals.", icon: "Flame", color: "from-orange-50 to-rose-50", action_page: "donate" },
    { title: "Accommodation", desc: "Reserve a clean room, dormitory bed, or family suite at the official Bamleshwari Trust Dharamshala.", icon: "Home", color: "from-emerald-500 to-teal-700", action_page: "contact" }
  ];

  const currentServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services-section" className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF9F2] relative z-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Trust E-Services</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Devotee Online Services</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
          <p className="text-text-muted text-sm leading-relaxed">
            Convenient and secure portals managed by the Shree Mahakali Mataji Temple to facilitate your pilgrimage and contributions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {currentServices.map((service, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePage(service.action_page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left bg-white p-6 rounded-[24px] border border-light-gold-border/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none flex flex-col justify-between group h-64"
            >
              <div>
                {/* Icon Container with color gradient */}
                <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${service.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <DynamicIcon name={service.icon} className="w-6 h-6" />
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
