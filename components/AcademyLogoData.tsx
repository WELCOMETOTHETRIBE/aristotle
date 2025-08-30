"use client";

import academyLogo from '@/data/academy_logo_r2.png';

interface AcademyLogoDataProps {
  className?: string;
  size?: number;
}

export default function AcademyLogoData({ className = "", size = 96 }: AcademyLogoDataProps) {
  return (
    <img
      src={academyLogo.src}
      alt="Academy Logo"
      className={`w-${size/4} h-${size/4} object-contain relative z-10 rounded-md shadow-lg ${className}`}
      style={{ 
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        width: `${size}px`,
        height: `${size}px`
      }}
    />
  );
} 