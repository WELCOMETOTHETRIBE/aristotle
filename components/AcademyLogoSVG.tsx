"use client";

interface AcademyLogoSVGProps {
  className?: string;
  size?: number;
}

export default function AcademyLogoSVG({ className = "", size = 96 }: AcademyLogoSVGProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 96 96" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
          <stop offset="50%" style={{ stopColor: '#8B5CF6' }} />
          <stop offset="100%" style={{ stopColor: '#6366F1' }} />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle 
        cx="48" 
        cy="48" 
        r="44" 
        fill="url(#logoGradient)" 
        stroke="white" 
        strokeWidth="2"
      />
      
      {/* Graduation cap */}
      <path 
        d="M48 20L20 36L48 52L76 36L48 20Z" 
        fill="white"
      />
      <path 
        d="M20 36V60C20 61.1046 20.8954 62 22 62H74C75.1046 62 76 61.1046 76 60V36" 
        stroke="white" 
        strokeWidth="2"
      />
      <path 
        d="M48 52V62" 
        stroke="white" 
        strokeWidth="2"
      />
      <path 
        d="M48 62C48 62 46 64 44 64C42 64 40 62 40 62" 
        stroke="white" 
        strokeWidth="2"
      />
      
      {/* Decorative elements */}
      <circle 
        cx="48" 
        cy="48" 
        r="2" 
        fill="white" 
        opacity="0.8"
      />
    </svg>
  );
} 