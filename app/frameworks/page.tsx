'use client';

import { useState } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { Search, BookOpen, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Framework {
  id: string;
  slug: string;
  name: string;
  description: string;
  timeToLearn: string;
  virtueTags: string[];
  tone: string;
}

const frameworks: Framework[] = [
  {
    id: '1',
    slug: 'stoicism',
    name: 'Stoicism',
    description: 'Master the art of living through reason and virtue',
    timeToLearn: '2-3 weeks',
    virtueTags: ['wisdom', 'courage', 'temperance'],
    tone: 'stoic',
  },
  {
    id: '2',
    slug: 'buddhism',
    name: 'Buddhism',
    description: 'Find peace through mindfulness and compassion',
    timeToLearn: '3-4 weeks',
    virtueTags: ['wisdom', 'temperance', 'justice'],
    tone: 'buddhist',
  },
  {
    id: '3',
    slug: 'aristotelian',
    name: 'Aristotelian Ethics',
    description: 'Cultivate excellence through virtuous habits',
    timeToLearn: '4-5 weeks',
    virtueTags: ['wisdom', 'justice', 'courage'],
    tone: 'aristotelian',
  },
  {
    id: '4',
    slug: 'confucianism',
    name: 'Confucianism',
    description: 'Build harmonious relationships and moral character',
    timeToLearn: '3-4 weeks',
    virtueTags: ['justice', 'temperance', 'wisdom'],
    tone: 'confucian',
  },
];

const virtueColors = {
  wisdom: 'bg-primary/20 text-primary border-primary/30',
  courage: 'bg-courage/20 text-courage border-courage/30',
  justice: 'bg-justice/20 text-justice border-justice/30',
  temperance: 'bg-temperance/20 text-temperance border-temperance/30',
};

export default function FrameworksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVirtue = !selectedVirtue || framework.virtueTags.includes(selectedVirtue);
    return matchesSearch && matchesVirtue;
  });

  const virtues = ['wisdom', 'courage', 'justice', 'temperance'];

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Frameworks</h1>
          <p className="text-muted">Choose your path to flourishing</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Virtue Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVirtue(null)}
              className={cn(
                'px-3 py-1 rounded-full border text-sm font-medium transition-colors duration-150',
                !selectedVirtue
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-surface-2 border-border text-muted hover:text-text'
              )}
            >
              All
            </button>
            {virtues.map((virtue) => (
              <button
                key={virtue}
                onClick={() => setSelectedVirtue(selectedVirtue === virtue ? null : virtue)}
                className={cn(
                  'px-3 py-1 rounded-full border text-sm font-medium transition-colors duration-150',
                  selectedVirtue === virtue
                    ? virtueColors[virtue as keyof typeof virtueColors]
                    : 'bg-surface-2 border-border text-muted hover:text-text'
                )}
              >
                {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Frameworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFrameworks.map((framework) => (
            <div
              key={framework.id}
              className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text">{framework.name}</h3>
                    <p className="text-xs text-muted">{framework.tone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted">
                  <Clock className="w-3 h-3" />
                  <span>{framework.timeToLearn}</span>
                </div>
              </div>

              <p className="text-sm text-muted mb-3 line-clamp-2">
                {framework.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {framework.virtueTags.map((virtue) => (
                  <span
                    key={virtue}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium border',
                      virtueColors[virtue as keyof typeof virtueColors]
                    )}
                  >
                    {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                  </span>
                ))}
              </div>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-150">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Explore</span>
              </button>
            </div>
          ))}
        </div>

        {filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No frameworks found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <GuideFAB />
      <TabBar />
    </div>
  );
} 