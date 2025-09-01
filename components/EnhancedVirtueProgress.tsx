'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Scale, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import VirtueRadar from '@/components/VirtueRadar';

interface VirtueScores {
  wisdom: number;
  courage: number;
  justice: number;
  temperance: number;
}

const getVirtueIcon = (virtue: string) => {
  const icons = {
    wisdom: Brain,
    courage: Shield,
    justice: Scale,
    temperance: Heart
  };
  return icons[virtue as keyof typeof icons] || Brain;
};

const getVirtueGradient = (virtue: string) => {
  const gradients = {
    wisdom: 'from-blue-500 to-indigo-600',
    courage: 'from-red-500 to-orange-600',
    justice: 'from-green-500 to-emerald-600',
    temperance: 'from-purple-500 to-pink-600'
  };
  return gradients[virtue as keyof typeof gradients] || 'from-blue-500 to-indigo-600';
};

export default function EnhancedVirtueProgress() {
  const [virtueScores, setVirtueScores] = useState<VirtueScores>({ wisdom: 0, courage: 0, justice: 0, temperance: 0 });

  useEffect(() => {
    const fetchVirtueScores = async () => {
      try {
        const response = await fetch('/api/progress/virtues');
        if (response.ok) {
          const data = await response.json();
          setVirtueScores(data.scores || { wisdom: 0, courage: 0, justice: 0, temperance: 0 });
        }
      } catch (error) {
        console.error('Error fetching virtue scores:', error);
      }
    };
    fetchVirtueScores();
  }, []);

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text">Virtue Balance</h2>
        <div className="text-xs text-muted">Last 7 days</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <div className="h-64">
            <VirtueRadar
              data={[
                { virtue: 'Wisdom', score: virtueScores.wisdom },
                { virtue: 'Courage', score: virtueScores.courage },
                { virtue: 'Justice', score: virtueScores.justice },
                { virtue: 'Temperance', score: virtueScores.temperance },
              ]}
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          {(['wisdom', 'courage', 'justice', 'temperance'] as const).map((virtueKey) => {
            const score = virtueScores[virtueKey];
            const Icon = getVirtueIcon(virtueKey);
            return (
              <motion.div
                key={virtueKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-7 h-7 rounded-md text-white flex items-center justify-center bg-gradient-to-r', getVirtueGradient(virtueKey))}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium text-text capitalize">{virtueKey}</div>
                  </div>
                  <div className="text-xs text-muted">{Math.round(score)}%</div>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <div className={cn('h-2 rounded-full bg-gradient-to-r', getVirtueGradient(virtueKey))} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 