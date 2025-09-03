'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Heart, Brain, Calendar, Smile, MessageSquare, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JournalEntry {
  id: string;
  content: string;
  type: 'gratitude' | 'reflection' | 'voice_note' | 'boundaries' | 'community_connections' | 'mood';
  category?: string;
  date: string;
  aiInsights?: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [favoriteQuotes, setFavoriteQuotes] = useState<any[]>([]);

  useEffect(() => {
    fetchJournalEntries();
    loadFavoriteQuotes();
  }, []);

  const loadFavoriteQuotes = () => {
    if (typeof window === 'undefined') return;
    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
    setFavoriteQuotes(favorites);
  };

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      } else {
        setError('Failed to fetch journal entries');
      }
    } catch (err) {
      setError('Error fetching journal entries');
      console.error('Error fetching journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'reflection': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'voice_note': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'boundaries': return <Shield className="w-5 h-5 text-orange-400" />;
      case 'community_connections': return <Users className="w-5 h-5 text-purple-400" />;
      case 'mood': return <Smile className="w-5 h-5 text-yellow-400" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'border-pink-500/20 bg-pink-500/5';
      case 'reflection': return 'border-blue-500/20 bg-blue-500/5';
      case 'voice_note': return 'border-green-500/20 bg-green-500/5';
      case 'boundaries': return 'border-orange-500/20 bg-orange-500/5';
      case 'community_connections': return 'border-purple-500/20 bg-purple-500/5';
      case 'mood': return 'border-yellow-500/20 bg-yellow-500/5';
      default: return 'border-gray-500/20 bg-gray-500/5';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return 'Gratitude';
      case 'reflection': return 'Reflection';
      case 'voice_note': return 'Voice Note';
      case 'boundaries': return 'Boundaries';
      case 'community_connections': return 'Community';
      case 'mood': return 'Mood';
      default: return type;
    }
  };

  const filteredEntries = filterType === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === filterType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading journal entries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }

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
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          >
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
                  {entries.filter(e => e.type === 'mood').length}
                </div>
                <div className="text-gray-300">Mood</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {favoriteQuotes.length}
                </div>
                <div className="text-gray-300">Favorite Quotes</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {entries.length}
                </div>
                <div className="text-gray-300">Total</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => setFilterType('all')}
                variant={filterType === 'all' ? 'default' : 'outline'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                All Entries
              </Button>
              <Button
                onClick={() => setFilterType('mood')}
                variant={filterType === 'mood' ? 'default' : 'outline'}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Mood
              </Button>
              <Button
                onClick={() => setFilterType('reflection')}
                variant={filterType === 'reflection' ? 'default' : 'outline'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Reflections
              </Button>
              <Button
                onClick={() => setFilterType('gratitude')}
                variant={filterType === 'gratitude' ? 'default' : 'outline'}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Gratitude
              </Button>
              <Button
                onClick={() => setFilterType('favorite_quotes')}
                variant={filterType === 'favorite_quotes' ? 'default' : 'outline'}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Favorite Quotes ({favoriteQuotes.length})
              </Button>
            </div>
          </motion.div>

          {/* Entries List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {filterType === 'favorite_quotes' ? (
              // Display favorite quotes
              favoriteQuotes.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No favorite quotes yet
                    </h3>
                    <p className="text-gray-400">
                      Start favoriting quotes from the Daily Wisdom widget to see them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                favoriteQuotes.map((quote, index) => (
                  <Card key={index} className="backdrop-blur-sm border border-purple-500/20 bg-purple-500/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-purple-400" />
                          <div>
                            <CardTitle className="text-white">Favorite Quote</CardTitle>
                            <p className="text-sm text-gray-400">{quote.framework} Tradition</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(quote.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <blockquote className="text-gray-300 italic text-lg mb-4 border-l-4 border-purple-400 pl-4">
                        "{quote.quote}"
                      </blockquote>
                      <p className="text-purple-300 font-medium">— {quote.author}</p>
                    </CardContent>
                  </Card>
                ))
              )
            ) : filteredEntries.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {filterType === 'all' ? 'No entries yet' : `No ${filterType} entries`}
                  </h3>
                  <p className="text-gray-400">
                    {filterType === 'all' 
                      ? 'Start your journaling journey by creating your first entry' 
                      : `No ${filterType} entries found. Try a different filter or create a new entry.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className={`backdrop-blur-sm border ${getTypeColor(entry.type)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(entry.type)}
                        <div>
                          <CardTitle className="text-white">{getTypeLabel(entry.type)}</CardTitle>
                          {entry.category && (
                            <p className="text-sm text-gray-400">{entry.category}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap mb-4">{entry.content}</p>
                    {entry.aiInsights && (
                      <div className="bg-white/5 p-3 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-200 italic">💡 {entry.aiInsights}</p>
                      </div>
                    )}
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