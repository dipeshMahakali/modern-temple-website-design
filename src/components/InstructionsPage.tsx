import React from 'react';
import { ShieldAlert, Compass, Camera, Sparkles, MapPin, EyeOff } from 'lucide-react';

export default function InstructionsPage() {
  const rules = [
    {
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      title: "Dress Code Guidelines",
      desc: "All devotees are requested to wear modest and respectful attire. Revealing or informal clothing is strictly prohibited inside the main temple prayer halls."
    },
    {
      icon: <Camera className="w-6 h-6 text-red-600 animate-pulse" />,
      title: "Photography Restrictions",
      desc: "Photography and videography using mobile devices, professional cameras, or drones are strictly banned inside the inner sanctum (*Garbhagriha*) to preserve sanctity."
    },
    {
      icon: <EyeOff className="w-6 h-6 text-amber-600" />,
      title: "Prohibited Items",
      desc: "Do not carry flammable items, matchboxes, weapons, or alcoholic products. Plastic bottles must be disposed of only in designated recycling bins."
    }
  ];

  return (
    <div className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Pilgrim Information</span>
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-deep-maroon">Important Instructions</h1>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          Please review the official guidelines and regulations issued by the Shri Bamleshwari Mandir Trust Samiti before commencing your journey.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[28px] border border-light-gold-border/20 shadow-md flex flex-col justify-between h-64 hover:shadow-xl transition-shadow duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                {rule.icon}
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
        {/* Ropeway Section */}
        <div className="glass-card rounded-[28px] p-8 border border-light-gold-border/25 space-y-6 shadow-lg">
          <div className="flex items-center space-x-3 text-deep-maroon">
            <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-gold" />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl">Ropeway (Udan Khatola) Service</h3>
          </div>
          
          <p className="text-xs text-text-dark/90 leading-relaxed font-sans">
            Managed by private coordinators under the trust's oversight, the ropeway transports pilgrims from the base station directly up to the Badi Bamleshwari temple peak in under 6 minutes.
          </p>

          <ul className="space-y-3.5 text-xs text-text-dark/95 leading-relaxed font-sans">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Operational Timings:</strong> 7:00 AM to 7:00 PM on weekdays, and 24 hours during Navratri. Timings may vary depending on weather conditions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Priority Boarding:</strong> Reserved queue priority available for senior citizens, physically challenged pilgrims, and pregnant women.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Ticket Counter:</strong> Located at the hill base station. Online pre-booking is recommended during peak festival days.</span>
            </li>
          </ul>
        </div>

        {/* Pathway Steps Section */}
        <div className="glass-card rounded-[28px] p-8 border border-light-gold-border/25 space-y-6 shadow-lg">
          <div className="flex items-center space-x-3 text-deep-maroon">
            <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-gold" />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl">Walking Pathway (Stairs)</h3>
          </div>
          
          <p className="text-xs text-text-dark/90 leading-relaxed font-sans">
            For devotees wishing to ascend the hill on foot, a recently upgraded pathway is available from the base containing 1,000 steps.
          </p>

          <ul className="space-y-3.5 text-xs text-text-dark/95 leading-relaxed font-sans">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Pathway Amenities:</strong> Covered steel roofs provide protection from sun/rain. Cold drinking water dispensers are situated at every 200 steps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Resting Houses:</strong> Five clean rest shelter domes with public toilets and benches are distributed along the stairs.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold mt-1.5 shrink-0" />
              <span><strong>Emergency Support:</strong> Trust emergency staff and medical support cabinets are located at the midway checkpost.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
