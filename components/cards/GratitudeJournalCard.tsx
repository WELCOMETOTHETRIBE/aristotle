'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GratitudeJournalCard() {
  const [entries, setEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeJournalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gratitudeJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const prompts = [
    "What am I grateful for today?",
    "Who made a positive impact on my life?",
    "What challenge am I grateful for overcoming?",
    "What beauty did I notice today?",
    "What skill or ability am I thankful for?",
    "What moment brought me joy today?"
  ];

  const addEntry = () => {
    if (currentEntry.trim()) {
      setEntries(prev => [currentEntry.trim(), ...prev.slice(0, 4)]);
      setCurrentEntry('');
      setIsAdding(false);
    }
  };

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl bg-yellow-500/20"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-text text-lg">Gratitude Journal</h3>
            <p className="text-sm text-muted">{formatDate()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{entries.length}</div>
          <div className="text-xs text-muted">Entries</div>
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="mb-6">
        <div className="text-sm text-muted mb-2">Today's Prompt:</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {prompts.map((prompt, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedPrompt(index)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPrompt === index
                  ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                  : 'bg-surface-2 text-muted hover:text-text hover:bg-surface'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add Entry */}
      {!isAdding ? (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-border rounded-lg text-muted hover:text-text hover:border-yellow-500/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Add Gratitude Entry</span>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="text-sm text-muted mb-2">{prompts[selectedPrompt]}</div>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write your gratitude entry..."
            className="w-full p-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={addEntry}
              disabled={!currentEntry.trim()}
              className="flex-1 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Entry
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setCurrentEntry('');
              }}
              className="px-4 py-2 bg-surface-2 text-muted rounded-lg hover:text-text transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Entries List */}
      <div className="space-y-3 mt-6">
        <div className="text-sm text-muted mb-2">Recent Entries:</div>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No entries yet. Start your gratitude practice!</p>
          </div>
        ) : (
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                className="p-3 bg-surface-2 border border-yellow-500/20 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start gap-3">
                  <p className="text-text text-sm flex-1">{entry}</p>
                  <motion.button
                    onClick={() => removeEntry(index)}
                    className="text-muted hover:text-error transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Gratitude Tips */}
      <div className="mt-4 p-3 bg-surface-2 rounded-lg">
        <div className="text-xs text-muted mb-1">Practice Tip:</div>
        <div className="text-sm text-text">
          Write 3 things you're grateful for each day. This simple practice can transform your perspective and increase happiness.
        </div>
      </div>
    </div>
  );
} 