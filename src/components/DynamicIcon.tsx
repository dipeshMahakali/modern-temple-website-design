import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number | string;
  hidden?: boolean;
}

export default function DynamicIcon({ name, className, color, size, hidden }: DynamicIconProps) {
  if (hidden || !name) return null;

  const style: React.CSSProperties = {
    color: color || undefined,
    width: size || undefined,
    height: size || undefined,
  };

  const trimmed = name.trim();
  
  // Detect if name is a raw SVG or path snippet
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<path') || trimmed.includes('<svg')) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className || ''}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  // Map common custom or missing names
  const normalizedName = trimmed;
  
  // @ts-ignore
  const IconComponent = LucideIcons[normalizedName];
  
  if (!IconComponent) {
    // Try PascalCase conversion if not matches (e.g. book-open -> BookOpen)
    const pascalName = normalizedName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // @ts-ignore
    const PascalIcon = LucideIcons[pascalName];
    if (PascalIcon) {
      return <PascalIcon className={className} style={style} />;
    }

    // Fallback if none found
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback className={className} style={style} />;
  }

  return <IconComponent className={className} style={style} />;
}
