"use client";

import Image from 'next/image';

interface AcademyLogoProps {
  className?: string;
  size?: number;
}

export default function AcademyLogo({ className = "", size = 96 }: AcademyLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/academy_logo_r2.png"
        alt="Academy Logo"
        width={size}
        height={size}
        className="object-contain"
        style={{ 
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}
        priority
        onError={(e) => {
          console.error('Logo failed to load from /images/, trying root path...');
          const target = e.target as HTMLImageElement;
          target.src = '/academy_logo_r2.png';
        }}
      />
    </div>
  );
} 