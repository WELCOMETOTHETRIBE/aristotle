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
  const { user, loading: authLoading } = useAuth();
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
  
  // Comment functionality
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedThreadForComment, setSelectedThreadForComment] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  
  // AI Comments state
  const [aiComments, setAiComments] = useState<{[threadId: string]: any[]}>({});

  const categories = ['all', 'Stoicism', 'Aristotelian Ethics', 'Courage', 'Wisdom', 'Justice', 'Temperance'];

  useEffect(() => {
    if (authLoading) return;

    const fetchThreads = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (activeFilter !== 'all') {
          params.append('type', activeFilter === 'ai' ? 'ai_question' : 'member_discussion');
        }

        const response = await fetch(`/api/community?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }

        const data = await response.json();
        
        // Transform API data to match Thread interface
        const transformedThreads: Thread[] = data.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            name: post.author.displayName || post.author.username,
            avatar: `/avatars/${post.author.username}.jpg`,
            isAI: post.isAIQuestion,
          },
          type: post.isAIQuestion ? 'ai' : 'user',
          category: post.category,
          tags: post.tags,
          replies: post._count.replies,
          views: post.views,
          likes: post._count.likes,
          isLiked: false, // Will be updated when we implement user-specific data
          isBookmarked: false, // Will be updated when we implement user-specific data
          createdAt: post.createdAt,
          lastActivity: post.updatedAt,
          isPinned: post.isPinned,
          aiInsights: post.aiInsights,
        }));

        setThreads(transformedThreads);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load community threads');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [authLoading, selectedCategory, activeFilter]);

  const toggleLike = async (threadId: string) => {
    try {
      const response = await fetch(`/api/community/${threadId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();
      
      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId 
            ? { 
                ...thread, 
                isLiked: result.liked, 
                likes: result.liked ? thread.likes + 1 : thread.likes - 1 
              }
            : thread
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const newPost = await response.json();
      
      // Transform the new post to match Thread interface
      const newThreadData: Thread = {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        author: {
          name: newPost.author.displayName || newPost.author.username,
          avatar: `/avatars/${newPost.author.username}.jpg`,
          isAI: false,
        },
        type: 'user',
        category: newPost.category,
        tags: newPost.tags,
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

      // Trigger AI philosopher comment
      setTimeout(async () => {
        try {
          const aiResponse = await fetch('/api/community/ai-comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              threadId: newPost.id,
              threadTitle: newThread.title,
              threadContent: newThread.content,
              threadCategory: newThread.category,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            console.log(`AI comment from ${aiData.philosopher.name}: ${aiData.comment.content}`);
            
            // Store the AI comment in frontend state
            setAiComments(prev => ({
              ...prev,
              [newPost.id]: [...(prev[newPost.id] || []), aiData.comment]
            }));
            
            // Update the thread's reply count
            setThreads(prev => 
              prev.map(thread => 
                thread.id === newPost.id 
                  ? { ...thread, replies: thread.replies + 1 }
                  : thread
              )
            );
          }
        } catch (error) {
          console.error('Error triggering AI comment:', error);
        }
      }, 2000); // Wait 2 seconds before AI responds
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create thread');
    } finally {
      setCreatingThread(false);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !selectedThreadForComment) {
      return;
    }

    try {
      setPostingComment(true);
      
      const response = await fetch(`/api/community/${selectedThreadForComment.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      // Update the thread's reply count
      setThreads(prev => 
        prev.map(thread => 
          thread.id === selectedThreadForComment.id 
            ? { ...thread, replies: thread.replies + 1 }
            : thread
        )
      );

      setShowCommentModal(false);
      setNewComment('');
      setSelectedThreadForComment(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setPostingComment(false);
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-text">Community</h1>
                <p className="text-muted text-sm">Connect with fellow seekers</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateThread(true)}
              className="group relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="w-4 h-4 relative z-10" />
              <span className="relative z-10">New Thread</span>
            </button>
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

                {/* AI Philosopher Comments */}
                {aiComments[thread.id] && aiComments[thread.id].length > 0 && (
                  <div className="mb-3 space-y-2">
                    {aiComments[thread.id].map((comment, idx) => (
                      <div key={comment.id} className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{comment.author.avatar}</span>
                          <div>
                            <div className="font-medium text-primary text-sm">{comment.author.name}</div>
                            <div className="text-xs text-primary/70">{comment.author.persona}</div>
                          </div>
                        </div>
                        <p className="text-sm text-text leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(thread.id);
                      }}
                      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-surface-2 ${
                        thread.isLiked 
                          ? 'text-primary bg-primary/10' 
                          : 'hover:text-primary'
                      }`}
                    >
                      <motion.div
                        animate={thread.isLiked ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${thread.isLiked ? 'fill-current' : ''}`} />
                      </motion.div>
                      <span className="font-medium">{thread.likes}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedThreadForComment(thread);
                        setShowCommentModal(true);
                      }}
                      className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-surface-2 hover:text-primary"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-medium">{thread.replies}</span>
                    </button>
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="font-medium">{thread.views}</span>
                    </div>
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

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && selectedThreadForComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-text">Add Comment</h2>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-surface-2 rounded-lg">
                <h3 className="font-semibold text-text mb-2">{selectedThreadForComment.title}</h3>
                <p className="text-muted text-sm">{selectedThreadForComment.content}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none"
                    placeholder="Share your thoughts on this thread..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCommentModal(false)}
                    className="px-4 py-2 text-muted hover:bg-surface-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={postComment}
                    disabled={postingComment || !newComment.trim()}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {postingComment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
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