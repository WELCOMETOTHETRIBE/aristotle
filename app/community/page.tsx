'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Share2, Brain, BookOpen, Search, Filter, Send, ThumbsUp,
  MessageSquare, Eye, Clock, Star, User, Reply, MoreHorizontal, Bookmark, BookmarkCheck, 
  Loader2, AlertCircle, X, Plus, Users, Sparkles, ChevronRight
} from 'lucide-react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { GuideFAB } from '@/components/ai/GuideFAB';
import { useAuth } from '@/lib/auth-context';

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
  type: 'user' | 'ai' | 'nature_photo';
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
  imagePath?: string;
  aiComment?: string;
}

export default function CommunityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | 'ai'>('all');
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
  
  // AI Thread generation
  const [generatingAIThread, setGeneratingAIThread] = useState(false);

  const categories = ['all', 'Stoicism', 'Aristotelian Ethics', 'Courage', 'Wisdom', 'Justice', 'Temperance', 'Nature Logs'];

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community');
      
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      
      const data = await response.json();
      console.log('🔍 Fetched threads:', data);
      
      // Transform the data to match our Thread interface
      const transformedThreads = data.map((thread: any) => ({
        id: thread.id,
        title: thread.title,
        content: thread.content,
        author: {
          name: thread.author?.displayName || thread.author?.username || 'Demo User',
          avatar: thread.author?.isAI ? '🧠' : '👤',
          isAI: thread.isAIQuestion || false,
          persona: thread.author?.isAI ? thread.author?.displayName : undefined,
        },
        type: thread.isAIQuestion ? 'ai' : 'user',
        category: thread.category || 'General',
        tags: thread.tags || [],
        replies: thread.replies?.length || 0,
        views: thread.views || 0,
        likes: thread.likes || 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: thread.createdAt,
        lastActivity: thread.updatedAt || thread.createdAt,
        imagePath: thread.imagePath,
        aiComment: thread.aiComment,
      }));
      
      setThreads(transformedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to load community threads');
    } finally {
      setLoading(false);
    }
  };

  const createThread = async () => {
    if (!newThread.title.trim() || !newThread.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreatingThread(true);
      setError(null);
      
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newThread.title,
          content: newThread.content,
          category: newThread.category,
          tags: newThread.tags,
        }),
      });

      if (response.ok) {
        const newThreadData = await response.json();
        
        // Add the new thread to the list
        const thread: Thread = {
          id: newThreadData.id,
          title: newThreadData.title,
          content: newThreadData.content,
          author: {
            name: user?.displayName || user?.username || 'You',
            avatar: '👤',
            isAI: false,
          },
          type: 'user',
          category: newThreadData.category,
          tags: newThreadData.tags,
          replies: 0,
          views: 0,
          likes: 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: newThreadData.createdAt,
          lastActivity: newThreadData.createdAt,
        };

        setThreads(prev => [thread, ...prev]);
        setNewThread({ title: '', content: '', category: 'Stoicism', tags: [] });
        setShowCreateThread(false);
        setError('Thread created successfully!');
        
        // Show success message
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        throw new Error('Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create thread');
    } finally {
      setCreatingThread(false);
    }
  };

  const generateDailyAIThread = async () => {
    try {
      setGeneratingAIThread(true);
      setError(null);
      
      console.log('🔍 Generating AI thread...');
      
      const response = await fetch('/api/community/ai-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force: true // Allow generation even if one exists today
        }),
      });

      console.log('�� AI thread response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ AI thread generation failed:', errorData);
        throw new Error(errorData.error || 'Failed to generate AI thread');
      }

      const aiThreadData = await response.json();
      console.log('🔍 AI thread data:', aiThreadData);
      
      if (aiThreadData.success && aiThreadData.thread) {
        const newAIThread: Thread = {
          id: aiThreadData.thread.id,
          title: aiThreadData.thread.title,
          content: aiThreadData.thread.content,
          author: {
            name: aiThreadData.thread.author.name,
            avatar: aiThreadData.thread.author.avatar,
            isAI: true,
            persona: aiThreadData.thread.author.persona,
          },
          type: 'ai',
          category: aiThreadData.thread.category,
          tags: aiThreadData.thread.tags,
          replies: aiThreadData.thread.replies || 0,
          views: aiThreadData.thread.views || 0,
          likes: aiThreadData.thread.likes || 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: aiThreadData.thread.createdAt,
          lastActivity: aiThreadData.thread.createdAt,
        };

        setThreads(prev => [newAIThread, ...prev]);
        setError('AI philosopher thread created successfully!');
        
        // Show success message
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        throw new Error('Invalid response from AI thread generation');
      }
    } catch (error) {
      console.error('Error generating AI thread:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate AI thread');
    } finally {
      setGeneratingAIThread(false);
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'ai' && thread.type === 'ai') ||
      (activeFilter === 'user' && thread.type === 'user');
    
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    
    const matchesSearch = searchQuery === '' || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-20">
        <Header />
        <main className="px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-text">Loading community...</span>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Community</h1>
          <p className="text-muted">Share wisdom, ask questions, and grow together</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'user', 'ai'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as 'all' | 'user' | 'ai')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-muted hover:bg-surface-3'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'ai' ? 'AI Philosophers' : 'Community'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-surface-2 text-muted hover:bg-surface-3'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowCreateThread(true)}
            className="flex-1 sm:flex-none px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Start Discussion
          </button>
          <button
            onClick={generateDailyAIThread}
            disabled={generatingAIThread}
            className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-primary border border-primary/30 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generatingAIThread ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                AI Philosopher Thread
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center gap-2 ${
              error.includes('successfully') 
                ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
                : 'bg-error/10 text-error border border-error/30'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Threads List */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No discussions found</h3>
              <p className="text-muted">
                {searchQuery || selectedCategory !== 'all' || activeFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Be the first to start a discussion!'}
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/community/${thread.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      thread.author.isAI 
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10' 
                        : 'bg-surface-2'
                    }`}>
                      {thread.author.avatar}
                    </div>
                  </div>

                  {/* Thread Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text truncate">{thread.title}</h3>
                      {thread.author.isAI && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          AI Philosopher
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted text-sm line-clamp-2 mb-3">
                      {thread.content}
                    </p>

                    {/* Thread Meta */}
                    <div className="flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {thread.author.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {thread.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {thread.views}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tags */}
                    {thread.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {thread.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Create Thread Modal */}
      <AnimatePresence>
        {showCreateThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Start a Discussion</h2>
                <button
                  onClick={() => setShowCreateThread(false)}
                  className="text-muted hover:text-text transition-colors"
                >
                  <X className="w-6 h-6" />
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
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="What's on your mind?"
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category
                  </label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.filter(cat => cat !== 'all').map((category) => (
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
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or insights..."
                    rows={4}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateThread(false)}
                    className="flex-1 px-4 py-2 bg-surface-2 text-text rounded-lg hover:bg-surface-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createThread}
                    disabled={creatingThread || !newThread.title.trim() || !newThread.content.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {creatingThread ? 'Creating...' : 'Create Thread'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <GuideFAB />
      <TabBar />
    </div>
  );
}
