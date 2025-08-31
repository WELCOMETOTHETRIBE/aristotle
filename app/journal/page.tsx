'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Heart, Brain, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  type: 'gratitude' | 'reflection' | 'insight';
  date: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', type: 'reflection' as const });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      type: newEntry.type,
      date: new Date().toISOString(),
    };
    
    saveEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', type: 'reflection' });
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(entry => entry.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'reflection': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'insight': return <BookOpen className="w-5 h-5 text-purple-400" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'border-pink-500/20 bg-pink-500/5';
      case 'reflection': return 'border-blue-500/20 bg-blue-500/5';
      case 'insight': return 'border-purple-500/20 bg-purple-500/5';
      default: return 'border-gray-500/20 bg-gray-500/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4 font-display">
                Journal
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Reflect, grow, and capture your insights
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{entries.length}</div>
                <div className="text-gray-300">Total Entries</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {entries.filter(e => e.type === 'gratitude').length}
                </div>
                <div className="text-gray-300">Gratitude</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {entries.filter(e => e.type === 'reflection').length}
                </div>
                <div className="text-gray-300">Reflections</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {entries.filter(e => e.type === 'insight').length}
                </div>
                <div className="text-gray-300">Insights</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Entry Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </motion.div>

          {/* Add Entry Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">New Journal Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="Entry title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="gratitude">Gratitude</option>
                    <option value="reflection">Reflection</option>
                    <option value="insight">Insight</option>
                  </select>
                  <textarea
                    placeholder="Write your thoughts..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addEntry} className="bg-green-600 hover:bg-green-700">
                      Save Entry
                    </Button>
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Entries List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {entries.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
                  <p className="text-gray-400">Start your journaling journey by creating your first entry</p>
                </CardContent>
              </Card>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className={`backdrop-blur-sm border ${getTypeColor(entry.type)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(entry.type)}
                        <CardTitle className="text-white">{entry.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 