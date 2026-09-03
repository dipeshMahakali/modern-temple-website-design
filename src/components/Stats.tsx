import React, { useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { publicApi } from '../api/client';
import DynamicIcon from './DynamicIcon';

interface StatItemProps {
  icon: string;
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
        <DynamicIcon name={icon} className="w-7 h-7" />
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

interface StatItemData {
  id: number;
  icon: string;
  label: string;
  target_value: number;
  suffix: string;
  subtext: string;
}

export default function Stats() {
  const [stats, setStats] = useState<StatItemData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicApi.getStats();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    fetchStats();
  }, []);

  const defaultStats = [
    { icon: "History", label: "Years of History", target_value: 2200, suffix: "+", subtext: "Spiritual Legacy since 200 BC" },
    { icon: "Users", label: "Temple Elevation", target_value: 1600, suffix: " Ft", subtext: "Height of Badi Bamleshwari Hill" },
    { icon: "Radio", label: "Temple Steps", target_value: 1000, suffix: "+", subtext: "Steps to the Hilltop Sanctum" },
    { icon: "Clock", label: "Annual Festivals", target_value: 2, suffix: " Grand", subtext: "Chaitra & Sharadiya Navratri" }
  ];

  const currentStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-16 px-6 md:px-12 max-w-[1440px] mx-auto relative z-25 -mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, idx) => (
          <StatItem
            key={idx}
            icon={stat.icon}
            label={stat.label}
            targetValue={stat.target_value}
            suffix={stat.suffix}
            subtext={stat.subtext}
          />
        ))}
      </div>
    </section>
  );
}
