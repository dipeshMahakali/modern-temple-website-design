import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { History, Users, Radio, Clock } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  targetValue: number;
  suffix: string;
  subtext: string;
}

function StatItem({ icon, label, targetValue, suffix, subtext }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const incrementTime = 40;
    const steps = duration / incrementTime;
    const stepValue = targetValue / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  return (
    <div
      ref={ref}
      className="glass-card rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="w-14 h-14 rounded-full bg-deep-maroon/5 flex items-center justify-center text-deep-maroon mb-4">
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-wider text-temple-brown uppercase mb-1">
        {label}
      </span>
      <h3 className="text-4xl md:text-5xl font-serif font-extrabold text-deep-maroon mb-2 flex items-center justify-center">
        {count}
        <span>{suffix}</span>
      </h3>
      <p className="text-xs text-text-muted font-medium tracking-wide">
        {subtext}
      </p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-16 px-6 md:px-12 max-w-[1440px] mx-auto relative z-25 -mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem
          icon={<History className="w-7 h-7" />}
          label="Temple History"
          targetValue={1500}
          suffix="+"
          subtext="Years of Spiritual Legacy"
        />
        <StatItem
          icon={<Users className="w-7 h-7" />}
          label="Daily Devotees"
          targetValue={2}
          suffix=" Lakhs+"
          subtext="Pilgrims visiting daily"
        />
        <StatItem
          icon={<Radio className="w-7 h-7 animate-pulse text-red-600" />}
          label="Daily Darshan"
          targetValue={1}
          suffix=" Live"
          subtext="Continuous digital broadcast"
        />
        <StatItem
          icon={<Clock className="w-7 h-7" />}
          label="Temple Opening"
          targetValue={13}
          suffix=".5 Hrs"
          subtext="6:00 AM to 7:30 PM open"
        />
      </div>
    </section>
  );
}
