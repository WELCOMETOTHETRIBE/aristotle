"use client";
import { motion } from "framer-motion";

interface RadialMeterProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function RadialMeter({ 
  value, 
  label, 
  size = 110, 
  strokeWidth = 8,
  color = "#7ad7ff"
}: RadialMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value));
  const strokeDashoffset = (1 - pct) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ 
              transform: "rotate(-90deg)", 
              transformOrigin: `${size / 2}px ${size / 2}px` 
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">
              {Math.round(value * 100)}%
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </div>
  );
} 