'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '@/lib/virtue';
import { VirtueTotals } from '@/lib/virtue';

interface ProgressDropdownProps {
  virtueTotals: VirtueTotals;
}

const getVirtueLevel = (total: number): { level: string; color: string } => {
  if (total >= 80) return { level: 'Master', color: 'text-purple-400' };
  if (total >= 60) return { level: 'Advanced', color: 'text-blue-400' };
  if (total >= 40) return { level: 'Intermediate', color: 'text-green-400' };
  if (total >= 20) return { level: 'Beginner', color: 'text-yellow-400' };
  return { level: 'Novice', color: 'text-gray-400' };
};

export default function ProgressDropdown({ virtueTotals }: ProgressDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalProgress = Object.values(virtueTotals).reduce((sum, value) => sum + value, 0);
  const averageProgress = Math.round(totalProgress / 4);

  return (
    <div className="relative">
      {/* Progress Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-all duration-200"
      >
        <span className="font-medium">Progress</span>
        <span className="text-sm text-gray-300">({averageProgress}%)</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-300" />
        )}
      </button>

      {/* Dropdown Content */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Virtue Progress</h3>
            
            <div className="space-y-3">
              {Object.entries(virtueTotals).map(([virtue, total]) => {
                const { level, color } = getVirtueLevel(total);
                const percentage = Math.min(100, (total / 100) * 100);
                
                return (
                  <div key={virtue} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getVirtueEmoji(virtue as keyof VirtueTotals)}</span>
                        <span className={`font-medium ${getVirtueColor(virtue as keyof VirtueTotals)}`}>
                          {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${color}`}>{level}</div>
                        <div className="text-xs text-gray-400">{total} XP</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getVirtueGradient(virtue as keyof VirtueTotals)} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    {/* Percentage */}
                    <div className="text-xs text-gray-400 text-right">
                      {Math.round(percentage)}% complete
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Progress */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Total Progress</span>
                <span className="text-sm font-medium text-blue-400">{averageProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 