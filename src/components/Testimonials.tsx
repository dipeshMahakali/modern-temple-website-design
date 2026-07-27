import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      name: "Rajesh Patel",
      location: "Ahmedabad, Gujarat",
      text: "The new redevelopment of Pavagadh is mind-blowing! Walking up the steps feels incredibly clean and organized. Witnessing the sacred flag hoisting after years is a blessing. The trust has done a wonderful job.",
      rating: 5
    },
    {
      name: "Dr. Deepa Sharma",
      location: "Mumbai, Maharashtra",
      text: "Visiting Shree Kalika Mataji Temple during Chaitra Navratri was a divine experience. The ropeway facility makes it very accessible for elderly parents. The view of the valleys below from the peak is magical.",
      rating: 5
    },
    {
      name: "Vikram Khichi",
      location: "Vadodara, Gujarat",
      text: "I visit every month. The online booking portal for Darshan and Flag hosting is extremely smooth. It saves hours of waiting in line. The temple trust provides clean drinking water and resting shelters all along the stairs.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF9F2] relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-gold/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-deep-maroon/5 blur-3xl" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary-gold font-bold">Pilgrim Devotion</span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-deep-maroon">Devotee Experiences</h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
        </div>

        {/* Testimonial Card Slider */}
        <div className="max-w-4xl mx-auto relative px-6 md:px-16">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-light-gold-border/20 flex items-center justify-center text-deep-maroon hover:bg-light-gold-border/20 transition-all shadow-md focus:outline-none z-20"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slider content */}
          <div className="glass-card rounded-[28px] p-8 md:p-12 shadow-xl border border-light-gold-border/30 relative overflow-hidden">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-primary-gold/10 shrink-0" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Rating */}
              <div className="flex space-x-1">
                {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary-gold text-primary-gold" />
                ))}
              </div>

              {/* Review Text */}
              <p className="font-serif italic text-lg md:text-xl text-text-dark/90 leading-relaxed max-w-2xl">
                "{reviews[activeIndex].text}"
              </p>

              {/* Devotee Info */}
              <div>
                <h4 className="font-bold text-deep-maroon text-base">
                  {reviews[activeIndex].name}
                </h4>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">
                  {reviews[activeIndex].location}
                </p>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-light-gold-border/20 flex items-center justify-center text-deep-maroon hover:bg-light-gold-border/20 transition-all shadow-md focus:outline-none z-20"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bullet Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'bg-primary-gold w-6' : 'bg-light-gold-border/65'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
