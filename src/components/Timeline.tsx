import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { 
  Sparkles, Award, ShieldAlert, History, MapPin, 
  BookOpen, Landmark, Camera, Calendar, ArrowUpRight, 
  HelpCircle, Eye, ChevronDown, Check, Globe
} from 'lucide-react';

interface Milestone {
  id: number;
  year: string;
  dynasty: string;
  title: string;
  event: string;
  importance: string;
  culturalImpact: string;
  shortDesc: string;
  detailedDesc: string;
  fact: string;
  icon: React.ReactNode;
  color: string;
  imgUrl: string;
}

export default function Timeline() {
  const [activeEraIdx, setActiveEraIdx] = useState(0);
  const [expandedEra, setExpandedEra] = useState<number | null>(null);
  const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>("temple");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stats Counters
  const [historyYears, setHistoryYears] = useState(0);
  const [pilgrims, setPilgrims] = useState(0);
  const [elevation, setElevation] = useState(0);

  useEffect(() => {
    // Quick count-up effect
    const interval = setInterval(() => {
      setHistoryYears(prev => (prev < 1500 ? prev + 30 : 1500));
      setPilgrims(prev => (prev < 20 ? prev + 1 : 20));
      setElevation(prev => (prev < 762 ? prev + 15 : 762));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const milestones: Milestone[] = [
    {
      id: 0,
      year: "3000 BC",
      dynasty: "Pre-Historic Era",
      title: "Ancient Volcanic Origins",
      event: "Volcanic formation of Pavagadh Hill",
      importance: "The hill is a volcanic plate dating back millions of years, standing out sharply from the plains.",
      culturalImpact: "Becomes a natural fortress and a sacred hill, appearing in Hindu scriptures as part of the Himalaya ranges.",
      shortDesc: "Creation of the towering Pavagadh volcanic plate, setting the stage for ancient sages and legends.",
      detailedDesc: "Formed during a massive volcanic eruption millions of years ago, Pavagadh stands as a solitary sentinel over the plains of Panchmahal. According to legendary lore, the hill was placed here by the gods at the request of Sage Vishwamitra to fill a deep valley, creating a holy sanctuary for severe penance.",
      fact: "The rock formation of Pavagadh is rhyolite, indicating explosive volcanic history.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-orange-500 to-amber-600",
      imgUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 1,
      year: "Mythology",
      dynasty: "Vedic Period",
      title: "The Sacred Shakti Peeth",
      event: "Daksha Yajna Mythology",
      importance: "Venerated as one of the 51 Shakti Peeths where Sati's right toe fell.",
      culturalImpact: "Establishes Pavagadh as a supreme pilgrimage center for Shakti worshippers across India.",
      shortDesc: "Deep mythological association where the right toe of Goddess Sati sanctified the peak.",
      detailedDesc: "When Lord Shiva performed the Tandava carrying Sati's charred body, Lord Vishnu used his Sudarshana Chakra to divide the body into 51 parts to calm Shiva. The right toe fell on the summit of Pavagadh, transforming it into a holy Shakti Peeth where Goddess Mahakali resides in her most powerful form.",
      fact: "It is one of the three main Shakti Peeths of Gujarat, along with Ambaji and Bahucharaji.",
      icon: <Award className="w-5 h-5" />,
      color: "from-red-600 to-rose-700",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 2,
      year: "5th Century AD",
      dynasty: "Early Kshatrapa Era",
      title: "First Hilltop Shrine Established",
      event: "Establishment of the primary stone altar",
      importance: "First structured stone worship area recognized by local forest sages and rulers.",
      culturalImpact: "The mount became a key spot for tantric and spiritual worship in Western India.",
      shortDesc: "Archaeological records point to early worship altars and stone steps built on the summit.",
      detailedDesc: "Archaeological excavations indicate early worship activity dating back to the 5th century. Hermits and ascetics carved simple rock shelters near the summit, establishing the first permanent daily worship rituals for Goddess Kalika.",
      fact: "Ancient rock carvings near the temple caves depict early Hindu and Jain iconographies.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-yellow-600 to-amber-700",
      imgUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      year: "746 AD",
      dynasty: "Chavda Dynasty",
      title: "Founding of Champaner",
      event: "Vanraj Chavda founds the base settlement",
      importance: "Named in honor of Champa, the trusted general and minister of the Chavda kingdom.",
      culturalImpact: "Linked the sacred hill with trade routes and defensive royal installations.",
      shortDesc: "King Vanraj Chavda establishes a fortified settlement at the foot of Pavagadh Hill.",
      detailedDesc: "King Vanraj Chavda, the founder of the Chavda Dynasty in Gujarat, established Champaner at the base of Pavagadh. This royal patronage integrated the hilltop shrine with the administrative kingdom, leading to the construction of fortified pathways up the mountain.",
      fact: "The name 'Champaner' is inspired by the yellow igneous rocks of Pavagadh resembling the Champa flower.",
      icon: <History className="w-5 h-5" />,
      color: "from-blue-600 to-indigo-700",
      imgUrl: "/assets/hero-bg.png"
    },
    {
      id: 4,
      year: "10th-12th Century",
      dynasty: "Solanki Period",
      title: "Golden Age of Architecture",
      event: "Royal construction of fortification gates",
      importance: "Solanki kings built massive stone walls, ponds, and gateways along the pilgrim paths.",
      culturalImpact: "Pilgrimage numbers rose dramatically as pathways became safer and protected.",
      shortDesc: "A period of architectural flourish with intricate temples, gates, and water reservoirs.",
      detailedDesc: "Under the Solanki Empire, Pavagadh was heavily fortified. Elegant stone gates like Atak Gate and Budhiya Gate were built. The temple itself was expanded with decorative carvings, and large stone water tanks (talaos) were constructed to sustain pilgrims and military garrisons.",
      fact: "The Lakulisa Temple on the hill is a classic specimen of 10th-century Solanki stone craftsmanship.",
      icon: <Award className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-700",
      imgUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      year: "1484 AD",
      dynasty: "Gujarat Sultanate",
      title: "Conquest of Mahmud Begada",
      event: "Fall of Pavagadh Fort & shifts in city status",
      importance: "Sultan Mahmud Begada captured the fortress after a 20-month siege, damaging the temple dome.",
      culturalImpact: "Champaner was made the capital of Gujarat, resulting in a unique synthesis of Indo-Islamic structures.",
      shortDesc: "Sultan Mahmud Begada conquers the fort, shifting the capital and altering the hilltop.",
      detailedDesc: "Following a prolonged siege against the Khichi Chauhan Rajputs, Sultan Mahmud Begada conquered the Pavagadh fortress. He shifted his capital to Champaner, naming it Muhammadabad, and constructed a grand palace, mosques, and new outer fortifications.",
      fact: "A shrine of Sadanshah Peer was established on top of the temple dome during this era to prevent further damage.",
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "from-red-700 to-rose-900",
      imgUrl: "/assets/gallery-festival.png"
    },
    {
      id: 6,
      year: "1535 AD",
      dynasty: "Mughal Period",
      title: "Mughal Annexation & Survival",
      event: "Emperor Humayun captures Champaner",
      importance: "Mughal forces took control, but the capital eventually shifted back to Ahmedabad.",
      culturalImpact: "The temple survived in isolation, maintained by local tribal devotees and forest hermits.",
      shortDesc: "Despite regional political instability, the hill remained a vital refuge for Hindu worshippers.",
      detailedDesc: "Mughal Emperor Humayun captured Champaner in 1535. Over the next decades, as the Mughal capital moved to Ahmedabad, the grand palaces of Champaner fell into ruin, but the hilltop temple remained a sacred focal point for local tribal communities who kept worship active.",
      fact: "Abul Fazl's Ain-i-Akbari mentions Pavagadh as a major fortress and spiritual landmark in Gujarat.",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-amber-700 to-yellow-800",
      imgUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 7,
      year: "1727 AD",
      dynasty: "Maratha Era",
      title: "Renoration & Religious Revival",
      event: "Gaekwad & Peshwa patronage",
      importance: "Maratha forces reclaimed the hill, carrying out extensive repairs of the steps and shrine.",
      culturalImpact: "Re-established Navratri celebrations as a public state-sponsored festival.",
      shortDesc: "The Marathas restore the temple, rebuilding the pathways and establishing proper trust systems.",
      detailedDesc: "With the rise of the Maratha Empire, the Peshwas and Gaekwads of Baroda took control of the region. They renovated the main sanctuary, built new resting houses, and established dedicated administrative units to manage the pilgrimage tax and security.",
      fact: "The Scindia and Gaekwad royal families regularly sent gold ornaments for the Goddess.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-orange-600 to-red-800",
      imgUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 8,
      year: "1803 AD",
      dynasty: "British Period",
      title: "British Mapping & Surveys",
      event: "Archaeological records by James Forbes",
      importance: "British surveyors mapped the forest-covered ruins of Champaner and the pathways of Pavagadh.",
      culturalImpact: "Drew global academic attention to the historical values of the site.",
      shortDesc: "Scientific recording of the monuments begins, documenting the historic structures.",
      detailedDesc: "During the British Raj, administrators and historians like James Forbes documented the overgrown ruins in their travelogues. The British repaired the lower roads to Machi to ensure safe passage for pilgrims during annual festivals.",
      fact: "Early British sketches from 1800 show the Pavagadh hill completely covered in dense teak forests.",
      icon: <History className="w-5 h-5" />,
      color: "from-zinc-700 to-neutral-900",
      imgUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 9,
      year: "1953 AD",
      dynasty: "Post-Independence",
      title: "Formation of Mandir Trust",
      event: "Shree Kalika Mataji Mandir Trust formed",
      importance: "A public charitable trust is formed to manage pilgrim facilities and donations.",
      culturalImpact: "Structured development projects, clean water stations, and resting sheds are built.",
      shortDesc: "The establishment of the formal trust to administer temple affairs and assist pilgrims.",
      detailedDesc: "Following India's independence, the Shree Kalika Mataji Mandir Trust was legally constituted. The trust assumed full responsibility for daily aartis, building rest houses (dharmashalas) at Machi base camp, and paving the stone stairs for safer climbs.",
      fact: "The trust is registered under the Bombay Public Trusts Act, 1950.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-teal-600 to-emerald-700",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 10,
      year: "2004 AD",
      dynasty: "UNESCO Inscription",
      title: "UNESCO World Heritage Site",
      event: "UNESCO designates Champaner-Pavagadh Park",
      importance: "The entire park is declared a protected World Heritage site for its complete archaeological landscape.",
      culturalImpact: "Elevated the temple and surrounding monuments onto the global tourism stage.",
      shortDesc: "The historical park gains international recognition, bringing global heritage preservation.",
      detailedDesc: "UNESCO designated the Champaner-Pavagadh Archaeological Park as a World Heritage Site. It represents the only complete, unaltered Islamic pre-Mughal city in India, blending temples, mosques, fortresses, and water structures from the 8th to 16th centuries.",
      fact: "The site contains over 114 registered archaeological monuments spread across 3,280 acres.",
      icon: <Globe className="w-5 h-5" />,
      color: "from-indigo-600 to-blue-800",
      imgUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 11,
      year: "2022 AD",
      dynasty: "Modern Redevelopment",
      title: "The Great Reconstruction",
      event: "PM Modi hoists the flag after 500 years",
      importance: "A ₹359 crore expansion expanded the temple plaza and installed a gold-plated peak (*Shikhar*).",
      culturalImpact: "Devotees can now worship in a spacious complex with modern ropeway elevators.",
      shortDesc: "Comprehensive master plan execution, restoring the historical spire and creating vast plazas.",
      detailedDesc: "Under a grand redevelopment plan by the Gujarat Government and Trust, the ancient temple was restructured using heavy sandstone without shifting the deity. On June 18, 2022, Prime Minister Narendra Modi hoisted the sacred red flag (Dhwaja) atop the newly completed golden peak, ending a 500-year hiatus.",
      fact: "The temple courtyard area was expanded from a tiny 545 sq meters to over 3,000 sq meters.",
      icon: <Award className="w-5 h-5" />,
      color: "from-amber-600 to-yellow-600",
      imgUrl: "/assets/hero-bg.png"
    }
  ];

  // Map markers
  const mapPoints = [
    {
      id: "champaner",
      title: "Champaner Base",
      desc: "UNESCO heritage ruins, ancient mosques, and city fortification walls dating back to the 8th century.",
      x: "20%",
      y: "85%"
    },
    {
      id: "gates",
      title: "Historical Gates",
      desc: "Atak Gate, Halol Gate, and Budhiya Gate built by Solanki and Rajput kings to guard the mountain path.",
      x: "42%",
      y: "65%"
    },
    {
      id: "machi",
      title: "Machi Base Camp",
      desc: "Middle plateau containing the ropeway lower station, pilgrim dormitories, parking, and security desks.",
      x: "55%",
      y: "50%"
    },
    {
      id: "ropeway",
      title: "Udan Khatola Ropeway",
      desc: "Cable car link ascending 762 meters in under 6 minutes, connecting Machi with the temple base.",
      x: "70%",
      y: "35%"
    },
    {
      id: "temple",
      title: "Shree Mahakali Mandir",
      desc: "The sacred hilltop temple containing the main sanctum and the newly redeveloped golden spire peak.",
      x: "88%",
      y: "15%"
    }
  ];

  // History Gallery Images
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop", title: "Intricate Stone Carvings", desc: "10th-century carvings on the pillars of Lakulisa temple." },
    { url: "/assets/about-bg.png", title: "Temple Courtyard", desc: "Devotees gathering in the redeveloped spacious sanctuary plaza." },
    { url: "/assets/hero-bg.png", title: "Spire View", desc: "Aerial view of the golden peak crowning the volcanic cliffs." },
    { url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800&auto=format&fit=crop", title: "Machi Resthouse", desc: "Resthouse options managed by the Kalika Mataji Mandir Trust." },
    { url: "/assets/gallery-festival.png", title: "Red Flag Procession", desc: "Devotees carrying the sacred red flag to hoist atop the शिखर." },
    { url: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop", title: "Devotional Aarti Fire", desc: "Maha Aarti lit during the auspicious Navratri festival." }
  ];

  // Track scroll position to update active index
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const elements = containerRef.current.querySelectorAll('.timeline-era-section');
    
    elements.forEach((el, idx) => {
      const top = (el as HTMLElement).offsetTop;
      const height = (el as HTMLElement).offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        setActiveEraIdx(idx);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FAF6F0] min-h-screen text-text-dark font-sans relative">
      {/* Immersive Scroll progress bar */}
      <div className="fixed top-[76px] left-0 right-0 h-1.5 bg-light-gold-border/20 z-[99]">
        <div 
          className="h-full bg-gradient-to-r from-primary-gold to-deep-maroon transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          style={{ width: `${((activeEraIdx + 1) / milestones.length) * 100}%` }}
        />
      </div>

      {/* Hero Section of History Page */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-light-gold-border/20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/hero-bg.png')` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
        
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
          <span className="text-xs md:text-sm uppercase tracking-widest text-[#E8D7A5] font-bold block animate-pulse">
            A Chronology of Devotion & Heritage
          </span>
          <h1 className="font-serif font-extrabold text-4xl md:text-7xl text-white drop-shadow-lg leading-tight">
            Interactive Historical Journey
          </h1>
          <div className="w-24 h-1.5 bg-primary-gold mx-auto rounded-full" />
          <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Traverse over fifteen centuries of volcanic geography, royal dynasties, invasions, UNESCO recognition, and modern redevelopment of Pavagadh Hill.
          </p>
        </div>
      </section>

      {/* Historical Statistics Dashboard */}
      <section className="py-12 bg-white border-b border-light-gold-border/10 relative z-25">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">{historyYears}+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Years of History</span>
          </div>
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">{pilgrims}M+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Annual Pilgrims</span>
          </div>
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">{elevation}m</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Peak Elevation</span>
          </div>
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">2004</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">UNESCO Year</span>
          </div>
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">6+</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Major Festivals</span>
          </div>
          <div>
            <span className="block font-serif font-extrabold text-2xl md:text-4xl text-deep-maroon">3,000㎡</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Temple Plaza</span>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Spatial Heritage</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Interactive Historical Map</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
          <p className="text-text-muted text-sm">
            Click on the historical markers along the Pavagadh pilgrimage route to reveal information about each key location.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Map Image SVG */}
          <div className="lg:col-span-8 bg-[#EFE9DF] rounded-[28px] border border-light-gold-border/30 p-6 relative min-h-[400px] flex items-center justify-center shadow-inner overflow-hidden select-none">
            {/* Custom styled Hand-drawn Mountain Path SVG */}
            <svg viewBox="0 0 800 500" className="w-full h-full opacity-90">
              {/* Mountain Shape */}
              <path d="M 50 480 Q 200 480 350 400 T 550 250 T 750 80 L 800 500 L 0 500 Z" fill="url(#mountainGrad)" opacity="0.15" />
              {/* Path connector line */}
              <path d="M 160 425 Q 336 325 440 325 T 640 175 T 704 75" fill="none" stroke="#D4AF37" strokeWidth="3" strokeDasharray="8 6" className="animate-[dash_20s_linear_infinite]" />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="mountainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8c7853" />
                  <stop offset="100%" stopColor="#4a1515" />
                </linearGradient>
              </defs>
            </svg>

            {/* Clickable markers */}
            {mapPoints.map((point) => (
              <button
                key={point.id}
                onClick={() => setSelectedMapPoint(point.id)}
                style={{ left: point.x, top: point.y }}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none z-20 ${
                  selectedMapPoint === point.id
                    ? 'bg-deep-maroon text-white scale-125 ring-4 ring-primary-gold/50 shadow-lg'
                    : 'bg-white text-deep-maroon hover:bg-primary-gold hover:text-white border-2 border-primary-gold scale-100 shadow-md'
                }`}
                aria-label={`Show info for ${point.title}`}
              >
                <MapPin className="w-5 h-5" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-deep-maroon/90 text-white text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {point.title}
                </span>
              </button>
            ))}
          </div>

          {/* Map Point Info Card */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {selectedMapPoint && (
                <motion.div
                  key={selectedMapPoint}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-[28px] p-8 border border-light-gold-border/30 space-y-4 shadow-xl h-full flex flex-col justify-center"
                >
                  <span className="text-xs uppercase font-bold tracking-widest text-primary-gold">Pilgrim Landmark</span>
                  <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-deep-maroon">
                    {mapPoints.find(p => p.id === selectedMapPoint)?.title}
                  </h3>
                  <div className="w-16 h-0.5 bg-primary-gold rounded" />
                  <p className="text-xs md:text-sm text-text-dark/95 leading-relaxed font-sans">
                    {mapPoints.find(p => p.id === selectedMapPoint)?.desc}
                  </p>
                  <div className="pt-4 border-t border-light-gold-border/20 flex items-center justify-between text-xs text-text-muted">
                    <span>Route Point</span>
                    <span className="font-bold text-primary-gold uppercase">Active Marker</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Main Split Viewport Timeline */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 relative items-start">
        
        {/* Left Sticky Sidebar: Dynasty & Era details */}
        <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
          <div className="glass-card rounded-[28px] p-8 border border-light-gold-border/30 shadow-xl space-y-6 bg-white/70">
            <div className="flex items-center space-x-2 text-primary-gold">
              <History className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-widest">Active Era Data</span>
            </div>
            
            <div className="space-y-4 text-xs font-sans text-text-dark">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-light-gold-border/10">
                <span className="w-6 text-center text-base">📍</span>
                <span className="text-text-muted font-medium w-24">Year:</span>
                <span className="font-bold text-deep-maroon text-sm">{milestones[activeEraIdx].year}</span>
              </div>
              
              <div className="flex items-center space-x-2.5 pb-3 border-b border-light-gold-border/10">
                <span className="w-6 text-center text-base">👑</span>
                <span className="text-text-muted font-medium w-24">Dynasty:</span>
                <span className="font-bold text-text-dark">{milestones[activeEraIdx].dynasty}</span>
              </div>

              <div className="flex items-center space-x-2.5 pb-3 border-b border-light-gold-border/10">
                <span className="w-6 text-center text-base">🛕</span>
                <span className="text-text-muted font-medium w-24">Major Event:</span>
                <span className="font-bold text-text-dark">{milestones[activeEraIdx].event}</span>
              </div>

              <div className="flex items-start space-x-2.5 pb-3 border-b border-light-gold-border/10">
                <span className="w-6 text-center text-base">📖</span>
                <span className="text-text-muted font-medium w-24 mt-0.5">Importance:</span>
                <span className="font-bold text-text-dark flex-1">{milestones[activeEraIdx].importance}</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-6 text-center text-base">🌍</span>
                <span className="text-text-muted font-medium w-24 mt-0.5">Cultural Impact:</span>
                <span className="font-bold text-text-dark flex-1">{milestones[activeEraIdx].culturalImpact}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-deep-maroon/5 border border-deep-maroon/10 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary-gold block">Historical Quote / Fact</span>
              <p className="text-xs italic text-text-muted leading-relaxed">
                "{milestones[activeEraIdx].fact}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Scrollable Timeline Content */}
        <div className="lg:col-span-8 space-y-24 relative pl-4 md:pl-10 border-l border-light-gold-border/30">
          
          {/* Timeline continuous vertical connector line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-gold via-deep-maroon to-primary-gold opacity-30" />

          {milestones.map((era, idx) => {
            const isCurrent = activeEraIdx === idx;
            const isExpanded = expandedEra === era.id;

            return (
              <div 
                key={era.id} 
                id={`era-section-${era.id}`}
                className="timeline-era-section relative space-y-6 scroll-mt-24"
              >
                {/* Connector Dot */}
                <div className={`absolute -left-[5px] md:-left-[15px] top-6 w-3 h-3 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md transition-all duration-500 z-10 ${
                  isCurrent 
                    ? 'bg-primary-gold scale-125 shadow-[0_0_12px_rgba(212,175,55,0.8)]' 
                    : 'bg-light-gold-border scale-100'
                }`} />

                {/* Milestone Card */}
                <div className={`glass-card rounded-[28px] border p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 ${
                  isCurrent ? 'border-primary-gold/60 ring-1 ring-primary-gold/30 bg-white' : 'border-light-gold-border/20 bg-white/70'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-light-gold-border/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg md:text-xl font-bold uppercase tracking-wider text-primary-gold bg-primary-gold/10 px-4 py-1.5 rounded-full">
                        {era.year}
                      </span>
                      <span className="text-xs font-semibold text-text-muted bg-gray-100 px-3 py-1 rounded-full uppercase">
                        {era.dynasty}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-deep-maroon/5 flex items-center justify-center text-primary-gold">
                      {era.icon}
                    </div>
                  </div>

                  <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-deep-maroon leading-tight mb-4">
                    {era.title}
                  </h3>

                  <p className="text-xs md:text-sm text-text-dark/90 leading-relaxed font-sans mb-4">
                    {era.shortDesc}
                  </p>

                  {/* Inline Image */}
                  <div className="rounded-[20px] overflow-hidden aspect-[21/9] border border-light-gold-border/20 mb-4 relative group">
                    <img 
                      src={era.imgUrl} 
                      alt={era.title} 
                      className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-105" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-[10px] font-bold uppercase tracking-wider">
                      Historical Illustration
                    </span>
                  </div>

                  {/* Expandable Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-4 text-xs md:text-sm text-text-muted leading-relaxed font-sans pt-2"
                      >
                        <p>{era.detailedDesc}</p>
                        <div className="p-4 rounded-xl bg-[#FFF9F2] border border-light-gold-border/20 flex items-start space-x-3">
                          <span className="text-lg">💡</span>
                          <div>
                            <span className="font-bold text-deep-maroon block mb-0.5">Did You Know?</span>
                            <span className="text-xs leading-normal">{era.fact}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedEra(isExpanded ? null : era.id)}
                    className="mt-4 text-xs font-bold text-primary-gold hover:text-deep-maroon flex items-center space-x-1.5 focus:outline-none transition-colors border-t border-light-gold-border/10 pt-4 w-full justify-between"
                  >
                    <span>{isExpanded ? "Show Less" : "Read More & Verify Details"}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* History Masonry Gallery Section */}
      <section className="py-20 px-6 md:px-12 bg-white-card/40 border-t border-light-gold-border/20">
        <div className="max-w-[1440px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Museum Archives</span>
            <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">History Photo Gallery</h2>
            <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
            <p className="text-text-muted text-sm">
              Discover historical carvings, temple paintings, excavations, and heritage remains cataloged by archaeologists.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(img.url)}
                className="break-inside-avoid bg-white border border-light-gold-border/20 rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-5 space-y-1">
                  <h4 className="font-serif font-bold text-deep-maroon text-base">{img.title}</h4>
                  <p className="text-[11px] text-text-muted">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox for Gallery */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-6" onClick={() => setLightboxImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white text-lg bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img src={lightboxImage} alt="Enlarged heritage view" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}
