'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ImageWithFallback({ src, alt, className, width, height }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !src) {
    // Tampilkan placeholder jika ada error atau src kosong
    if (width && height) {
      // Untuk logo organisasi
      return (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500 text-xs dark:text-gray-400">
          {alt.substring(0, 3)}
        </div>
      );
    } else {
      // Untuk artikel
      return (
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-full h-full flex items-center justify-center text-gray-500 text-xs dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-gray-400">
          <span>Image not available</span>
        </div>
      );
    }
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}