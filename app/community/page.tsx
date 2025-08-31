'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Heart, Share2, Sparkles, Target, Calendar, MapPin, UserPlus, Award, TrendingUp,
  ArrowLeft, Bell, BellOff, Plus, Search, Filter, BookOpen, Brain, Shield, Scale, Leaf, Send, ThumbsUp,
  MessageSquare, Eye, Clock, Star, Zap, Lightbulb, Compass, ChevronRight, ChevronDown, User, Reply,
  MoreHorizontal, Flag, Bookmark, BookmarkCheck
} from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  type: 'ai_question' | 'member_discussion' | 'resource_share';
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
  isAIQuestion?: boolean;
  aiInsights?: string[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
  parentId?: string;
}

interface Notification {
  id: string;
  type: 'new_reply' | 'new_question' | 'like' | 'mention';
  title: string;
  message: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
}

const aiQuestions: ForumPost[] = [
  {
    id: '1',
    title: 'How do you apply Stoic principles when facing workplace adversity?',
    content: 'The AI Academy invites you to reflect on how ancient Stoic wisdom can guide us through modern workplace challenges. Share your experiences and learn from others who have navigated similar situations.',
    author: {
      name: 'AI Academy',
      avatar: '/ai-academy-avatar.png',
      level: 'AI Guide'
    },
    type: 'ai_question',
    category: 'Stoicism',
    tags: ['Workplace', 'Adversity', 'Stoic Principles'],
    replies: 23,
    views: 156,
    likes: 45,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: '2024-01-15T14:30:00Z',
    isPinned: true,
    isAIQuestion: true,
    aiInsights: [
      'Focus on what you can control',
      'Practice negative visualization',
      'Maintain perspective on challenges'
    ]
  },
  {
    id: '2',
    title: 'What does Aristotle\'s concept of "eudaimonia" mean in your daily life?',
    content: 'Eudaimonia, often translated as "flourishing" or "human flourishing," is central to Aristotle\'s ethics. How do you understand and pursue this concept in your modern life?',
    author: {
      name: 'AI Academy',
      avatar: '/ai-academy-avatar.png',
      level: 'AI Guide'
    },
    type: 'ai_question',
    category: 'Aristotelian Ethics',
    tags: ['Eudaimonia', 'Flourishing', 'Purpose'],
    replies: 18,
    views: 89,
    likes: 32,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-01-14T09:00:00Z',
    lastActivity: '2024-01-15T12:15:00Z',
    isAIQuestion: true,
    aiInsights: [
      'Cultivate virtues consistently',
      'Find balance in all activities',
      'Develop meaningful relationships'
    ]
  },
  {
    id: '3',
    title: 'How do you practice courage in small, everyday moments?',
    content: 'Courage isn\'t just about grand gestures. The AI Academy asks: How do you demonstrate courage in your daily interactions, decisions, and challenges?',
    author: {
      name: 'AI Academy',
      avatar: '/ai-academy-avatar.png',
      level: 'AI Guide'
    },
    type: 'ai_question',
    category: 'Courage',
    tags: ['Daily Practice', 'Small Acts', 'Personal Growth'],
    replies: 31,
    views: 203,
    likes: 67,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-13T11:00:00Z',
    lastActivity: '2024-01-15T16:45:00Z',
    isAIQuestion: true,
    aiInsights: [
      'Speak up when it matters',
      'Try new things regularly',
      'Face discomfort willingly'
    ]
  }
];

const memberDiscussions: ForumPost[] = [
  {
    id: '4',
    title: 'My journey with morning meditation and its impact on wisdom',
    content: 'I\'ve been practicing morning meditation for 6 months now, and I\'ve noticed significant improvements in my ability to think clearly and make better decisions throughout the day. Has anyone else experienced this?',
    author: {
      name: 'Sarah M.',
      avatar: '/avatars/sarah.jpg',
      level: 'Wisdom Seeker'
    },
    type: 'member_discussion',
    category: 'Wisdom',
    tags: ['Meditation', 'Morning Routine', 'Personal Experience'],
    replies: 15,
    views: 78,
    likes: 23,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-15T08:30:00Z',
    lastActivity: '2024-01-15T13:20:00Z'
  },
  {
    id: '5',
    title: 'Building justice in family relationships - practical tips',
    content: 'I\'ve been working on applying principles of justice in my family relationships. Here are some practical strategies that have worked for me...',
    author: {
      name: 'Michael R.',
      avatar: '/avatars/michael.jpg',
      level: 'Justice Advocate'
    },
    type: 'member_discussion',
    category: 'Justice',
    tags: ['Family', 'Relationships', 'Practical Tips'],
    replies: 27,
    views: 134,
    likes: 41,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2024-01-14T15:45:00Z',
    lastActivity: '2024-01-15T11:30:00Z'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_reply',
    title: 'New reply to your comment',
    message: 'Sarah M. replied to your comment on "How do you apply Stoic principles when facing workplace adversity?"',
    postId: '1',
    isRead: false,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    type: 'new_question',
    title: 'New AI Academy Question',
    message: 'The AI Academy has posted a new question: "What does Aristotle\'s concept of eudaimonia mean in your daily life?"',
    postId: '2',
    isRead: false,
    createdAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '3',
    type: 'like',
    title: 'Someone liked your post',
    message: 'Michael R. liked your discussion about morning meditation',
    postId: '4',
    isRead: true,
    createdAt: '2024-01-15T12:15:00Z'
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'ai_questions' | 'discussions' | 'resources'>('ai_questions');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const allPosts = [...aiQuestions, ...memberDiscussions];
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTab = activeTab === 'ai_questions' ? post.isAIQuestion : 
                      activeTab === 'discussions' ? post.type === 'member_discussion' :
                      post.type === 'resource_share';
    return matchesSearch && matchesCategory && matchesTab;
  });

  const categories = ['all', 'Stoicism', 'Aristotelian Ethics', 'Courage', 'Wisdom', 'Justice', 'Temperance'];

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    setUnreadCount(0);
  };

  const toggleLike = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Toggling like for post:', postId);
  };

  const toggleBookmark = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Toggling bookmark for post:', postId);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Forum</h1>
                    <p className="text-gray-600 dark:text-gray-300">Connect, learn, and grow with fellow seekers</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 relative"
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-violet-600 hover:text-violet-700"
                            >
                              Mark all read
                            </button>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No notifications
                            </div>
                          ) : (
                            notifications.map((notification: Notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 ${
                                  !notification.isRead ? 'bg-violet-50 dark:bg-violet-900/20' : ''
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    !notification.isRead ? 'bg-violet-500' : 'bg-gray-300'
                                  }`} />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                      {notification.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                      {formatTimeAgo(notification.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Create Post Button */}
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-1 bg-white/80 dark:bg-slate-800/80 rounded-xl p-1 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('ai_questions')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'ai_questions'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Questions
                </div>
              </button>
              <button
                onClick={() => setActiveTab('discussions')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'discussions'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Discussions
                </div>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'resources'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </div>
              </button>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        {post.isAIQuestion ? (
                          <Brain className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                          {post.isAIQuestion && (
                            <span className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs rounded-full">
                              AI Academy
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{post.author.level}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                          {post.isPinned && (
                            <>
                              <span>•</span>
                              <span className="text-violet-600">Pinned</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(post.id);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {post.isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-violet-600" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* AI Insights */}
                  {post.aiInsights && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                      <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        AI Insights
                      </h4>
                      <ul className="space-y-1">
                        {post.aiInsights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-violet-600 dark:text-violet-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(post.id);
                        }}
                        className={`flex items-center gap-1 hover:text-violet-600 transition-colors ${
                          post.isLiked ? 'text-violet-600' : ''
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{post.category}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Stats */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Community Stats
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1,247</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">89</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Discussions</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">AI Questions Today</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Start Discussion
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Create Event
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Find Mentors
                    </div>
                  </button>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-600" />
                  Community Guidelines
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Be Respectful</h4>
                      <p className="text-gray-600 dark:text-gray-400">Treat others with kindness and understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Share Wisdom</h4>
                      <p className="text-gray-600 dark:text-gray-400">Contribute meaningful insights and experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Support Growth</h4>
                      <p className="text-gray-600 dark:text-gray-400">Encourage others on their virtue journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                <blockquote className="text-lg italic mb-4">
                  "Man is by nature a social animal."
                </blockquote>
                <cite className="text-sm opacity-90">— Aristotle</cite>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 