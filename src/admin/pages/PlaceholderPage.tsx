/**
 * Generic placeholder for admin pages under construction
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <Wrench size={24} style={{ color: '#D4AF37' }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#2D2D2D', fontFamily: '"Playfair Display", serif' }}>
          {title}
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'Inter, sans-serif' }}>
          {description || 'This section is being built and will be available soon.'}
        </p>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4AF37', animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4AF37', animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#D4AF37', animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </div>
  );
}
