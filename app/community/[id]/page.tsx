'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, Brain, MessageSquare, Eye, Clock, 
  User, Reply, MoreHorizontal, Bookmark, BookmarkCheck, 
  Loader2, Send, ThumbsUp, ChevronDown, ChevronUp, Sparkles
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

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment functionality
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  
  // AI response state
  const [aiResponse, setAiResponse] = useState<Reply | null>(null);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  
  // UI state
  const [showAIInsights, setShowAIInsights] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchThread();
      fetchReplies();
    }
  }, [params.id]);

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/community/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data.thread);
      } else {
        setError('Thread not found');
      }
    } catch (error) {
      setError('Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/community/${params.id}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !thread) return;

    try {
      setPostingComment(true);
      
      const response = await fetch(`/api/community/${thread.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setReplies(prev => [...prev, newReply]);
        setNewComment('');
        
        // Trigger AI response after a short delay
        setTimeout(() => {
          triggerAIResponse(newReply);
        }, 2000);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setPostingComment(false);
    }
  };

  const triggerAIResponse = async (userReply: Reply) => {
    try {
      setAiResponseLoading(true);
      
      const response = await fetch('/api/community/ai-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: thread!.id,
          threadTitle: thread!.title,
          threadContent: thread!.content,
          threadCategory: thread!.category,
          userComment: userReply.content,
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        setAiResponse(aiData.comment);
        setShowAIResponse(true);
        
        // Add AI response to replies
        setReplies(prev => [...prev, aiData.comment]);
      }
    } catch (error) {
      console.error('Error triggering AI response:', error);
    } finally {
      setAiResponseLoading(false);
    }
  };

  const toggleLike = async (replyId: string) => {
    // Implement like functionality for replies
    setReplies(prev => 
      prev.map(reply => 
        reply.id === replyId 
          ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
          : reply
      )
    );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted">Loading thread...</p>
          </div>
        </main>
        <TabBar />
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h1 className="text-2xl font-bold text-text mb-2">Thread Not Found</h1>
            <p className="text-muted mb-6">{error || 'The thread you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => router.push('/community')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Community
            </button>
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
        {/* Back Button */}
        <button
          onClick={() => router.push('/community')}
          className="flex items-center gap-2 text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Community</span>
        </button>

        {/* Thread Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              {thread.author.isAI ? (
                <Brain className="w-6 h-6 text-primary" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text">{thread.author.name}</h2>
                {thread.author.isAI && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    AI Philosopher
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(thread.createdAt)}</span>
                <span>•</span>
                <span className="capitalize">{thread.category}</span>
              </div>
            </div>
          </div>

          {/* Thread Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text mb-4">{thread.title}</h1>
            <p className="text-text leading-relaxed whitespace-pre-wrap">{thread.content}</p>
          </div>

          {/* Nature Photo (if applicable) */}
          {thread.imagePath && (
            <div className="mb-6">
              <img
                src={thread.imagePath}
                alt="Nature photo"
                className="w-full max-w-md rounded-lg object-cover"
              />
            </div>
          )}

          {/* AI Comment (if applicable) */}
          {thread.aiComment && (
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Insight</span>
              </div>
              <p className="text-sm text-text leading-relaxed">{thread.aiComment}</p>
            </div>
          )}

          {/* AI Insights - Collapsible */}
          {thread.aiInsights && thread.aiInsights.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-3"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Philosophical Insights</span>
                {showAIInsights ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              <AnimatePresence>
                {showAIInsights && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                      <ul className="space-y-2">
                        {thread.aiInsights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-text flex items-start gap-2 leading-relaxed">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-2 text-muted text-sm rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Thread Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{thread.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-muted">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{replies.length}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{thread.views}</span>
              </div>
            </div>
            <button className="text-muted hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Comments ({replies.length})</h3>
          
          {/* AI Response Loading */}
          {aiResponseLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20"
            >
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
            </motion.div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-border rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {reply.author.isAI ? (
                      <Brain className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-text text-sm">{reply.author.name}</span>
                      {reply.author.isAI && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          AI
                        </span>
                      )}
                      <span className="text-xs text-muted">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-text text-sm leading-relaxed whitespace-pre-wrap mb-3">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(reply.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          reply.isLiked 
                            ? 'text-primary' 
                            : 'text-muted hover:text-primary'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                        <span>{reply.likes}</span>
                      </button>
                      <button className="text-xs text-muted hover:text-text transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="font-medium text-text mb-3">Add a comment</h4>
            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none"
                placeholder="Share your thoughts on this thread..."
              />
              <div className="flex items-center justify-end gap-3">
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
          </div>
        </div>
      </main>

      <TabBar />
      <GuideFAB />
    </div>
  );
} 