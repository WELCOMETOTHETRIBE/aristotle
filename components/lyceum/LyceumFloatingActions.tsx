'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Calendar,
  BookOpen,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LyceumDailyCheckin from './LyceumDailyCheckin';
import LyceumGlossary from './LyceumGlossary';

export default function LyceumFloatingActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDailyCheckin, setShowDailyCheckin] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const actions = [
    {
      icon: Calendar,
      label: 'Daily Check-in',
      onClick: () => {
        setShowDailyCheckin(true);
        setIsExpanded(false);
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: BookOpen,
      label: 'Glossary',
      onClick: () => {
        setShowGlossary(true);
        setIsExpanded(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className="flex flex-col items-end space-y-3">
          {/* Action Buttons */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="flex flex-col space-y-3"
              >
                {actions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={action.onClick}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105',
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105',
              isExpanded && 'bg-red-500 hover:bg-red-600'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <LyceumDailyCheckin 
        isOpen={showDailyCheckin}
        onClose={() => setShowDailyCheckin(false)}
      />
      
      <LyceumGlossary 
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
      />
    </>
  );
}
