import React from 'react';

interface GraduationCapIconProps {
  className?: string;
  size?: number;
}

export default function GraduationCapIcon({ className = '', size = 24 }: GraduationCapIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{
        filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
      }}
    >
      {/* Graduation Cap */}
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cap Base */}
      <path
        d="M2 7V17C2 17.5523 2.44772 18 3 18H21C21.5523 18 22 17.5523 22 17V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tassel */}
      <path
        d="M12 12V18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18C12 18 10 20 8 20C6 20 4 18 4 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circle outline */}
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
} 