"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface VirtueData {
  virtue: string;
  score: number;
}

interface VirtueRadarProps {
  data: VirtueData[];
}

export default function VirtueRadar({ data }: VirtueRadarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis 
            dataKey="virtue" 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
            fontWeight={500}
          />
          <Radar 
            dataKey="score" 
            stroke="#7ad7ff" 
            fill="#7ad7ff" 
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
} 