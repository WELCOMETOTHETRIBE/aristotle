'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, CheckCircle, Clock, TrendingUp, Heart, Brain, Calendar, Droplets, 
  Smile, Zap, Trophy, Info, BookOpen, Timer, Hash, Camera, Mic, CheckSquare, 
  FileText, Sliders, RotateCcw, Users, Star, Leaf, Shield, Scale, Plus, X,
  Search, Filter
} from 'lucide-react';

interface WidgetInfo {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  color: string;
  isActive?: boolean;
}

interface WidgetGalleryProps {
  availableWidgets: WidgetInfo[];
  activeWidgets: string[];
  onAddWidget: (widgetId: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onClose: () => void;
}

const categories = [
  { id: 'core', name: 'Core', color: 'bg-blue-500' },
  { id: 'practice', name: 'Practice', color: 'bg-green-500' },
  { id: 'wellness', name: 'Wellness', color: 'bg-purple-500' },
  { id: 'community', name: 'Community', color: 'bg-orange-500' },
];

export default function WidgetGallery({ 
  availableWidgets, 
  activeWidgets, 
  onAddWidget, 
  onRemoveWidget, 
  onClose 
}: WidgetGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Debug: Log what widgets are being received
  console.log('WidgetGallery received:', {
    totalWidgets: availableWidgets.length,
    practiceWidgets: availableWidgets.filter(w => w.category === 'practice').length,
    balanceWidget: availableWidgets.find(w => w.id === 'balance_gyro'),
    allWidgets: availableWidgets.map(w => ({ id: w.id, title: w.title, category: w.category }))
  });

  const filteredWidgets = availableWidgets.filter(widget => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Debug: Log filtering results
  console.log('Filtering results:', {
    selectedCategory,
    searchQuery,
    totalFiltered: filteredWidgets.length,
    practiceFiltered: filteredWidgets.filter(w => w.category === 'practice').length,
    balanceFiltered: filteredWidgets.find(w => w.id === 'balance_gyro')
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[rgb(var(--surface))] rounded-2xl shadow-pop max-w-5xl w-full max-h-[90vh] overflow-hidden border border-[rgb(var(--border))]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
          <div>
            <h2 className="text-3xl font-bold font-display text-[rgb(var(--text))]">
              Widget Gallery
            </h2>
            <p className="text-[rgb(var(--muted))] mt-1">
              Customize your dashboard by adding or removing widgets
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-[rgb(var(--surface))] rounded-full p-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[rgb(var(--muted))]" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[rgb(var(--border))] rounded-xl bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] placeholder-[rgb(var(--muted))] focus:ring-2 focus:ring-[rgb(var(--ring))] focus:border-transparent transition duration-fast ease-soft"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="rounded-xl px-4 py-2"
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-xl px-4 py-2"
                >
                  <div className={`w-2 h-2 rounded-full ${category.color} mr-2`} />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Debug Display */}
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg mx-6 mb-4">
          <h3 className="font-bold text-yellow-800 mb-2">🔍 DEBUG INFO</h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <div>Total Widgets: {availableWidgets.length}</div>
            <div>Practice Widgets: {availableWidgets.filter(w => w.category === 'practice').length}</div>
            <div>Balance Widget Found: {availableWidgets.find(w => w.id === 'balance_gyro') ? 'YES' : 'NO'}</div>
            <div>Selected Category: {selectedCategory}</div>
            <div>Search Query: {searchQuery}</div>
            <div>Filtered Count: {filteredWidgets.length}</div>
            <div>Balance in Filtered: {filteredWidgets.find(w => w.id === 'balance_gyro') ? 'YES' : 'NO'}</div>
          </div>
        </div>

        {/* Widget Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-[rgb(var(--bg))]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWidgets.map((widget) => {
              const isActive = activeWidgets.includes(widget.id);
              const IconComponent = widget.icon;
              
              return (
                <Card 
                  key={widget.id} 
                  className={`relative transition-all duration-300 hover:shadow-pop hover:scale-[1.02] ${
                    isActive 
                      ? 'ring-2 ring-[rgb(var(--justice))] bg-[rgb(var(--surface-2))] shadow-card' 
                      : 'bg-[rgb(var(--surface))] hover:bg-[rgb(var(--surface-2))] shadow-card'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${widget.color} bg-opacity-10 shadow-sm`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-[rgb(var(--text))]">{widget.title}</CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`mt-2 ${getCategoryColor(widget.category).replace('bg-', 'bg-').replace('500', '100')} text-xs font-medium`}
                          >
                            {categories.find(c => c.id === widget.category)?.name}
                          </Badge>
                        </div>
                      </div>
                      {isActive && (
                        <div className="flex items-center gap-1 text-[rgb(var(--justice))] bg-[rgb(var(--justice)/0.1)] px-2 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Active</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-4 leading-relaxed text-[rgb(var(--muted))]">
                      {widget.description}
                    </CardDescription>
                    
                    <Button
                      variant={isActive ? 'destructive' : 'default'}
                      size="sm"
                      className="w-full rounded-xl font-medium transition duration-fast ease-snap hover:scale-105"
                      onClick={() => isActive ? onRemoveWidget(widget.id) : onAddWidget(widget.id)}
                    >
                      {isActive ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Remove Widget
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Widget
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-sm mx-auto">
                <Search className="h-16 w-16 text-[rgb(var(--muted))] mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold text-[rgb(var(--text))] mb-3">
                  No widgets found
                </h3>
                <p className="text-[rgb(var(--muted))] leading-relaxed">
                  Try adjusting your search terms or category filters to find the widgets you're looking for
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[rgb(var(--muted))]">
              <span className="font-medium text-[rgb(var(--text))]">{activeWidgets.length}</span> of <span className="font-medium">{availableWidgets.length}</span> widgets active
            </div>
            <Button 
              onClick={onClose}
              className="rounded-xl px-6 py-2 font-medium bg-[rgb(var(--wisdom))] text-black hover:brightness-110 transition duration-fast ease-snap"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 