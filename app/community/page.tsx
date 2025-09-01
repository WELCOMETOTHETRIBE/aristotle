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
  const [aiCommentLoading, setAiCommentLoading] = useState<{[threadId: string]: boolean}>({});
  const [generatingAIThread, setGeneratingAIThread] = useState(false);

  const categories = ['all', 'Stoicism', 'Aristotelian Ethics', 'Courage', 'Wisdom', 'Justice', 'Temperance', 'Nature Logs'];

  // Function to extract insights from AI philosopher comments
  const extractInsightsFromComment = (commentContent: string): string[] => {
    const insights: string[] = [];
    
    // Extract key philosophical concepts and insights
    const philosophicalTerms = [
      'virtue', 'wisdom', 'courage', 'justice', 'temperance', 'eudaimonia', 'stoicism',
      'mindfulness', 'resilience', 'growth', 'reflection', 'practice', 'discipline',
      'balance', 'harmony', 'truth', 'knowledge', 'understanding', 'perspective'
    ];
    
    // Look for sentences that contain philosophical terms
    const sentences = commentContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      const hasPhilosophicalTerm = philosophicalTerms.some(term => 
        lowerSentence.includes(term)
      );
      
      if (hasPhilosophicalTerm && sentence.trim().length > 20) {
        insights.push(sentence.trim());
      }
    });
    
    // If no philosophical insights found, create general insights
    if (insights.length === 0) {
      insights.push('This discussion touches on important philosophical themes');
      insights.push('Consider how this relates to your personal growth journey');
    }
    
    // Limit to 3 insights maximum
    return insights.slice(0, 3);
  };

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
          type: post.isAIQuestion ? 'ai' : 'member_discussion',
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
        
        // Fetch replies for each thread to populate AI comments
        await fetchRepliesForThreads(transformedThreads);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load community threads');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [authLoading, selectedCategory, activeFilter]);

  // Function to fetch replies for all threads
  const fetchRepliesForThreads = async (threadsList: Thread[]) => {
    try {
      for (const thread of threadsList) {
        const response = await fetch(`/api/community/${thread.id}/replies`);
        if (response.ok) {
          const replies = await response.json();
          // Filter for AI comments and store them
          const aiReplies = replies.filter((reply: any) => 
            reply.author.username === 'ai' || 
            reply.author.displayName?.includes('AI') ||
            reply.content.startsWith('[AI Comment by')
          );
          if (aiReplies.length > 0) {
            setAiComments(prev => ({
              ...prev,
              [thread.id]: aiReplies.map((reply: any) => {
                // Extract philosopher name from AI comment content
                let philosopherName = 'AI Philosopher';
                let cleanContent = reply.content;
                
                if (reply.content.startsWith('[AI Comment by')) {
                  const match = reply.content.match(/\[AI Comment by (.+?)\]/);
                  if (match) {
                    philosopherName = match[1];
                    cleanContent = reply.content.replace(/\[AI Comment by .+?\]\n\n/, '');
                  }
                }
                
                return {
                  id: reply.id,
                  content: cleanContent,
                  author: {
                    name: philosopherName,
                    avatar: reply.author.avatar || '/avatars/ai.jpg',
                    isAI: true,
                  },
                  createdAt: reply.createdAt,
                  likes: reply.likes,
                };
              })
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // Disabled automatic AI thread generation in client
  // Intentionally left blank to avoid unintended posts from user sessions

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

  const likeAIComment = (threadId: string, commentId: string) => {
    setAiComments(prev => ({
      ...prev,
      [threadId]: prev[threadId]?.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      ) || []
    }));
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
        aiInsights: [], // Initialize empty insights
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
          // Set loading state for this thread
          setAiCommentLoading(prev => ({ ...prev, [newPost.id]: true }));
          
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
            
            // Extract insights from the AI comment and update thread
            const insights = extractInsightsFromComment(aiData.comment.content);
            
            // Update the thread's reply count and AI insights
            setThreads(prev => 
              prev.map(thread => 
                thread.id === newPost.id 
                  ? { 
                      ...thread, 
                      replies: thread.replies + 1,
                      aiInsights: insights
                    }
                  : thread
              )
            );
            
            // Refresh the page to show the AI comment from the database
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (error) {
          console.error('Error triggering AI comment:', error);
        } finally {
          // Clear loading state
          setAiCommentLoading(prev => ({ ...prev, [newPost.id]: false }));
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
    console.log('postComment called with:', { 
      comment: newComment, 
      thread: selectedThreadForComment?.id,
      postingComment 
    });
    
    if (!newComment.trim() || !selectedThreadForComment) {
      console.log('Validation failed:', { 
        hasComment: !!newComment.trim(), 
        hasThread: !!selectedThreadForComment 
      });
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

      // Store thread info for AI response before clearing state
      const threadId = selectedThreadForComment.id;
      const threadTitle = selectedThreadForComment.title;
      const threadContent = selectedThreadForComment.content;
      const threadCategory = selectedThreadForComment.category;
      const userCommentContent = newComment;

      // Update the thread's reply count
      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, replies: thread.replies + 1 }
            : thread
        )
      );

      setShowCommentModal(false);
      setNewComment('');
      setSelectedThreadForComment(null);

      // Trigger AI philosopher response to the user's comment
      setTimeout(async () => {
        try {
          setAiCommentLoading(prev => ({ ...prev, [threadId]: true }));
          
          const aiResponse = await fetch('/api/community/ai-comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              threadId: threadId,
              threadTitle: threadTitle,
              threadContent: threadContent,
              threadCategory: threadCategory,
              userComment: userCommentContent, // Include the user's comment for context
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            console.log(`AI response to comment from ${aiData.philosopher.name}: ${aiData.comment.content}`);
            
            // Store the AI comment in frontend state
            setAiComments(prev => ({
              ...prev,
              [threadId]: [...(prev[threadId] || []), aiData.comment]
            }));
            
            // Update the thread's reply count again for AI response
            setThreads(prev => 
              prev.map(thread => 
                thread.id === threadId 
                  ? { ...thread, replies: thread.replies + 1 }
                  : thread
              )
            );
            
            // Refresh the page to show the AI comment from the database
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (error) {
          console.error('Error triggering AI response to comment:', error);
        } finally {
          setAiCommentLoading(prev => ({ ...prev, [threadId]: false }));
        }
      }, 2000); // Wait 2 seconds before AI responds
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

  const generateDailyAIThread = async () => {
    try {
      setGeneratingAIThread(true);
      setError(null); // Clear any previous errors
      
      console.log('Starting AI thread generation...');
      
      const response = await fetch('/api/community/ai-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('AI thread API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI thread API error response:', errorText);
        throw new Error(`Failed to generate AI thread: ${response.status} ${response.statusText}`);
      }

      const aiThreadData = await response.json();
      console.log('AI thread API response data:', aiThreadData);
      
      if (!aiThreadData.success || !aiThreadData.thread) {
        throw new Error('Invalid AI thread response format');
      }

      console.log(`AI thread generated by ${aiThreadData.philosopher.name}: ${aiThreadData.thread.title}`);
      
      // Add the new AI thread to the threads list
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
      console.log('AI thread successfully added to threads list');
      
      // Reload page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error generating AI thread:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate AI thread');
    } finally {
      setGeneratingAIThread(false);
    }
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateThread(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border hover:border-primary/30 text-text hover:text-primary rounded-lg text-sm font-medium transition-all duration-200 hover:bg-surface-2 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Thread</span>
              </button>
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
                  
                  {/* Nature Photo Image Display */}
                  {thread.type === 'nature_photo' && thread.imagePath && (
                    <div className="mt-3">
                      <img
                        src={thread.imagePath}
                        alt={thread.title}
                        className="w-full h-48 object-cover rounded-lg border border-border/50"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {thread.aiComment && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-green-500/5 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">Nature Wisdom</span>
                          </div>
                          <p className="text-sm text-green-700 leading-relaxed">{thread.aiComment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Insights from Philosopher Comments */}
                {thread.aiInsights && thread.aiInsights.length > 0 && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary text-sm mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Philosophical Insights
                    </h4>
                    <ul className="space-y-2">
                      {thread.aiInsights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-primary/90 flex items-start gap-2 leading-relaxed">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Comment Loading State */}
                {aiCommentLoading[thread.id] && (
                  <div className="mb-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-primary text-sm">Philosopher is thinking...</div>
                        <div className="text-xs text-primary/70">Generating philosophical insights</div>
                      </div>
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  </div>
                )}

                {/* AI Philosopher Comments */}
                {aiComments[thread.id] && aiComments[thread.id].length > 0 && (
                  <div className="mb-3 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Philosopher Response</span>
                    </div>
                    {aiComments[thread.id].map((comment, idx) => (
                      <div key={comment.id} className="p-4 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/10 rounded-xl border border-primary/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={comment.author.avatar || '/avatars/ai.jpg'}
                            alt={comment.author.name}
                            className="w-10 h-10 rounded-full object-cover border border-primary/20"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.svg'; }}
                          />
                          <div>
                            <div className="font-semibold text-primary text-sm">{comment.author.name}</div>
                            <div className="text-xs text-primary/70 font-medium">{comment.author.persona}</div>
                          </div>
                        </div>
                        <p className="text-sm text-text leading-relaxed">{comment.content}</p>
                        <div className="mt-3 pt-3 border-t border-primary/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-primary/70">
                              <span>Philosophical perspective</span>
                              <span>•</span>
                              <span>AI-generated</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                likeAIComment(thread.id, comment.id);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                                comment.isLiked 
                                  ? 'text-primary bg-primary/10' 
                                  : 'text-primary/70 hover:text-primary hover:bg-primary/5'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                              <span className="text-xs font-medium">{comment.likes || 0}</span>
                            </button>
                          </div>
                        </div>
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
              className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-4">
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

                </div>
              </div>
              
              {/* Submit Button Area - Always Visible */}
              <div className="p-6 pt-4 border-t border-border bg-surface-2/50">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative"
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
                    onClick={() => {
                      console.log('Post Comment button clicked!');
                      postComment();
                    }}
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