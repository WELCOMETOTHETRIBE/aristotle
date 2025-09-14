'use client';

import React, { useState, useMemo } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumGlossaryTerm } from '@/lib/lyceum-data';

export default function LyceumGlossary() {
  const { lyceumData } = useLyceum();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<LyceumGlossaryTerm | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'category' | 'path'>('alphabetical');

  const glossary = lyceumData?.glossary || [];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(glossary.map(term => term.category));
    return Array.from(cats).sort();
  }, [glossary]);

  // Get unique paths
  const paths = useMemo(() => {
    const pathIds = new Set(glossary.map(term => term.pathId));
    return Array.from(pathIds).sort();
  }, [glossary]);

  // Filter and sort terms
  const filteredTerms = useMemo(() => {
    let filtered = glossary.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort terms
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.term.localeCompare(b.term));
        break;
      case 'category':
        filtered.sort((a, b) => {
          const categoryCompare = a.category.localeCompare(b.category);
          if (categoryCompare !== 0) return categoryCompare;
          return a.term.localeCompare(b.term);
        });
        break;
      case 'path':
        filtered.sort((a, b) => {
          const pathCompare = a.pathId.localeCompare(b.pathId);
          if (pathCompare !== 0) return pathCompare;
          return a.term.localeCompare(b.term);
        });
        break;
    }

    return filtered;
  }, [glossary, searchTerm, selectedCategory, sortBy]);

  const getPathTitle = (pathId: string) => {
    const path = lyceumData?.paths.find(p => p.id === pathId);
    return path?.title || 'Unknown Path';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Core Concepts': 'bg-blue-100 text-blue-700',
      'Virtues': 'bg-green-100 text-green-700',
      'Ethics': 'bg-purple-100 text-purple-700',
      'Logic': 'bg-orange-100 text-orange-700',
      'Metaphysics': 'bg-indigo-100 text-indigo-700',
      'Politics': 'bg-red-100 text-red-700',
      'Rhetoric': 'bg-pink-100 text-pink-700',
      'Poetics': 'bg-yellow-100 text-yellow-700',
      'Physics': 'bg-teal-100 text-teal-700',
      'Biology': 'bg-emerald-100 text-emerald-700',
      'Psychology': 'bg-cyan-100 text-cyan-700',
      'Education': 'bg-amber-100 text-amber-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lyceum Glossary</h1>
        <p className="text-gray-600">
          Comprehensive definitions of philosophical terms and concepts from your journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'category' | 'path')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="category">Category</option>
              <option value="path">Path</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTerms.length} of {glossary.length} terms
        </p>
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No terms found</div>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTerm(term)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{term.term}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                  {term.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {term.definition}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Path: {getPathTitle(term.pathId)}</span>
                {term.etymology && (
                  <span className="italic">Etymology available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTerm.term}
                </h2>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedTerm.category)}`}>
                  {selectedTerm.category}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  From: {getPathTitle(selectedTerm.pathId)}
                </span>
              </div>

              <div className="prose max-w-none">
                <h3 className="font-semibold text-gray-900 mb-2">Definition</h3>
                <p className="text-gray-700 mb-4">{selectedTerm.definition}</p>

                {selectedTerm.etymology && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Etymology</h3>
                    <p className="text-gray-700 italic">{selectedTerm.etymology}</p>
                  </div>
                )}

                {selectedTerm.examples && selectedTerm.examples.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Examples</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedTerm.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Related Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((relatedTerm, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            const term = glossary.find(t => t.term === relatedTerm);
                            if (term) setSelectedTerm(term);
                          }}
                        >
                          {relatedTerm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTerm.notes && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-700">{selectedTerm.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}