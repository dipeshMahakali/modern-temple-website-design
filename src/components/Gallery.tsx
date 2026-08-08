import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../api/client';
import { getImageUrl } from '../utils/image';

interface GalleryItem {
  id: number;
  url: string;
  category: 'temple' | 'festivals' | 'aarti' | 'architecture' | 'nature';
  title: string;
  desc: string;
}

const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    url: "/assets/hero-bg.png",
    category: "temple",
    title: "Dongargarh Hilltop Temple",
    desc: "An aerial illustration of Maa Bamleshwari Devi Mandir crowning the hill crest at sunrise."
  },
  {
    id: 2,
    url: "/assets/gallery-festival.png",
    category: "festivals",
    title: "Dhwaja Procession",
    desc: "Devotees carrying a large sacred red flag (dhwaja) to hoist atop the temple spire."
  },
  {
    id: 3,
    url: "/assets/about-bg.png",
    category: "aarti",
    title: "Ganesha Sanctuary Shrine",
    desc: "Morning prayers inside the temple complex with lit brass oil lamps (diyas)."
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop",
    category: "architecture",
    title: "Pragyagiri Buddha Statue",
    desc: "The monumental Buddha statue located on Pragyagiri Hill, a spiritual landmark of Dongargarh."
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop",
    category: "aarti",
    title: "Evening Maha Aarti",
    desc: "High spiritual fire offerings performed by temple priests during sunset."
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    category: "nature",
    title: "Dongargarh Misty Peaks",
    desc: "Spectacular view of Dongargarh Hill engulfed in monsoon clouds and lush greenery."
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?q=80&w=800&auto=format&fit=crop",
    category: "temple",
    title: "Chhoti Bamleshwari Temple",
    desc: "The beautiful Chhoti Bamleshwari temple located at the base of the hill."
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop",
    category: "festivals",
    title: "Navratri Celebration",
    desc: "Thousands of Jyoti Kalash lamps illuminating the temple complex during the Navratri festival."
  }
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'temple' | 'festivals' | 'aarti' | 'architecture' | 'nature'>('all');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((item: any): GalleryItem => {
            const cat = item.category.toLowerCase();
            let mappedCat: any = 'temple';
            if (cat === 'festival' || cat === 'festivals') mappedCat = 'festivals';
            else if (cat === 'aarti') mappedCat = 'aarti';
            else if (cat === 'architecture') mappedCat = 'architecture';
            else if (cat === 'nature') mappedCat = 'nature';
            else mappedCat = 'temple';

            return {
              id: item.id,
              url: getImageUrl(item.url),
              category: mappedCat,
              title: item.alt_text || "Dongargarh Divine Sight",
              desc: item.caption || "A sacred visual captured from Shree Mahakali Mataji Temple precinct."
            };
          });
          setGalleryItems(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch gallery items, using local fallback:", err);
      }
    };
    loadGallery();
  }, []);

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const categories = [
    { name: "All", value: "all" },
    { name: "Temple", value: "temple" },
    { name: "Festivals", value: "festivals" },
    { name: "Aarti", value: "aarti" },
    { name: "Architecture", value: "architecture" },
    { name: "Nature", value: "nature" }
  ];

  const handlePrev = () => {
    if (selectedImageIdx === null) return;
    setSelectedImageIdx(selectedImageIdx === 0 ? filteredItems.length - 1 : selectedImageIdx - 1);
  };

  const handleNext = () => {
    if (selectedImageIdx === null) return;
    setSelectedImageIdx(selectedImageIdx === filteredItems.length - 1 ? 0 : selectedImageIdx + 1);
  };

  return (
    <section id="gallery-section" className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Divine Visuals</span>
        <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Temple Gallery</h2>
        <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        <p className="text-text-muted text-sm leading-relaxed">
          Explore the spiritual aura, historic landmarks, and beautiful seasons of Dongargarh through our curated photo collection.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value as any)}
            className={`px-6 py-2 rounded-full font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 focus:outline-none ${
              activeFilter === cat.value
                ? 'bg-deep-maroon text-white shadow-md'
                : 'bg-white text-text-dark border border-light-gold-border/20 hover:border-primary-gold/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Pinterest Masonry Grid */}
      <div className="masonry-grid">
        {filteredItems.map((item, idx) => {
          return (
            <div
              key={item.id}
              onClick={() => setSelectedImageIdx(idx)}
              className="relative group cursor-pointer overflow-hidden rounded-[24px] bg-white border border-light-gold-border/20 shadow-md hover:shadow-xl transition-all duration-500 break-inside-avoid"
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-stone-100 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero-bg.png';
                  }}
                />
              </div>
              
              {/* Overlay with Title & Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <div className="w-8 h-8 rounded-full bg-primary-gold text-white flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-white text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.title}
                </h4>
                <p className="text-white/70 text-xs mt-1 font-sans transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIdx !== null && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Top Controls */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-50">
            <div>
              <h3 className="font-serif font-bold text-lg md:text-xl text-primary-gold">
                {filteredItems[selectedImageIdx].title}
              </h3>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Category: <span className="capitalize">{filteredItems[selectedImageIdx].category}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedImageIdx(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none transition-all duration-300 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none transition-all duration-300 z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Centered Image */}
          <div className="max-w-5xl max-h-[75vh] relative flex items-center justify-center z-40 select-none">
            <img
              src={filteredItems[selectedImageIdx].url}
              alt={filteredItems[selectedImageIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-scale-up"
            />
          </div>

          {/* Description overlay */}
          <div className="mt-6 max-w-2xl text-center text-white/80 text-sm font-sans z-40">
            <p>{filteredItems[selectedImageIdx].desc}</p>
          </div>
        </div>
      )}
    </section>
  );
}
