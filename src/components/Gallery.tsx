import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, ArrowRight, Camera } from 'lucide-react';
import { publicApi } from '../api/client';
import { getImageUrl } from '../utils/image';
import { useLanguage } from '../context/LanguageContext';
import CardImage from './CardImage';

export interface GalleryItem {
  id: number;
  url: string;
  category: 'temple' | 'festivals' | 'aarti' | 'architecture' | 'nature';
  title: string;
  desc: string;
  is_featured?: boolean;
}

interface GalleryProps {
  setActivePage?: (page: string) => void;
  isHomePage?: boolean;
}

// Fallback high quality heritage photography for Maa Bamleshwari Dongargarh
const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    url: "/assets/hero-bg.png",
    category: "temple",
    title: "Dongargarh Hilltop Temple",
    desc: "An aerial view of Maa Bamleshwari Devi Mandir crowning the 1,600-foot hill crest at golden hour.",
    is_featured: true
  },
  {
    id: 2,
    url: "/assets/gallery-festival.png",
    category: "festivals",
    title: "Sacred Dhwaja Sthapana Procession",
    desc: "Devotees carrying the monumental crimson flag (dhwaja) up the 1,000 steps to hoist atop the temple spire.",
    is_featured: true
  },
  {
    id: 3,
    url: "/assets/about-bg.png",
    category: "aarti",
    title: "Inner Sanctum Divine Lamps",
    desc: "Morning prayers and illuminated brass oil lamps (diyas) inside the sacred temple precinct.",
    is_featured: false
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop",
    category: "architecture",
    title: "Pragyagiri Hill Monument",
    desc: "The monumental Buddha statue and architectural stairs situated atop Pragyagiri Hill in Dongargarh.",
    is_featured: false
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200&auto=format&fit=crop",
    category: "aarti",
    title: "Grand Evening Maha Aarti",
    desc: "Devotional fire offerings performed by temple priests during the auspicious sunset hours.",
    is_featured: true
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    category: "nature",
    title: "Misty Dongargarh Peaks",
    desc: "Spectacular view of the Dongargarh hill ranges shrouded in monsoon clouds and lush greenery.",
    is_featured: false
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=1200&auto=format&fit=crop",
    category: "temple",
    title: "Chhoti Bamleshwari Temple",
    desc: "The peaceful lower shrine sanctuary situated gracefully at the foot of Dongargarh hill.",
    is_featured: false
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=1200&auto=format&fit=crop",
    category: "festivals",
    title: "Navratri Deepotsav Celebration",
    desc: "Thousands of sacred Jyoti Kalash oil lamps illuminating the shrine complex during Navratri.",
    is_featured: true
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
    category: "architecture",
    title: "Heritage Stone Shikhara Architecture",
    desc: "Intricate temple spires and carved stone pillars crowning the sacred precinct.",
    is_featured: false
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop",
    category: "nature",
    title: "Dongargarh Foothill Reservoir",
    desc: "Serene morning reflections over the surrounding water bodies near the sacred mountain.",
    is_featured: false
  }
];

// Helper to filter out inappropriate non-temple photos from API response
const isKnownBadImage = (rawUrl: string) => {
  if (!rawUrl) return false;
  return (
    rawUrl.includes('1545128485-c400e7702796') ||
    rawUrl.includes('1566737236500-c8ac43014a67') ||
    rawUrl.includes('1582510003544-4d00b7f74220') ||
    rawUrl.includes('566737236500') ||
    rawUrl.includes('545128485') ||
    rawUrl.toLowerCase().includes('party') ||
    rawUrl.toLowerCase().includes('club')
  );
};

export default function Gallery({ setActivePage, isHomePage = false }: GalleryProps) {
  const { t } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'temple' | 'festivals' | 'aarti' | 'architecture' | 'nature'>('all');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((item: any): GalleryItem => {
            const cat = (item.category || 'temple').toLowerCase();
            let mappedCat: 'temple' | 'festivals' | 'aarti' | 'architecture' | 'nature' = 'temple';
            if (cat === 'festival' || cat === 'festivals') mappedCat = 'festivals';
            else if (cat === 'aarti') mappedCat = 'aarti';
            else if (cat === 'architecture') mappedCat = 'architecture';
            else if (cat === 'nature') mappedCat = 'nature';

            let imageUrl = getImageUrl(item.url);
            
            // Clean any inappropriate non-temple photo from API
            if (isKnownBadImage(item.url) || isKnownBadImage(imageUrl)) {
              if (mappedCat === 'aarti') {
                imageUrl = "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200&auto=format&fit=crop";
              } else if (mappedCat === 'festivals') {
                imageUrl = "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=1200&auto=format&fit=crop";
              } else if (mappedCat === 'architecture') {
                imageUrl = "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop";
              } else {
                imageUrl = "/assets/hero-bg.png";
              }
            }

            // Fix typos in title text from database
            let cleanTitle = item.alt_text || "Maa Bamleshwari Divine Sight";
            cleanTitle = cleanTitle.replace(/Ceramony/gi, "Ceremony");

            return {
              id: item.id,
              url: imageUrl,
              category: mappedCat,
              title: cleanTitle,
              desc: item.caption || "A sacred visual captured at the holy shrine precinct of Dongargarh.",
              is_featured: Boolean(item.is_featured)
            };
          });
          setGalleryItems(mapped);
        }
      } catch (err) {
        console.warn("Using curated fallback gallery dataset:", err);
      }
    };
    loadGallery();
  }, []);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === activeFilter);
  }, [galleryItems, activeFilter]);

  // Handle keyboard navigation for Lightbox
  const handlePrev = useCallback(() => {
    if (selectedImageIdx === null) return;
    setSelectedImageIdx(prev => (prev === 0 ? filteredItems.length - 1 : (prev ?? 0) - 1));
  }, [selectedImageIdx, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedImageIdx === null) return;
    setSelectedImageIdx(prev => (prev === filteredItems.length - 1 ? 0 : (prev ?? 0) + 1));
  }, [selectedImageIdx, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIdx === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImageIdx(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIdx, handlePrev, handleNext]);

  // Lock scroll when lightbox is active
  useEffect(() => {
    if (selectedImageIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIdx]);

  const categories = [
    { name: t('filter_all', 'All'), value: 'all' },
    { name: t('filter_temple', 'Temple'), value: 'temple' },
    { name: t('filter_festivals', 'Festivals'), value: 'festivals' },
    { name: t('filter_aarti', 'Aarti'), value: 'aarti' },
    { name: t('filter_architecture', 'Architecture'), value: 'architecture' },
    { name: t('filter_nature', 'Nature'), value: 'nature' }
  ];

  // Slice items into top hero collage (Items 0..4) and secondary items (Items 5+)
  const heroItems = isHomePage ? filteredItems.slice(0, 5) : filteredItems.slice(0, 5);
  const secondaryItems = isHomePage ? [] : filteredItems.slice(5);

  const featuredItem = heroItems[0];
  const supportingItems = heroItems.slice(1, 5);

  // Determine span class for secondary items so NO ORPHAN CARDS are ever left alone!
  const getSecondarySpanClass = (idx: number, count: number) => {
    if (count === 1) return "col-span-12 aspect-[16/9]";
    if (count === 2) return "col-span-12 sm:col-span-6 aspect-[16/10]";
    if (count === 3) return "col-span-12 sm:col-span-6 lg:col-span-4 aspect-[4/3]";
    if (count === 4) return "col-span-12 sm:col-span-6 lg:col-span-3 aspect-[4/3]";
    if (count === 5) {
      if (idx < 2) return "col-span-12 sm:col-span-6 aspect-[16/10]";
      return "col-span-12 sm:col-span-4 aspect-[4/3]";
    }
    if (count === 6) return "col-span-12 sm:col-span-6 lg:col-span-4 aspect-[4/3]";
    if (count === 7) {
      if (idx < 3) return "col-span-12 sm:col-span-4 aspect-[4/3]";
      return "col-span-12 sm:col-span-6 lg:col-span-3 aspect-[4/3]";
    }
    const remainder = count % 4;
    if (remainder !== 0 && idx >= count - remainder) {
      if (remainder === 1) return "col-span-12 aspect-[16/9]";
      if (remainder === 2) return "col-span-12 sm:col-span-6 aspect-[16/10]";
      if (remainder === 3) return "col-span-12 sm:col-span-4 aspect-[4/3]";
    }
    return "col-span-12 sm:col-span-6 lg:col-span-3 aspect-[4/3]";
  };

  return (
    <section id="gallery-section" className="pt-6 sm:pt-10 lg:pt-14 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto font-sans mb-12 lg:mb-20">
      {/* ─── 1. HERITAGE GALLERY HEADER ───────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8 space-y-2">
        {/* Eyebrow */}
        <div className="flex items-center justify-center space-x-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
          <span className="text-[10px]">✦</span>
          <span>{isHomePage ? t('eyebrow_home_gallery', 'VISUAL JOURNEY') : t('eyebrow_gallery', 'EXPLORE THE TEMPLE')}</span>
          <span className="text-[10px]">✦</span>
        </div>

        {/* Confident Heritage Heading */}
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#6B1E1E] tracking-tight leading-[1.18]">
          {isHomePage ? t('heading_home_gallery', 'Moments from Dongargarh') : t('heading_gallery', 'Moments of Maa Bamleshwari')}
        </h1>

        {/* Refined Description */}
        <p className="text-[#777777] text-sm sm:text-[16px] leading-relaxed max-w-xl mx-auto font-sans pt-1">
          {isHomePage
            ? t('subheading_home_gallery', 'Experience the sacred beauty, timeless architecture, festivals and serene mountain vistas of Dongargarh.')
            : t('subheading_gallery', 'Discover the sacred beauty, timeless architecture, festivals and serene landscapes of Dongargarh.')}
        </p>

        {/* Subtle Heritage Ornamental Divider */}
        <div className="flex items-center justify-center space-x-3 max-w-xs mx-auto text-[#E8D7A5] pt-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#E8D7A5]/80" />
          <span className="text-[10px] text-[#D4AF37]">◈</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#E8D7A5]/80" />
        </div>
      </div>

      {/* ─── 2. CATEGORY FILTERS (Full Gallery Page only) ────────────────── */}
      {!isHomePage && (
        <div className="flex items-center justify-center mb-8 sm:mb-10 w-full px-2">
          <div className="flex items-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto no-scrollbar py-1.5 px-2.5 sm:px-4 rounded-full bg-white/90 backdrop-blur-md border border-[#E8D7A5]/40 shadow-2xs select-none">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveFilter(cat.value as any)}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium text-[12px] sm:text-[14px] whitespace-nowrap transition-all duration-300 focus:outline-none cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#6B1E1E] text-white shadow-md shadow-[#6B1E1E]/20 font-semibold'
                      : 'bg-white text-[#2D2D2D] hover:text-[#6B1E1E] hover:bg-[#FFF9F2] border border-[#E8D7A5]/40'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 3. EDITORIAL GALLERY COLLAGE (FIRST VIEWPORT COMPOSITION) ──── */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/80 rounded-3xl border border-[#E8D7A5]/40 p-8 shadow-2xs">
          <Camera className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-lg text-[#6B1E1E]">No Photographs Found</h3>
          <p className="text-xs text-[#777777] mt-1">Please select another category tab above.</p>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {/* Top Collage Block: 1 Featured Anchor + 4 Supporting Images */}
          {featuredItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
              
              {/* ─── FEATURED IMAGE (occupies ~50% width on Desktop) ──── */}
              <div
                onClick={() => setSelectedImageIdx(0)}
                className={`relative group cursor-pointer overflow-hidden rounded-[22px] bg-stone-100 border border-[#E8D7A5]/40 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end ${
                  supportingItems.length > 0 
                    ? 'lg:col-span-6 xl:col-span-7 h-[340px] sm:h-[400px] lg:h-[470px]' 
                    : 'lg:col-span-12 h-[420px]'
                }`}
              >
                {/* Image */}
                <CardImage
                  src={featuredItem.url}
                  alt={featuredItem.title}
                  className="absolute inset-0 w-full h-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                  }}
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="capitalize">{featuredItem.category}</span>
                </div>

                {/* Permanent gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

                {/* Text Overlay Content & View Button */}
                <div className="relative z-20 p-5 sm:p-7 flex items-end justify-between">
                  <div className="max-w-xl space-y-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                      Featured Temple Highlight
                    </span>
                    <h3 className="font-serif font-bold text-white text-lg sm:text-2xl drop-shadow-md leading-snug">
                      {featuredItem.title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm font-sans line-clamp-2">
                      {featuredItem.desc}
                    </p>
                  </div>

                  {/* Circular Muted Gold Expand Icon */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#C8A45A] transition-all duration-300 shrink-0 ml-4">
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>

              {/* ─── 4 SUPPORTING IMAGES (2x2 grid beside featured) ────── */}
              {supportingItems.length > 0 && (
                <div className="lg:col-span-6 xl:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 h-full">
                  {supportingItems.map((item, idx) => {
                    const realIdx = idx + 1;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImageIdx(realIdx)}
                        className="relative group cursor-pointer overflow-hidden rounded-[16px] bg-stone-100 border border-[#E8D7A5]/30 shadow-xs hover:shadow-lg transition-all duration-500 h-[160px] sm:h-[190px] lg:h-[225px]"
                      >
                        <CardImage
                          src={item.url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full"
                          imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                          }}
                        />

                        {/* Category tag */}
                        <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-xs border border-white/20 text-white text-[9px] font-semibold uppercase tracking-wider">
                          {item.category}
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                        {/* Text Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-20 flex items-end justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-white text-xs sm:text-[14px] line-clamp-1 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-white/70 text-[10px] font-sans line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#D4AF37]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 ml-1">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── 4. SECONDARY COLLECTION (RECOMPOSED: ZERO ORPHAN CARDS) ── */}
          {!isHomePage && secondaryItems.length > 0 && (
            <div className="pt-6 sm:pt-8">
              {/* Section Header */}
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#6B1E1E] whitespace-nowrap">
                  More Sacred Collection
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-[#E8D7A5]/70 to-transparent flex-grow" />
              </div>

              {/* Dynamic Grid Layout that intelligently balances item count */}
              <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
                {secondaryItems.map((item, idx) => {
                  const realIdx = idx + 5;
                  const spanClass = getSecondarySpanClass(idx, secondaryItems.length);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImageIdx(realIdx)}
                      className={`relative group cursor-pointer overflow-hidden rounded-[16px] bg-white border border-[#E8D7A5]/30 shadow-xs hover:shadow-lg transition-all duration-500 ${spanClass}`}
                    >
                      <CardImage
                        src={item.url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full"
                        imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                        }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-xs border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider">
                        {item.category}
                      </div>

                      {/* Dark Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
                              {item.category}
                            </span>
                            <h4 className="font-serif font-bold text-white text-sm sm:text-base leading-snug">
                              {item.title}
                            </h4>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md shrink-0 ml-2">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── HOME PAGE VIEW ALL CTA ──────────────────────────────────── */}
          {isHomePage && (
            <div className="text-center pt-4 sm:pt-6">
              <button
                onClick={() => {
                  if (setActivePage) setActivePage('gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full gold-gradient text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>View Full Temple Gallery ({galleryItems.length} Photos)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── 5. FULLSCREEN LIGHTBOX MODAL ────────────────────────────── */}
      {selectedImageIdx !== null && filteredItems[selectedImageIdx] && (
        <div
          className="fixed inset-0 bg-black/92 backdrop-blur-md z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImageIdx(null);
          }}
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white z-50 py-2 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                {filteredItems[selectedImageIdx].category}
              </span>
              <span className="text-xs text-white/60 font-sans">
                Photo {selectedImageIdx + 1} of {filteredItems.length}
              </span>
            </div>

            <button
              onClick={() => setSelectedImageIdx(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none transition-colors cursor-pointer"
              aria-label="Close lightbox"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Navigation & Main Image */}
          <div className="relative w-full max-w-5xl flex-grow flex items-center justify-center py-4 select-none">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white focus:outline-none transition-all duration-300 z-50 cursor-pointer shadow-2xl hover:scale-110"
              aria-label="Previous photo"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Main Centered Image */}
            <div className="max-w-full max-h-[75vh] flex items-center justify-center px-8">
              <img
                src={filteredItems[selectedImageIdx].url}
                alt={filteredItems[selectedImageIdx].title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white focus:outline-none transition-all duration-300 z-50 cursor-pointer shadow-2xl hover:scale-110"
              aria-label="Next photo"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Bottom Caption Overlay */}
          <div className="w-full max-w-xl text-center space-y-1 z-50 pb-2">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
              {filteredItems[selectedImageIdx].title}
            </h3>
            <p className="text-white/75 text-xs sm:text-sm font-sans leading-relaxed">
              {filteredItems[selectedImageIdx].desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
