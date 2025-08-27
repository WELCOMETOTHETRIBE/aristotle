"use client";
import { motion } from "framer-motion";

interface SunPathProps {
  currentTime?: Date;
  sleepGoal?: { start: string; end: string };
}

export default function SunPath({ 
  currentTime = new Date(),
  sleepGoal = { start: "22:00", end: "06:00" }
}: SunPathProps) {
  const getTimeProgress = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes / (24 * 60); // 0 to 1 over 24 hours
  };

  const getSleepProgress = () => {
    const [startHour, startMin] = sleepGoal.start.split(':').map(Number);
    const [endHour, endMin] = sleepGoal.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return {
      start: startMinutes / (24 * 60),
      end: endMinutes / (24 * 60)
    };
  };

  const timeProgress = getTimeProgress();
  const sleepProgress = getSleepProgress();
  
  // Convert progress to angle (0-360 degrees)
  const currentAngle = timeProgress * 360;
  const sleepStartAngle = sleepProgress.start * 360;
  const sleepEndAngle = sleepProgress.end * 360;

  return (
    <div className="relative w-full h-32">
      <svg width="100%" height="100%" viewBox="0 0 200 80">
        {/* Background arc */}
        <path
          d="M 20 60 A 80 80 0 0 1 180 60"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="4"
          fill="none"
        />
        
        {/* Sleep period arc */}
        <path
          d={`M 20 60 A 80 80 0 0 1 180 60`}
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${sleepEndAngle - sleepStartAngle} 360`}
          strokeDashoffset={sleepStartAngle}
        />
        
        {/* Current time indicator */}
        <motion.circle
          cx={20 + 160 * Math.cos((currentAngle - 90) * Math.PI / 180)}
          cy={60 - 80 * Math.sin((currentAngle - 90) * Math.PI / 180)}
          r="4"
          fill="#7ad7ff"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        
        {/* Sleep goal indicators */}
        <circle
          cx={20 + 160 * Math.cos((sleepStartAngle - 90) * Math.PI / 180)}
          cy={60 - 80 * Math.sin((sleepStartAngle - 90) * Math.PI / 180)}
          r="3"
          fill="#a78bfa"
          opacity={0.6}
        />
        <circle
          cx={20 + 160 * Math.cos((sleepEndAngle - 90) * Math.PI / 180)}
          cy={60 - 80 * Math.sin((sleepEndAngle - 90) * Math.PI / 180)}
          r="3"
          fill="#a78bfa"
          opacity={0.6}
        />
        
        {/* Time labels */}
        <text x="10" y="75" fill="rgba(255,255,255,0.6)" fontSize="8">6AM</text>
        <text x="95" y="20" fill="rgba(255,255,255,0.6)" fontSize="8">12PM</text>
        <text x="180" y="75" fill="rgba(255,255,255,0.6)" fontSize="8">6PM</text>
      </svg>
      
      {/* Current time display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-medium text-white">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-xs text-muted mt-1">
          {getTimeOfDay(currentTime)}
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour < 6) return "Night";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  if (hour < 22) return "Evening";
  return "Night";
} 