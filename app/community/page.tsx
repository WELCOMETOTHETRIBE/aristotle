'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Share2, Brain, BookOpen, Search, Filter, Send, ThumbsUp,
  MessageSquare, Eye, Clock, Star, User, Reply, MoreHorizontal, Bookmark, BookmarkCheck, 
  Loader2, AlertCircle, X, Plus, Users, Sparkles
} from 'lucide-react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';

interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isAI: boolean;
    persona?: string;
  };
  type: 'user' | 'ai';
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  aiInsights?: string[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isAI: boolean;
    persona?: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
  parentId?: string;
}

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | 'ai'>('all');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingThread, setCreatingThread] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'Stoicism',
    tags: [] as string[],
  });

  const categories = ['all', 'Stoicism', 'Aristotelian Ethics', 'Courage', 'Wisdom', 'Justice', 'Temperance'];

  // Mock data for demonstration
  useEffect(() => {
    const mockThreads: Thread[] = [
      {
        id: '1',
        title: 'How do I practice courage in daily life?',
        content: 'I find myself avoiding difficult conversations and uncomfortable situations. What are some practical ways to build courage through small daily actions?',
        author: {
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          isAI: false,
        },
        type: 'user',
        category: 'Courage',
        tags: ['courage', 'daily-practice', 'conversations'],
        replies: 8,
        views: 124,
        likes: 23,
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-15T10:30:00Z',
        lastActivity: '2024-01-15T14:20:00Z',
      },
      {
        id: '2',
        title: 'The Stoic approach to dealing with uncertainty',
        content: 'In times of uncertainty, Stoicism teaches us to focus on what we can control. Here are three practical exercises to help you navigate uncertainty with wisdom...',
        author: {
          name: 'Marcus Aurelius',
          avatar: '/avatars/marcus.jpg',
          isAI: true,
          persona: 'Stoic Philosopher',
        },
        type: 'ai',
        category: 'Wisdom',
        tags: ['stoicism', 'uncertainty', 'control'],
        replies: 12,
        views: 89,
        likes: 31,
        isLiked: true,
        isBookmarked: false,
        createdAt: '2024-01-15T09:15:00Z',
        lastActivity: '2024-01-15T16:45:00Z',
        aiInsights: [
          'Focus on what you can control',
          'Practice negative visualization',
          'Embrace the present moment'
        ],
      },
      {
        id: '3',
        title: 'Building sustainable habits for justice',
        content: 'Justice isn\'t just about big actions - it\'s about the small choices we make every day. How do you practice fairness and service in your daily routine?',
        author: {
          name: 'Alex Rodriguez',
          avatar: '/avatars/alex.jpg',
          isAI: false,
        },
        type: 'user',
        category: 'Justice',
        tags: ['justice', 'habits', 'daily-routine'],
        replies: 5,
        views: 67,
        likes: 18,
        isLiked: false,
        isBookmarked: true,
        createdAt: '2024-01-15T08:45:00Z',
        lastActivity: '2024-01-15T12:30:00Z',
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setThreads(mockThreads);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleLike = async (threadId: string) => {
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, isLiked: !thread.isLiked, likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1 }
          : thread
      )
    );
  };

  const toggleBookmark = async (threadId: string) => {
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, isBookmarked: !thread.isBookmarked }
          : thread
      )
    );
  };

  const createThread = async () => {
    if (!newThread.title || !newThread.content || !newThread.category) {
      return;
    }

    try {
      setCreatingThread(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newThreadData: Thread = {
        id: Date.now().toString(),
        title: newThread.title,
        content: newThread.content,
        author: {
          name: 'You',
          avatar: '/avatars/user.jpg',
          isAI: false,
        },
        type: 'user',
        category: newThread.category,
        tags: newThread.tags,
        replies: 0,
        views: 0,
        likes: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      setThreads(prev => [newThreadData, ...prev]);
      setShowCreateThread(false);
      setNewThread({
        title: '',
        content: '',
        category: 'Stoicism',
        tags: [],
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create thread');
    } finally {
      setCreatingThread(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredThreads = threads.filter(thread => {
    if (activeFilter === 'user' && thread.type !== 'user') return false;
    if (activeFilter === 'ai' && thread.type !== 'ai') return false;
    if (selectedCategory !== 'all' && thread.category !== selectedCategory) return false;
    if (searchQuery && !thread.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="pb-20 pt-4 px-4">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text">Community</h1>
              <p className="text-muted text-sm">Connect with fellow seekers</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder-muted"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('user')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'user'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <User className="w-3 h-3" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === 'ai'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Brain className="w-3 h-3" />
                AI
              </div>
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted">Loading threads...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
              <p className="text-muted">{error}</p>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No threads found</h3>
              <p className="text-muted">Be the first to start a discussion!</p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-xl p-4 hover:shadow-2 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedThread(thread)}
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      {thread.author.isAI ? (
                        <Brain className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text text-sm">{thread.author.name}</h3>
                        {thread.author.isAI && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{formatTimeAgo(thread.createdAt)}</span>
                        <span>•</span>
                        <span>{thread.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(thread.id);
                    }}
                    className="p-1 hover:bg-surface-2 rounded-lg transition-colors"
                  >
                    {thread.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-muted" />
                    )}
                  </button>
                </div>

                {/* Thread Content */}
                <div className="mb-3">
                  <h2 className="font-semibold text-text mb-2 line-clamp-2">
                    {thread.title}
                  </h2>
                  <p className="text-muted text-sm line-clamp-3 leading-relaxed">
                    {thread.content}
                  </p>
                </div>

                {/* AI Insights */}
                {thread.aiInsights && (
                  <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-medium text-primary text-xs mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Insights
                    </h4>
                    <ul className="space-y-1">
                      {thread.aiInsights.map((insight, idx) => (
                        <li key={idx} className="text-xs text-primary/80 flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {thread.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {thread.tags.length > 3 && (
                    <span className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full">
                      +{thread.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Thread Stats */}
                <div className="flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(thread.id);
                      }}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${
                        thread.isLiked ? 'text-primary' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{thread.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{thread.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{thread.views}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Create Thread FAB */}
      <button
        onClick={() => setShowCreateThread(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-4 flex items-center justify-center transition-all duration-200 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Thread Modal */}
      <AnimatePresence>
        {showCreateThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCreateThread(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-text">New Thread</h2>
                <button
                  onClick={() => setShowCreateThread(false)}
                  className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category
                  </label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Content
                  </label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none"
                    placeholder="Share your thoughts, questions, or insights..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateThread(false)}
                    className="px-4 py-2 text-muted hover:bg-surface-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createThread}
                    disabled={creatingThread || !newThread.title || !newThread.content}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creatingThread ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Thread
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TabBar />
      <GuideFAB />
    </div>
  );
} 