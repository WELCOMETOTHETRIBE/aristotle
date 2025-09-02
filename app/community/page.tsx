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
  aiInsights?: string[];
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
      if (response.ok) {
        const data = await response.json();
        // Map API response to Thread interface
        const mappedThreads = (data.threads || []).map((thread: any) => ({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author: {
            name: thread.author?.displayName || thread.author?.username || 'Unknown User',
            avatar: thread.author?.avatar || '/avatars/default.jpg',
            isAI: thread.isAIQuestion || false,
            persona: thread.author?.persona || undefined,
          },
          type: thread.isAIQuestion ? 'ai' : 'user',
          category: thread.category,
          tags: thread.tags || [],
          replies: thread._count?.replies || 0,
          views: thread.views || 0,
          likes: thread._count?.likes || 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: thread.createdAt,
          lastActivity: thread.updatedAt || thread.createdAt,
          isPinned: thread.isPinned || false,
          aiInsights: thread.aiInsights || [],
          imagePath: thread.imagePath || undefined,
          aiComment: thread.aiComment || undefined,
        }));
        setThreads(mappedThreads);
      } else {
        setError('Failed to load threads');
      }
    } catch (error) {
      setError('Failed to load threads');
    } finally {
      setLoading(false);
    }
  };

  const createThread = async () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return;

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
          type: 'member_discussion',
          category: newThread.category,
          tags: newThread.tags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Map the created thread to Thread interface
        const newThreadData: Thread = {
          id: data.id,
          title: data.title,
          content: data.content,
          author: {
            name: data.author?.displayName || data.author?.username || 'Unknown User',
            avatar: data.author?.avatar || '/avatars/default.jpg',
            isAI: false,
            persona: undefined,
          },
          type: 'user',
          category: data.category,
          tags: data.tags || [],
          replies: data._count?.replies || 0,
          views: data.views || 0,
          likes: data._count?.likes || 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: data.createdAt,
          lastActivity: data.updatedAt || data.createdAt,
          isPinned: false,
          aiInsights: [],
          imagePath: undefined,
          aiComment: undefined,
        };
        
        setThreads(prev => [newThreadData, ...prev]);
        setShowCreateThread(false);
        setNewThread({ title: '', content: '', category: 'Stoicism', tags: [] });
        
        // Trigger AI response after a short delay
        setTimeout(() => {
          triggerAIResponse(newThreadData);
        }, 2000);
        
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
      
      const response = await fetch('/api/community/ai-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI thread');
      }

      const aiThreadData = await response.json();
      
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
          aiInsights: [],
        };

        setThreads(prev => [newAIThread, ...prev]);
        
        // Reload page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating AI thread:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate AI thread');
    } finally {
      setGeneratingAIThread(false);
    }
  };

  const triggerAIResponse = async (userThread: Thread) => {
    try {
      const response = await fetch('/api/community/ai-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: userThread.id,
          threadTitle: userThread.title,
          threadContent: userThread.content,
          threadCategory: userThread.category,
          userComment: userThread.content, // Use the thread content as the user comment
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        console.log('AI response triggered:', aiData);
        
        // Refresh threads to show the AI response
        setTimeout(() => {
          fetchThreads();
        }, 1000);
      }
    } catch (error) {
      console.error('Error triggering AI response:', error);
    }
  };

  const filteredThreads = threads.filter(thread => {
    if (activeFilter === 'user' && thread.type !== 'user') return false;
    if (activeFilter === 'ai' && thread.type !== 'ai') return false;
    if (selectedCategory !== 'all' && thread.category !== selectedCategory) return false;
    if (searchQuery && !thread.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !thread.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const navigateToThread = (threadId: string) => {
    router.push(`/community/${threadId}`);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header />
      
      <main className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-text">Community</h1>
          <p className="text-muted">Join the philosophical discussion</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              All Threads
            </button>
            <button
              onClick={() => setActiveFilter('user')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'user'
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              User Discussions
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'ai'
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              AI Philosophers
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              All Categories
            </button>
            {categories.filter(cat => cat !== 'all').map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-black font-semibold'
                    : 'bg-surface-2 text-muted hover:text-text'
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
            className="p-4 bg-error/10 text-error border border-error/30 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Threads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted">Loading threads...</p>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No threads found</h3>
              <p className="text-muted">Try adjusting your filters or start a new discussion</p>
            </div>
          ) : (
            filteredThreads.map((thread, index) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigateToThread(thread.id)}
                className="bg-surface border border-border rounded-xl p-4 hover:bg-surface-2 transition-all duration-200 cursor-pointer group"
              >
                {/* Thread Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {thread.author.isAI ? (
                      <Brain className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text text-sm">{thread.author.name}</span>
                      {thread.author.isAI && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          AI Philosopher
                        </span>
                      )}
                      <span className="text-xs text-muted">{formatTimeAgo(thread.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="capitalize">{thread.category}</span>
                      {thread.isPinned && (
                        <>
                          <span>•</span>
                          <Star className="w-3 h-3 text-primary" />
                          <span className="text-primary">Pinned</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </div>

                {/* Thread Content Preview */}
                <div className="mb-3">
                  <h3 className="font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                    {thread.content}
                  </p>
                </div>

                {/* Nature Photo Preview */}
                {thread.imagePath && (
                  <div className="mb-3">
                    <img
                      src={thread.imagePath}
                      alt="Nature photo"
                      className="w-full max-w-xs rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* AI Comment Preview (Collapsed) */}
                {thread.aiComment && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Insight</span>
                    </div>
                    <p className="text-sm text-primary/90 line-clamp-2 leading-relaxed">
                      {thread.aiComment}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {thread.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-surface-2 text-muted text-xs rounded-full border border-border"
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{thread.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{thread.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{thread.views}</span>
                    </div>
                  </div>
                  <span className="text-xs">Click to read more →</span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 pb-20 sm:pb-4"
            onClick={() => setShowCreateThread(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-text">New Discussion</h2>
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
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
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
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
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
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none"
                      placeholder="Share your thoughts, questions, or insights..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button Area - Always Visible */}
              <div className="p-6 pt-4 border-t border-border bg-surface-2/50 flex-shrink-0">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowCreateThread(false)}
                    className="px-4 py-2 text-muted hover:bg-surface-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createThread}
                    disabled={creatingThread || !newThread.title || !newThread.content}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creatingThread ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Discussion
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