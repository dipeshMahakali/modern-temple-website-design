import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Award, ShieldAlert, History, MapPin, 
  BookOpen, Landmark, Camera, Calendar, ArrowRight, 
  HelpCircle, Eye, ChevronDown, Check, Globe,
  ChevronLeft, ChevronRight
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
  const [activeTab, setActiveTab] = useState<'chronicle' | 'map' | 'gallery'>('chronicle');
  const [activeEraIdx, setActiveEraIdx] = useState(0);
  const [expandedEra, setExpandedEra] = useState<number | null>(null);
  const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>("temple");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const milestones: Milestone[] = [
    {
      id: 0,
      year: "Ancient Origins",
      dynasty: "Pre-Historic",
      title: "Volcanic Hills of Dongargarh",
      event: "Formation of the igneous rocky hills of Dongargarh millions of years ago, rising high above the Chhattisgarhi plains.",
      importance: "The topography features steep cliffs, rock caves, and scenic heights that became prime spiritual sanctuaries.",
      culturalImpact: "Known historically as 'Dongar' (mountain/hill) and 'Garh' (fortress) in the Gond dialect.",
      shortDesc: "The natural elevation of the Dongargarh mountain sets a majestic physical stage for ancient shrines and spiritual seekers.",
      detailedDesc: "Formed millions of years ago, the hills of Dongargarh rise abruptly to 1,600 feet from the surrounding plains of Rajnandgaon, Chhattisgarh. The rocky terrain, rich with natural caves and springs, attracted sages and tribal communities who recognized it as a seat of intense spiritual energy (Shakti).",
      fact: "Dongargarh's rocks are predominantly igneous formations, giving them a rugged, durable texture.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-orange-500 to-amber-600",
      imgUrl: "/assets/hero-bg.png"
    },
    {
      id: 1,
      year: "200 BC",
      dynasty: "Kamavati Kingdom",
      title: "Reign of Raja Veersen",
      event: "Raja Veersen establishes the Kamavati Nagari and builds the temple of Maa Bamleshwari.",
      importance: "Raja Veersen was childless and prayed to Lord Shiva and Goddess Parvati. After his prayers were answered with a son named Madansen, he built the shrine as a tribute of gratitude.",
      culturalImpact: "Establishes Maa Bamleshwari Devi as the patron guardian deity of the kingdom.",
      shortDesc: "King Veersen establishes the temple in Kamavati (now Dongargarh) after being blessed with a son, Madansen.",
      detailedDesc: "According to ancient records, the city was ruled by Raja Veersen around 2,200 years ago. Being childless, he conducted severe prayers. Upon being blessed with a son, whom he named Madansen, he built a temple for Goddess Bamleshwari Devi (originally called Bambleshwari) on the high summit as an offering of eternal gratitude.",
      fact: "The name 'Bamleshwari' is believed to derive from 'Bambleshwari' or the source of cosmic power and prosperity.",
      icon: <Award className="w-5 h-5" />,
      color: "from-red-600 to-rose-700",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 2,
      year: "100 BC",
      dynasty: "Kamavati Dynasty",
      title: "Era of King Kamasen",
      event: "Raja Kamasen succeeds the throne and renames the capital Kamavati Nagari.",
      importance: "The city flourishes into a major art and music hub, attracting legendary dancers and musicians.",
      culturalImpact: "Enhances the fame of the hilltop shrine across central India.",
      shortDesc: "The kingdom expands under Madansen's son, Raja Kamasen, who patronizes arts and music at the foothills of the shrine.",
      detailedDesc: "Raja Kamasen, the grandson of Raja Veersen, was a great patron of arts. Under his rule, the city of Kamavati became an artistic oasis. Worshippers and artists alike visited the hilltop shrine of Maa Bamleshwari to seek blessings for creativity and prosperity, spreading the temple's fame throughout ancient India.",
      fact: "Ancient Kamavati was known for its highly structured palaces, ponds, and hilltop watchtowers.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-yellow-600 to-amber-700",
      imgUrl: "/assets/gallery-festival.png"
    },
    {
      id: 3,
      year: "1st Century BC",
      dynasty: "Imperial Era",
      title: "Love & Legend of Kamkandla",
      event: "The tragic love story between Madhavnal (court musician) and Kamkandla (court dancer) unfolds.",
      importance: "Leading to a massive clash of empires between King Kamasen and Emperor Vikramaditya of Ujjain.",
      culturalImpact: "A tale of devotion and sacrifice that forever links Dongargarh with Ujjain's royal lore.",
      shortDesc: "The musical love story between a court musician and a dancer leads to a historic intervention.",
      detailedDesc: "In the court of King Kamasen, a talented musician named Madhavnal fell in love with Kamkandla, a beautiful court dancer. Suspecting treason, King Kamasen banished Madhavnal. Madhavnal sought help from the legendary Emperor Vikramaditya of Ujjain, who marched to Kamavati with his forces, leading to a destructive war.",
      fact: "Local folk plays (Chhattisgarhi Lok Natya) still narrate the epic romance of Madhavnal and Kamkandla.",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-blue-600 to-indigo-700",
      imgUrl: "/assets/hero-bg.png"
    },
    {
      id: 4,
      year: "57 BC",
      dynasty: "Paramara Dynasty",
      title: "Vikramaditya's Penance",
      event: "Emperor Vikramaditya prays to Maa Bamleshwari to end the bloodshed and revive the fallen.",
      importance: "Maa Bamleshwari appears in person, resolves the conflict, and blesses the lovers.",
      culturalImpact: "Ujjain's Emperor expands the temple, establishing the stone stairs and a grand gateway.",
      shortDesc: "Emperor Vikramaditya performs intense penance to Maa Bamleshwari, who appears to bring peace and revive the dead.",
      detailedDesc: "Realizing the massive loss of life during the war, Emperor Vikramaditya felt deep remorse. He sat on the hilltop and performed intense penance, offering his own head. Maa Bamleshwari appeared, stopped him, and revived both Madhavnal and the fallen soldiers. She established peace between the two kingdoms and blessed the region.",
      fact: "Legend holds that Vikramaditya established the Badi Bamleshwari idol at the top and Chhoti Bamleshwari at the base.",
      icon: <Award className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-700",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 5,
      year: "12th Century",
      dynasty: "Gond Kingdom",
      title: "Gond and Kalachuri Patronage",
      event: "Local Gond kings and Kalachuris of Ratanpur preserve and fortify the hilltop shrine.",
      importance: "The fortress of Dongargarh ('Hill Fort') becomes an important strategic and spiritual outpost.",
      culturalImpact: "Integration of tribal and Vedic rites of worship at the shrine, defining local culture.",
      shortDesc: "Gond rulers and the Kalachuri dynasty safeguard the mountain pathways, preserving the shrine as a local sanctuary.",
      detailedDesc: "During the medieval period, Chhattisgarh was ruled by the Kalachuris and Gond chieftains. The fortress of Dongargarh served as a military outpost. The rulers patronized the temple, maintaining the rocky paths and recognizing Maa Bamleshwari as the supreme protector of the forest lands.",
      fact: "The name Dongargarh itself combines Gondi/Chhattisgarhi 'Dongar' (mountain) and 'Garh' (fort).",
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "from-red-700 to-rose-900",
      imgUrl: "/assets/gallery-festival.png"
    },
    {
      id: 6,
      year: "1750 AD",
      dynasty: "Maratha Empire",
      title: "Maratha Revival",
      event: "The Bhonsle rulers of Nagpur annex Chhattisgarh and renovate the temple.",
      importance: "Pujas are standardized, and the temple undergoes structural expansion with stone steps.",
      culturalImpact: "The practice of lighting 'Jyoti Kalash' (oil lamps) during Navratri gains state-level patronship.",
      shortDesc: "The Nagpur Marathas renovate the temple, paving pathways and establishing regular priestly customs.",
      detailedDesc: "When the Maratha Bhonsle dynasty of Nagpur took control of the Chhattisgarh region, they actively supported the temple. They built permanent steps up the hill, established lodging shelters for travelers, and organized formal administrative support for the Navratri fairs.",
      fact: "The Bhonsle kings sent special brass lamps and silk garments to the deity during Navratri.",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-amber-700 to-yellow-800",
      imgUrl: "/assets/hero-bg.png"
    },
    {
      id: 7,
      year: "1888 AD",
      dynasty: "British Raj",
      title: "Introduction of Railways",
      event: "The Bengal Nagpur Railway (BNR) line opens, passing through Dongargarh Station.",
      importance: "Dongargarh becomes a key transit point, opening easy access for pilgrims from central and eastern India.",
      culturalImpact: "Pilgrimage numbers grow exponentially as train travel connects Dongargarh to major cities.",
      shortDesc: "The construction of the Bengal Nagpur Railway connects Dongargarh, transforming the remote hill shrine into a major pilgrimage hub.",
      detailedDesc: "The opening of the railway line in 1888 changed the accessibility of Dongargarh. The British established a railway colony and terminal here. Devotees from Bengal, Maharashtra, and Madhya Pradesh could now easily reach the temple, elevating it to one of Central India's premier pilgrim sites.",
      fact: "Dongargarh Railway Station still has ancient steam-locomotive water towers dating back to the late 19th century.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-orange-600 to-red-800",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 8,
      year: "1964 AD",
      dynasty: "Independent India",
      title: "Shri Bamleshwari Mandir Trust",
      event: "Formation of the Shri Bamleshwari Mandir Trust Samiti to administer temple operations.",
      importance: "Ensures transparent management, pilgrim safety, and systematic infrastructure expansion.",
      culturalImpact: "Organized massive Navratri fairs and established standard security, water, and hygiene facilities.",
      shortDesc: "A dedicated public trust is legally formed to systematically manage the expanding pilgrim facilities and resources.",
      detailedDesc: "To handle the growing influx of pilgrims, local community leaders and government representatives formed the Shri Bamleshwari Mandir Trust Samiti. The trust replaced unstructured private management, directing donations towards stairs maintenance, water pipelines, and modern sanitation.",
      fact: "The trust manages one of the largest free community kitchens (Annakshetra) in the Rajnandgaon district.",
      icon: <History className="w-5 h-5" />,
      color: "from-zinc-700 to-neutral-900",
      imgUrl: "/assets/gallery-festival.png"
    },
    {
      id: 9,
      year: "1995 AD",
      dynasty: "Cultural Renaissance",
      title: "Establishment of Pragyagiri",
      event: "Consecration of the massive golden Lord Buddha statue on the neighboring Pragyagiri hill.",
      importance: "Expands Dongargarh's spiritual profile to include major Buddhist heritage.",
      culturalImpact: "Fosters inter-faith harmony, drawing international Buddhist pilgrims to Dongargarh.",
      shortDesc: "Dongargarh establishes a multi-faith spiritual landscape with a grand Buddhist monument on the adjacent Pragyagiri hill.",
      detailedDesc: "Under the guidance of Buddhist monks, the adjacent Pragyagiri hill was developed. A 30-foot tall golden statue of Lord Buddha facing east was constructed, accessible by 225 steps. It became a venue for the annual International Buddhist Conclave, adding a serene layer of cultural heritage to Dongargarh.",
      fact: "The Pragyagiri hill offers a stunning panoramic view of Badi Bamleshwari Temple and Chhirpani lake.",
      icon: <Landmark className="w-5 h-5" />,
      color: "from-teal-600 to-emerald-700",
      imgUrl: "/assets/hero-bg.png"
    },
    {
      id: 10,
      year: "2005 AD",
      dynasty: "Modern Infrastructure",
      title: "Inauguration of the Ropeway",
      event: "Construction of the passenger ropeway system to Badi Bamleshwari temple.",
      importance: "Chhattisgarh's only ropeway, reducing the ascent to just under 5 minutes.",
      culturalImpact: "Allows elderly, disabled, and children to experience the hilltop darshan without physical strain.",
      shortDesc: "The installation of the passenger cable car system makes the 1,600-foot climb accessible to all devotees.",
      detailedDesc: "In response to the physically demanding 1,000-step climb, the trust and state government collaborated to install a modern passenger ropeway. Spanning from the foothills to the summit, it became a pioneering engineering feat in the state and a major tourist attraction, transporting hundreds of pilgrims hourly.",
      fact: "The ropeway offers a thrilling view of the surrounding Satpura mountain range and Dongargarh town.",
      icon: <Globe className="w-5 h-5" />,
      color: "from-indigo-600 to-blue-800",
      imgUrl: "/assets/about-bg.png"
    },
    {
      id: 11,
      year: "2020 AD",
      dynasty: "National Heritage",
      title: "PRASHAD Development Project",
      event: "Dongargarh selected under the Central Government's PRASHAD scheme for mega tourism development.",
      importance: "Inclusion in the national pilgrimage scheme brings funds for major infrastructure upgrades.",
      culturalImpact: "Development of a unified tourism corridor, heritage interpretation centers, and pilgrim plazas.",
      shortDesc: "The Ministry of Tourism selects Dongargarh under the PRASHAD scheme, funding world-class facilities and corridor upgrades.",
      detailedDesc: "Recognizing Dongargarh's national pilgrimage value, the Ministry of Tourism, Government of India, included it in the PRASHAD scheme. This initiated major development projects, including massive pilgrim facilitation centers, parking bays, light-and-sound shows, and eco-tourism trails around the hills.",
      fact: "The PRASHAD project funds over ₹43 Crore of holistic tourist amenities in the Dongargarh temple precinct.",
      icon: <Award className="w-5 h-5" />,
      color: "from-amber-600 to-yellow-600",
      imgUrl: "/assets/gallery-festival.png"
    },
    {
      id: 12,
      year: "Present Day",
      dynasty: "Active Devotion",
      title: "The Devotional Beacon",
      event: "Hosting over 50 Lakh pilgrims annually with millions lighting Jyoti Kalash during Navratri.",
      importance: "Dongargarh stands as one of Central India's most modern and highly managed holy destinations.",
      culturalImpact: "Integrates ancient rituals, multi-faith pilgrimage, digital live darshan, and green tourism.",
      shortDesc: "Welcoming millions of pilgrims annually, the temple remains a focal point of intense devotion and modern management.",
      detailedDesc: "Today, Dongargarh Maa Bamleshwari Temple is a thriving center of spiritual and cultural life. Managed by the trust and supported by Chhattisgarh Tourism, it provides digital services, eco-friendly pathways, ropeways, and free meals, standing as a proud beacon of Central Indian heritage.",
      fact: "During Navratri, more than 8,000 Jyoti Kalash (oil and ghee lamps) are lit by devotees in the temple galleries.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-red-600 to-orange-600",
      imgUrl: "/assets/hero-bg.png"
    }
  ];

  const mapPoints = [
    {
      id: "foothills",
      title: "Chhoti Bamleshwari Temple",
      desc: "The sacred temple located at the base of the hill. Pilgrims traditionally start their journey by seeking blessings here.",
      x: "20%",
      y: "85%"
    },
    {
      id: "stairs",
      title: "The 1,000-Step Pathway",
      desc: "A fully covered stone staircase ascending 1,600 feet to the top, equipped with drinking water stalls and safety railings.",
      x: "42%",
      y: "65%"
    },
    {
      id: "ropeway",
      title: "Passenger Ropeway Station",
      desc: "Chhattisgarh's only passenger ropeway, offering a scenic 5-minute cable car ride up to the Badi Bamleshwari temple.",
      x: "55%",
      y: "50%"
    },
    {
      id: "pragyagiri",
      title: "Pragyagiri Hill",
      desc: "Adjacent hill hosting a magnificent 30-foot tall golden statue of Lord Buddha, accessed via 225 steps.",
      x: "70%",
      y: "35%"
    },
    {
      id: "temple",
      title: "Badi Bamleshwari Temple",
      desc: "The historical hilltop sanctuary housing the main deity of Maa Bamleshwari Devi, offering panoramic views of Rajnandgaon.",
      x: "88%",
      y: "15%"
    }
  ];

  const galleryImages = [
    { url: "/assets/about-bg.png", title: "Badi Bamleshwari Entrance", desc: "The entrance to the hilltop temple at 1,600 feet." },
    { url: "/assets/about-bg.png", title: "Temple Courtyard Plaza", desc: "Devotees gathering in the spacious hilltop courtyard." },
    { url: "/assets/hero-bg.png", title: "Lord Buddha at Pragyagiri", desc: "The majestic 30-foot golden Buddha statue on Pragyagiri hill." },
    { url: "/assets/hero-bg.png", title: "Trust Dharamshala complex", desc: "Accommodation buildings managed by the Shri Bamleshwari Mandir Trust." },
    { url: "/assets/gallery-festival.png", title: "Navratri Jyoti Kalash", desc: "Hundreds of sacred oil lamps lit by devotees in the temple halls." },
    { url: "/assets/gallery-festival.png", title: "Passenger Cable Cars", desc: "Ropeway service carrying pilgrims to the summit of Dongargarh hill." }
  ];

  const handleRightScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    if (clientHeight === 0) return;
    const newIdx = Math.round(scrollTop / clientHeight);
    if (newIdx >= 0 && newIdx < milestones.length && newIdx !== activeEraIdx) {
      setActiveEraIdx(newIdx);
    }
  };

  const scrollToIdx = (idx: number) => {
    const target = document.getElementById(`milestone-card-${idx}`);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveEraIdx(idx);
    }
  };

  const handleContinue = () => {
    const nextSection = document.getElementById('gallery-section') || document.getElementById('services-section') || document.getElementById('footer-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile Swipe Handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      if (activeEraIdx < milestones.length - 1) {
        setActiveEraIdx(prev => prev + 1);
      }
    }
    if (diff < -50) {
      if (activeEraIdx > 0) {
        setActiveEraIdx(prev => prev - 1);
      }
    }
  };

  return (
    <section id="timeline-section" className="bg-[#FAF6F0] relative z-20">
      
      {/* Immersive Dashboard Header (Map/Timeline/Gallery Switcher) */}
      <div className="py-8 px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-light-gold-border/20">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Museum Exhibits</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Dongargarh Heritage</h2>
        </div>
        <div className="flex bg-white/70 backdrop-blur-xs p-1 rounded-full border border-light-gold-border/30 shadow-sm">
          <button
            onClick={() => setActiveTab('chronicle')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
              activeTab === 'chronicle' ? 'bg-deep-maroon text-white shadow-md' : 'text-text-muted hover:text-deep-maroon'
            }`}
          >
            Chronicle Timeline
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
              activeTab === 'map' ? 'bg-deep-maroon text-white shadow-md' : 'text-text-muted hover:text-deep-maroon'
            }`}
          >
            Historical Map
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
              activeTab === 'gallery' ? 'bg-deep-maroon text-white shadow-md' : 'text-text-muted hover:text-deep-maroon'
            }`}
          >
            Museum Archives
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Internally Scrollable Immersive Chronicle */}
        {activeTab === 'chronicle' && (
          <motion.div
            key="chronicle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full relative h-[80vh] min-h-[600px] lg:h-[90vh] overflow-hidden flex flex-col lg:flex-row bg-[#FAF6F0]"
          >
            {/* Desktop View Layout */}
            {!isMobileOrTablet ? (
              <>
                {/* Left Panel: Sticky Information & Quick Navigation */}
                <div className="w-[35%] h-full p-8 border-r border-light-gold-border/20 flex flex-col justify-between overflow-y-auto no-scrollbar bg-white/40">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-serif font-extrabold text-primary-gold bg-primary-gold/10 px-4 py-1.5 rounded-2xl">
                        {milestones[activeEraIdx].year}
                      </span>
                      <span className="text-xs font-bold text-text-muted bg-gray-100 px-3 py-1 rounded-full uppercase">
                        {milestones[activeEraIdx].dynasty}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary-gold">Active Chapter</h4>
                      <h3 className="font-serif font-extrabold text-2xl text-deep-maroon leading-snug">
                        {milestones[activeEraIdx].title}
                      </h3>
                      <div className="h-0.5 w-12 bg-primary-gold rounded" />
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-3.5 text-xs text-text-dark font-sans pt-2">
                      <div className="pb-2 border-b border-light-gold-border/10 flex flex-col space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary-gold">📍 Major Event</span>
                        <span className="leading-relaxed">{milestones[activeEraIdx].event}</span>
                      </div>
                      <div className="pb-2 border-b border-light-gold-border/10 flex flex-col space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary-gold">📖 Historical Importance</span>
                        <span className="leading-relaxed">{milestones[activeEraIdx].importance}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary-gold">🌍 Cultural Impact</span>
                        <span className="leading-relaxed">{milestones[activeEraIdx].culturalImpact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Vertical Navigation / Quick Jump */}
                  <div className="mt-8 pt-6 border-t border-light-gold-border/20 flex items-stretch space-x-4 h-44">
                    {/* Left: Progress line with active dots */}
                    <div className="relative w-2 flex flex-col justify-between items-center py-2 shrink-0">
                      <div className="absolute top-0 bottom-0 w-0.5 bg-light-gold-border/30" />
                      <div 
                        className="absolute top-0 w-0.5 bg-primary-gold transition-all duration-500 shadow-[0_0_8px_rgba(212,175,55,0.7)]" 
                        style={{ height: `${(activeEraIdx / (milestones.length - 1)) * 90}%` }}
                      />
                      {milestones.map((m, idx) => (
                        <div 
                          key={m.id} 
                          className={`w-2.5 h-2.5 rounded-full z-10 transition-all duration-300 ${
                            idx <= activeEraIdx ? 'bg-primary-gold scale-125' : 'bg-light-gold-border/60 scale-100'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Right: Quick jump buttons */}
                    <div className="flex-1 overflow-y-auto custom-gold-scrollbar pr-2 space-y-1.5">
                      {milestones.map((m, idx) => (
                        <button
                          key={m.id}
                          onClick={() => scrollToIdx(idx)}
                          className={`w-full text-left text-[11px] font-bold tracking-wide uppercase transition-colors block ${
                            activeEraIdx === idx ? 'text-primary-gold' : 'text-text-muted hover:text-text-dark'
                          }`}
                        >
                          • {m.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Scrollable cards with scroll-snap */}
                <div
                  ref={rightPanelRef}
                  onScroll={handleRightScroll}
                  className="w-[65%] h-full overflow-y-auto scroll-smooth snap-y snap-mandatory custom-gold-scrollbar relative bg-[#FAF6F0]"
                >
                  {milestones.map((era, idx) => {
                    const isLast = idx === milestones.length - 1;
                    return (
                      <div
                        key={era.id}
                        id={`milestone-card-${idx}`}
                        className="h-full w-full flex items-center justify-center snap-start shrink-0 relative p-8 lg:p-12"
                      >
                        <div className="glass-card rounded-[28px] p-6 lg:p-8 border border-light-gold-border/20 shadow-md space-y-4 bg-white w-full max-w-xl mx-auto flex flex-col justify-between">
                          <div className="flex items-center justify-between border-b border-light-gold-border/10 pb-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-primary-gold">
                              Milestone {idx + 1} of {milestones.length}
                            </span>
                            <span className="text-xs text-text-muted">{era.year}</span>
                          </div>

                          <h3 className="font-serif font-extrabold text-2xl text-deep-maroon leading-tight">
                            {era.title}
                          </h3>

                          <p className="text-xs lg:text-sm text-text-dark/95 leading-relaxed font-sans">
                            {era.shortDesc}
                          </p>

                          <div className="rounded-[20px] overflow-hidden aspect-[21/9] border border-light-gold-border/10">
                            <img src={era.imgUrl} alt={era.title} className="w-full h-full object-cover" />
                          </div>

                          {/* Expansion Panel */}
                          {expandedEra === era.id && (
                            <p className="text-xs text-text-muted leading-relaxed font-sans border-t border-light-gold-border/10 pt-3 animate-fade-in">
                              {era.detailedDesc}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => setExpandedEra(expandedEra === era.id ? null : era.id)}
                              className="text-xs font-bold text-primary-gold hover:text-deep-maroon transition-colors focus:outline-none flex items-center space-x-1"
                            >
                              <span>{expandedEra === era.id ? "Show Less" : "Verify Detailed History"}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedEra === era.id ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {/* Completed Milestone glow badge */}
                            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </div>
                          </div>

                          {/* Last slide scroll exit footer */}
                          {isLast && (
                            <div className="pt-4 border-t border-light-gold-border/10 flex flex-col items-center space-y-2">
                              <span className="text-xs font-bold text-text-muted">
                                You have reached the present day.
                              </span>
                              <button
                                onClick={handleContinue}
                                className="px-6 py-2 rounded-full bg-deep-maroon text-white text-xs font-bold shadow-md hover:bg-deep-maroon/95 transition-all inline-flex items-center space-x-1"
                              >
                                <span>Continue Exploring</span>
                                <ChevronDown className="w-4 h-4 animate-bounce" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Mobile/Tablet Swipeable Viewport */
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full p-6 flex flex-col justify-between bg-[#FAF6F0] relative"
              >
                {/* Upper active card metadata header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-extrabold text-primary-gold">
                      {milestones[activeEraIdx].year}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-text-muted bg-gray-100 px-3 py-1 rounded-full">
                      {milestones[activeEraIdx].dynasty}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-deep-maroon">
                    {milestones[activeEraIdx].title}
                  </h3>
                </div>

                {/* Main Swipe Deck Active Card */}
                <div className="flex-grow flex items-center justify-center py-4">
                  <motion.div
                    key={activeEraIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-[24px] p-5 border border-light-gold-border/20 shadow-md space-y-4 bg-white w-full max-w-md flex flex-col justify-between h-[360px] overflow-y-auto no-scrollbar"
                  >
                    <div className="space-y-2">
                      <p className="text-xs text-text-dark/95 leading-relaxed font-sans">
                        {milestones[activeEraIdx].shortDesc}
                      </p>
                      
                      <div className="p-3 rounded-xl bg-deep-maroon/5 border border-deep-maroon/10">
                        <p className="text-[10px] italic text-text-muted leading-relaxed">
                          "{milestones[activeEraIdx].fact}"
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden h-28 border border-light-gold-border/10 shrink-0">
                      <img src={milestones[activeEraIdx].imgUrl} alt={milestones[activeEraIdx].title} className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                </div>

                {/* Lower Action bar & exit options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">
                      Chapter {activeEraIdx + 1} of {milestones.length}
                    </span>

                    {/* Navigation buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => activeEraIdx > 0 && setActiveEraIdx(prev => prev - 1)}
                        disabled={activeEraIdx === 0}
                        className="w-9 h-9 rounded-full bg-white border border-light-gold-border/30 flex items-center justify-center text-deep-maroon disabled:opacity-40"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => activeEraIdx < milestones.length - 1 && setActiveEraIdx(prev => prev + 1)}
                        disabled={activeEraIdx === milestones.length - 1}
                        className="w-9 h-9 rounded-full bg-white border border-light-gold-border/30 flex items-center justify-center text-deep-maroon disabled:opacity-40"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Exit Continue explore options */}
                  {activeEraIdx === milestones.length - 1 && (
                    <button
                      onClick={handleContinue}
                      className="w-full py-3 rounded-xl gold-gradient text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Continue Exploring Below</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Interactive Historical Map */}
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full py-12 px-6 md:px-12 max-w-[1440px] mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-8 bg-[#EFE9DF] rounded-[28px] border border-light-gold-border/30 p-6 relative min-h-[400px] flex items-center justify-center shadow-inner overflow-hidden select-none">
                <svg viewBox="0 0 800 500" className="w-full h-full opacity-90">
                  <path d="M 50 480 Q 200 480 350 400 T 550 250 T 750 80 L 800 500 L 0 500 Z" fill="url(#mountainGrad)" opacity="0.15" />
                  <path d="M 160 425 Q 336 325 440 325 T 640 175 T 704 75" fill="none" stroke="#D4AF37" strokeWidth="3" strokeDasharray="8 6" />
                  <defs>
                    <linearGradient id="mountainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8c7853" />
                      <stop offset="100%" stopColor="#4a1515" />
                    </linearGradient>
                  </defs>
                </svg>

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
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                ))}
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {selectedMapPoint && (
                    <motion.div
                      key={selectedMapPoint}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card rounded-[28px] p-8 border border-light-gold-border/30 space-y-4 shadow-xl h-full flex flex-col justify-center bg-white"
                    >
                      <span className="text-xs uppercase font-bold tracking-widest text-primary-gold">Pilgrim Landmark</span>
                      <h3 className="font-serif font-extrabold text-2xl md:text-3xl text-deep-maroon">
                        {mapPoints.find(p => p.id === selectedMapPoint)?.title}
                      </h3>
                      <div className="w-16 h-0.5 bg-primary-gold rounded" />
                      <p className="text-xs md:text-sm text-text-dark/95 leading-relaxed font-sans">
                        {mapPoints.find(p => p.id === selectedMapPoint)?.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: History Masonry Photo Gallery */}
        {activeTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full py-12 px-6 md:px-12 max-w-[1440px] mx-auto space-y-8"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

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
    </section>
  );
}
