import React, { useState } from 'react';

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string; // Container extra class (e.g. "w-full h-full")
  imgClassName?: string; // Additional classes for the foreground image (e.g. hover transitions)
  bgBlur?: boolean; // Whether to render the blurred background layer (default: true)
  bgClassName?: string; // Additional styling for background image layer
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Reusable CardImage component for fixed-size cards with arbitrary source images.
 * Implements a two-layer approach:
 * 1. Background layer: same image, object-fit: cover, blurred & darkened, filling the card.
 * 2. Foreground image: same image, object-fit: contain, centered, never cropped or distorted.
 */
export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  bgBlur = true,
  bgClassName = '',
  loading,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`card-image-container relative w-full h-full overflow-hidden ${className}`}>
      {/* Background layer: blurred/darkened version of the same image */}
      {bgBlur && !hasError && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={`card-image-bg w-full h-full object-cover object-center filter blur-md brightness-75 scale-110 transition-transform duration-500 ${bgClassName}`}
          />
        </div>
      )}

      {/* Foreground layer: full uncropped original image with object-contain */}
      <img
        src={src}
        alt={alt}
        className={`card-image relative z-10 w-full h-full object-contain object-center ${imgClassName}`}
        loading={loading}
        onError={handleError}
      />
    </div>
  );
};

export default CardImage;
