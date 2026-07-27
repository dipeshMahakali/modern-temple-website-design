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
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>("temple");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const dragStart = useRef<{ x: number; scrollLeft: number }>({ x: 0, scrollLeft: 0 });

  // Mouse hover light coords for manuscript page
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
      icon: <Sparkles className="w-4 h-4" />,
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
      icon: <Award className="w-4 h-4" />,
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
      icon: <Landmark className="w-4 h-4" />,
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
      icon: <BookOpen className="w-4 h-4" />,
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
      icon: <Award className="w-4 h-4" />,
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
      icon: <ShieldAlert className="w-4 h-4" />,
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
      icon: <BookOpen className="w-4 h-4" />,
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
      icon: <Landmark className="w-4 h-4" />,
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
      icon: <History className="w-4 h-4" />,
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
      icon: <Landmark className="w-4 h-4" />,
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
      icon: <Globe className="w-4 h-4" />,
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
      icon: <Award className="w-4 h-4" />,
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
      icon: <Sparkles className="w-4 h-4" />,
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
      y: "80%"
    },
    {
      id: "stairs",
      title: "The 1,000-Step Pathway",
      desc: "A fully covered stone staircase ascending 1,600 feet to the top, equipped with drinking water stalls and safety railings.",
      x: "42%",
      y: "60%"
    },
    {
      id: "ropeway",
      title: "Passenger Ropeway Station",
      desc: "Chhattisgarh's only passenger ropeway, offering a scenic 5-minute cable car ride up to the Badi Bamleshwari temple.",
      x: "55%",
      y: "45%"
    },
    {
      id: "pragyagiri",
      title: "Pragyagiri Hill",
      desc: "Adjacent hill hosting a magnificent 30-foot tall golden statue of Lord Buddha, accessed via 225 steps.",
      x: "70%",
      y: "30%"
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

  const scrollToMilestone = (idx: number) => {
    if (idx < 0 || idx >= milestones.length) return;
    setDirection(idx > activeEraIdx ? 1 : -1);
    setActiveEraIdx(idx);

    const container = timelineContainerRef.current;
    const node = document.getElementById(`timeline-node-${idx}`);
    if (container && node) {
      isProgrammaticScroll.current = true;
      const containerWidth = container.clientWidth;
      const nodeWidth = node.clientWidth;
      const nodeLeft = node.offsetLeft;

      container.scrollTo({
        left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'chronicle') return;
      if (e.key === 'ArrowRight' || e.key === 'd') {
        scrollToMilestone(Math.min(activeEraIdx + 1, milestones.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        scrollToMilestone(Math.max(activeEraIdx - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEraIdx, activeTab]);

  // Auto-advance logic: moves chapters forward after 15 seconds (middle of 10-20 secs range) by default.
  // Resets timer on user interaction (hovering the page, dragging/scrolling timeline, or switching chapters).
  useEffect(() => {
    if (activeTab !== 'chronicle') return;
    if (isHovered || isDraggingTimeline) return;

    const timer = setInterval(() => {
      const nextIdx = (activeEraIdx + 1) % milestones.length;
      scrollToMilestone(nextIdx);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [activeEraIdx, activeTab, isHovered, isDraggingTimeline]);

  // Handle drag to scroll on the timeline container
  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if (!timelineContainerRef.current) return;
    setIsDraggingTimeline(true);
    dragStart.current = {
      x: e.clientX,
      scrollLeft: timelineContainerRef.current.scrollLeft
    };
  };

  const handleTimelineMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTimeline || !timelineContainerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.current.x;
    timelineContainerRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const handleTimelineMouseUpOrLeave = () => {
    setIsDraggingTimeline(false);
  };

  // Automatically update active tab on timeline scroll center snap
  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScroll.current || isDraggingTimeline) return;

    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;

    let closestIdx = activeEraIdx;
    let minDiff = 120; // threshold for snap pick

    milestones.forEach((_, idx) => {
      const node = document.getElementById(`timeline-node-${idx}`);
      if (node) {
        const nodeCenter = node.offsetLeft + node.clientWidth / 2;
        const diff = Math.abs(nodeCenter - containerCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      }
    });

    if (closestIdx !== activeEraIdx) {
      setDirection(closestIdx > activeEraIdx ? 1 : -1);
      setActiveEraIdx(closestIdx);
    }
  };

  // Mouse coordinate tracker for moving light reflection on manuscript page
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Kindle Page-turn animations variants
  const pageVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? 12 : -12,
      rotate: dir > 0 ? 2 : -2,
      x: dir > 0 ? 30 : -30,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      rotateY: 0,
      rotate: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1] as const, // premium cubic-bezier easing
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? -12 : 12,
      rotate: dir > 0 ? -2 : 2,
      x: dir > 0 ? -30 : 30,
      scale: 0.98,
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1] as const,
      }
    })
  };

  const activeEra = milestones[activeEraIdx];

  return (
    <section
      id="timeline-section"
      className="bg-[#F8F4EC] relative z-20 h-[720px] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Museum Header Tab Switcher */}
      <div className="py-3 px-6 md:px-12 max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[rgba(107,31,31,0.12)] shrink-0 bg-[#F8F4EC]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C8A45A] font-bold">Museum Exhibition</span>
          <h2 className="font-serif font-extrabold text-xl md:text-2xl text-[#6B1F1F]">Royal Chronicle Archives</h2>
        </div>
        <div className="flex bg-[#FFFDF8] p-1 rounded-full border border-[rgba(107,31,31,0.12)] shadow-xs">
          <button
            onClick={() => setActiveTab('chronicle')}
            className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'chronicle' ? 'bg-[#6B1F1F] text-[#FFFDF8] shadow-sm' : 'text-[#777777] hover:text-[#6B1F1F]'
              }`}
          >
            Chronicle Page
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'map' ? 'bg-[#6B1F1F] text-[#FFFDF8] shadow-sm' : 'text-[#777777] hover:text-[#6B1F1F]'
              }`}
          >
            Historical Map
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'gallery' ? 'bg-[#6B1F1F] text-[#FFFDF8] shadow-sm' : 'text-[#777777] hover:text-[#6B1F1F]'
              }`}
          >
            Archives
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Immersive Chronicle Page Turn Experience */}
        {activeTab === 'chronicle' && (
          <motion.div
            key="chronicle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between overflow-hidden relative py-2"
          >
            {/* Top Navigation above the manuscript */}
            <div className="flex items-center justify-between px-6 md:px-12 py-1 max-w-[1440px] w-full mx-auto shrink-0 z-10">
              <button
                disabled={activeEraIdx === 0}
                onClick={() => scrollToMilestone(activeEraIdx - 1)}
                className="flex items-center space-x-2 text-[11px] font-serif font-bold text-[#6B1F1F] disabled:opacity-30 hover:text-[#C8A45A] transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>← Previous Chapter</span>
              </button>

              <div className="text-center font-serif text-xs text-[#8B6A3E] italic">
                Chapter {activeEraIdx + 1} of {milestones.length}
              </div>

              <button
                disabled={activeEraIdx === milestones.length - 1}
                onClick={() => scrollToMilestone(activeEraIdx + 1)}
                className="flex items-center space-x-2 text-[11px] font-serif font-bold text-[#6B1F1F] disabled:opacity-30 hover:text-[#C8A45A] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Next Chapter →</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Manuscript Card Viewport */}
            <div className="flex-grow flex items-center justify-center relative w-full px-4" style={{ perspective: 1200 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeEraIdx}
                  custom={direction}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onMouseMove={handleCardMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative w-full max-w-2xl h-[420px] md:h-[470px] bg-[#FFFDF8] rounded-[20px] border-4 border-double border-[rgba(107,31,31,0.15)] shadow-xl flex flex-col justify-between overflow-hidden transform-gpu"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 20px 40px -10px rgba(107, 31, 31, 0.12), 0 0 16px rgba(200, 164, 90, 0.08)",
                  }}
                >
                  {/* Subtle Paper Texture Overlay (3% Opacity) */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                  />

                  {/* Moveable light reflection overlay */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 200px at ${coords.x}px ${coords.y}px, rgba(200, 164, 90, 0.07) 0%, rgba(255,255,255,0) 85%)`
                      }}
                    />
                  )}

                  {/* Spine Crease / Binding Fold shadow effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none rounded-l-2xl" />

                  {/* Header / Image Top Banner */}
                  <div className="relative h-44 md:h-56 w-full shrink-0 overflow-hidden border-b border-[rgba(107,31,31,0.08)]">
                    <img
                      src={activeEra.imgUrl}
                      alt={activeEra.title}
                      className="w-full h-full object-cover object-center filter sepia-[0.08] brightness-[1.04] contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF8]/60 via-transparent to-transparent" />

                    {/* Inner gold line accent */}
                    <div className="absolute bottom-2 left-2 right-2 border-t border-[#C8A45A]/30 pointer-events-none" />
                  </div>

                  {/* Title and Badge Metadata Row */}
                  <div className="px-5 pt-3 flex flex-wrap items-center justify-between gap-2 shrink-0 z-5">
                    <h3 className="font-serif font-extrabold text-base md:text-lg text-[#6B1F1F]">
                      {activeEra.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#C8A45A]/10 text-[#C8A45A] border border-[#C8A45A]/20">
                        {activeEra.year}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#8B6A3E]/10 text-[#8B6A3E] border border-[#8B6A3E]/20">
                        {activeEra.dynasty}
                      </span>
                    </div>
                  </div>

                  {/* Manuscript Body - Scrolls Internally */}
                  <div className="flex-grow overflow-y-auto px-5 py-2 space-y-3 custom-gold-scrollbar text-xs md:text-sm leading-relaxed text-[#2C2C2C] z-5">
                    <p className="font-sans text-[#2C2C2C]/90">
                      {activeEra.detailedDesc}
                    </p>

                    {/* Importance Section */}
                    <div className="border-l-2 border-[#C8A45A] pl-3 py-1 bg-[#C8A45A]/3 rounded-r">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-[#8B6A3E]">Historical Importance</span>
                      <p className="text-[11px] text-[#2C2C2C]/80 mt-0.5">{activeEra.importance}</p>
                    </div>

                    {/* Cultural Impact Section */}
                    <div className="border-l-2 border-[#6B1F1F] pl-3 py-1 bg-[#6B1F1F]/3 rounded-r">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6B1F1F]">Cultural Impact</span>
                      <p className="text-[11px] text-[#2C2C2C]/80 mt-0.5">{activeEra.culturalImpact}</p>
                    </div>

                    {/* Historical fact callout */}
                    <div className="bg-[#FBF9F3] p-2.5 rounded-lg border border-[rgba(107,31,31,0.06)] italic text-[11px] text-[#2C2C2C]/70">
                      📖 {activeEra.fact}
                    </div>
                  </div>

                  {/* Verified Source Footer Badge */}
                  <div className="px-5 py-2 border-t border-[rgba(107,31,31,0.08)] flex items-center justify-between shrink-0 bg-[#FFFDF8]/95 z-5">
                    <span className="text-[9px] text-[#777777]">Source: Archival Museum Records</span>
                    <div className="flex items-center space-x-1 text-[#6B1F1F] bg-[#6B1F1F]/5 px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#6B1F1F]/10">
                      <Check className="w-3 h-3 text-[#6B1F1F]" />
                      <span>VERIFIED SOURCE</span>
                    </div>
                  </div>

                  {/* Progress Line on Page Turn */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[rgba(107,31,31,0.05)] pointer-events-none">
                    <div
                      className="h-full bg-[#C8A45A] transition-all duration-500 ease-out"
                      style={{ width: `${((activeEraIdx + 1) / milestones.length) * 100}%` }}
                    />
                  </div>

                  {/* Page Edge Darkening overlay during transition */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.12, 0] }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none z-20"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Horizontal timeline wraps around the bottom */}
            <div className="relative w-full h-[120px] shrink-0 border-t border-[rgba(107,31,31,0.08)] bg-[#F8F4EC] mt-2 flex flex-col justify-center">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F8F4EC] to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F8F4EC] to-transparent pointer-events-none z-10" />

              {/* Floating Left/Right Navigation Arrows */}
              <button
                onClick={() => scrollToMilestone(activeEraIdx - 1)}
                disabled={activeEraIdx === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF8] border border-[rgba(107,31,31,0.12)] flex items-center justify-center text-[#6B1F1F] hover:text-[#C8A45A] disabled:opacity-30 shadow-xs transition-colors z-20 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToMilestone(activeEraIdx + 1)}
                disabled={activeEraIdx === milestones.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF8] border border-[rgba(107,31,31,0.12)] flex items-center justify-center text-[#6B1F1F] hover:text-[#C8A45A] disabled:opacity-30 shadow-xs transition-colors z-20 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Scroll Container */}
              <div
                ref={timelineContainerRef}
                onScroll={handleTimelineScroll}
                onMouseDown={handleTimelineMouseDown}
                onMouseMove={handleTimelineMouseMove}
                onMouseUp={handleTimelineMouseUpOrLeave}
                onMouseLeave={handleTimelineMouseUpOrLeave}
                className="w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar flex items-center cursor-grab active:cursor-grabbing px-16 md:px-36 select-none"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="relative flex items-center h-full min-w-max pr-24">
                  {/* Central Progress Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(107,31,31,0.08)] -translate-y-1/2 pointer-events-none" />
                  <div
                    className="absolute top-1/2 left-0 h-[2px] bg-[#C8A45A] -translate-y-1/2 pointer-events-none transition-all duration-500 shadow-[0_0_8px_#C8A45A]"
                    style={{
                      width: `${(activeEraIdx / (milestones.length - 1)) * 100}%`
                    }}
                  />

                  {/* Milestone Nodes */}
                  {milestones.map((m, idx) => {
                    const isCurrent = idx === activeEraIdx;
                    const isPrevious = idx < activeEraIdx;
                    const isUpcoming = idx > activeEraIdx;

                    return (
                      <div
                        key={m.id}
                        id={`timeline-node-${idx}`}
                        onClick={() => scrollToMilestone(idx)}
                        className="snap-center flex flex-col items-center justify-center relative w-28 md:w-32 shrink-0 group py-2"
                      >
                        {/* Year Above Circle */}
                        <motion.span
                          animate={{
                            scale: isCurrent ? 1.15 : 1,
                            color: isCurrent ? "#6B1F1F" : isPrevious ? "#8B6A3E" : "#777777"
                          }}
                          transition={{ duration: 0.3 }}
                          className={`text-[10px] md:text-[11px] font-bold tracking-wide transition-all`}
                        >
                          {m.year}
                        </motion.span>

                        {/* Node Circle */}
                        <div className="relative my-2.5">
                          <motion.div
                            animate={{
                              scale: isCurrent ? 1.25 : 1,
                              backgroundColor: isCurrent ? "#C8A45A" : isPrevious ? "#6B1F1F" : "#FFFDF8",
                              borderColor: isCurrent ? "#C8A45A" : isPrevious ? "#6B1F1F" : "rgba(107,31,31,0.2)",
                              boxShadow: isCurrent ? "0 0 12px rgba(200, 164, 90, 0.6)" : "none"
                            }}
                            transition={{ duration: 0.3 }}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white transition-all`}
                          >
                            {isPrevious ? (
                              <Check className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <div className={isCurrent ? "text-white" : "text-[#777777]/50"}>
                                {m.icon}
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* Short Title Below Circle */}
                        <span
                          className={`text-[9px] md:text-[10px] font-serif text-center max-w-[90px] truncate transition-all duration-300 ${isCurrent ? 'text-[#2C2C2C] font-bold' : 'text-[#777777]'
                            }`}
                        >
                          {m.title}
                        </span>

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 transition-all duration-200">
                          <div className="bg-[#2C2C2C] text-[#FFFDF8] text-[9px] py-1 px-2 rounded-md shadow-md whitespace-nowrap">
                            {m.title}
                          </div>
                          <div className="w-1.5 h-1.5 bg-[#2C2C2C] rotate-45 -mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Interactive Historical Map */}
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-hidden py-4 px-6 md:px-12 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row gap-6"
          >
            {/* Map Canvas */}
            <div className="flex-1 bg-[#EFE9DF] rounded-[20px] border-4 border-double border-[rgba(107,31,31,0.12)] p-4 relative min-h-[300px] flex items-center justify-center shadow-inner overflow-hidden select-none">
              {/* Custom SVG Noise overlay for texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              />

              <svg viewBox="0 0 800 500" className="w-full h-full opacity-90">
                <path d="M 50 480 Q 200 480 350 400 T 550 250 T 750 80 L 800 500 L 0 500 Z" fill="url(#mountainGrad)" opacity="0.15" />
                <path d="M 160 400 Q 336 300 440 300 T 640 150 T 704 60" fill="none" stroke="#C8A45A" strokeWidth="3" strokeDasharray="8 6" />
                <defs>
                  <linearGradient id="mountainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8c7853" />
                    <stop offset="100%" stopColor="#6b1f1f" />
                  </linearGradient>
                </defs>
              </svg>

              {mapPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelectedMapPoint(point.id)}
                  style={{ left: point.x, top: point.y }}
                  className={`absolute w-9 h-9 -ml-4.5 -mt-4.5 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none z-20 cursor-pointer ${selectedMapPoint === point.id
                    ? 'bg-[#6B1F1F] text-[#FFFDF8] scale-110 ring-4 ring-[#C8A45A]/50 shadow-md'
                    : 'bg-[#FFFDF8] text-[#6B1F1F] hover:bg-[#C8A45A] hover:text-[#FFFDF8] border-2 border-[#C8A45A] scale-100 shadow-sm'
                    }`}
                >
                  <MapPin className="w-4.5 h-4.5" />
                </button>
              ))}
            </div>

            {/* Map Landmark Info Panel */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {selectedMapPoint && (
                  <motion.div
                    key={selectedMapPoint}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative rounded-[20px] p-6 border-4 border-double border-[rgba(107,31,31,0.12)] space-y-3 shadow-lg bg-[#FFFDF8] h-full lg:h-[350px] flex flex-col justify-center overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                      }}
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A45A]">Pilgrim Landmark</span>
                    <h3 className="font-serif font-extrabold text-lg md:text-xl text-[#6B1F1F]">
                      {mapPoints.find(p => p.id === selectedMapPoint)?.title}
                    </h3>
                    <div className="w-12 h-0.5 bg-[#C8A45A] rounded" />
                    <p className="text-xs md:text-sm text-[#2C2C2C]/90 leading-relaxed font-sans">
                      {mapPoints.find(p => p.id === selectedMapPoint)?.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
            className="flex-1 overflow-y-auto custom-gold-scrollbar py-4 px-6 md:px-12 max-w-[1440px] w-full mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImage(img.url)}
                  className="bg-[#FFFDF8] border-2 border-[rgba(107,31,31,0.08)] rounded-[16px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group p-2 relative"
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                  />
                  <div className="relative overflow-hidden aspect-[4/3] rounded-lg">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="font-serif font-bold text-[#6B1F1F] text-sm md:text-base">{img.title}</h4>
                    <p className="text-[10px] text-[#777777]">{img.desc}</p>
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
            className="absolute top-6 right-6 text-white text-lg bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img src={lightboxImage} alt="Enlarged heritage view" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-4 border-[#C8A45A]/30" />
        </div>
      )}
    </section>
  );
}
