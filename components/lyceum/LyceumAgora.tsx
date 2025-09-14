'use client';

import React, { useState, useEffect } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumAgoraPost, LyceumAgoraComment } from '@prisma/client';

interface LyceumAgoraProps {
  pathId?: string;
  lessonId?: string;
}

interface PostFormData {
  title: string;
  content: string;
  type: 'reflection' | 'question' | 'insight' | 'discussion';
  tags: string[];
  isAnonymous: boolean;
}

export default function LyceumAgora({ pathId, lessonId }: LyceumAgoraProps) {
  const { lyceumData } = useLyceum();
  const [posts, setPosts] = useState<LyceumAgoraPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<LyceumAgoraPost | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    type: 'reflection',
    tags: [],
    isAnonymous: false
  });
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [pathId, lessonId]);

  const loadPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (pathId) params.append('pathId', pathId);
      if (lessonId) params.append('lessonId', lessonId);
      
      const response = await fetch(`/api/lyceum/agora?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/lyceum/agora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pathId,
          lessonId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPosts([data.post, ...posts]);
        setFormData({
          title: '',
          content: '',
          type: 'reflection',
          tags: [],
          isAnonymous: false
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/lyceum/agora/${postId}/like`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the post in the list
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, _count: { ...post._count, likes: data.liked ? post._count.likes + 1 : post._count.likes - 1 } }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/lyceum/agora/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          isAnonymous: false
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNewComment('');
        // Reload the selected post to get updated comments
        if (selectedPost && selectedPost.id === postId) {
          loadPostDetails(postId);
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const loadPostDetails = async (postId: string) => {
    try {
      const response = await fetch(`/api/lyceum/agora/${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedPost(data.post);
      }
    } catch (error) {
      console.error('Error loading post details:', error);
    }
  };

  const getPostTypeColor = (type: string) => {
    const colors = {
      reflection: 'bg-purple-100 text-purple-700',
      question: 'bg-blue-100 text-blue-700',
      insight: 'bg-green-100 text-green-700',
      discussion: 'bg-orange-100 text-orange-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPathTitle = (pathId: string) => {
    const path = lyceumData?.paths.find(p => p.id === pathId);
    return path?.title || 'Unknown Path';
  };

  const getLessonTitle = (lessonId: string) => {
    const lesson = lyceumData?.lessons.find(l => l.id === lessonId);
    return lesson?.title || 'Unknown Lesson';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Loading community posts...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">The Agora</h1>
        <p className="text-gray-600">
          Share your insights, ask questions, and engage with fellow learners
        </p>
      </div>

      {/* Create Post Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Post'}
        </button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Post</h2>
          
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your post a title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="reflection">Reflection</option>
                <option value="question">Question</option>
                <option value="insight">Insight</option>
                <option value="discussion">Discussion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your thoughts, questions, or insights..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No posts yet</div>
          <p className="text-gray-500">
            Be the first to share your thoughts in the Agora
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {post.isAnonymous ? (
                      <span className="text-gray-600">?</span>
                    ) : (
                      <span className="text-gray-600">
                        {post.user.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {post.isAnonymous ? 'Anonymous' : post.user.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                  {post.type}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.pathId && (
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Path:</span> {getPathTitle(post.pathId)}
                  {post.lessonId && (
                    <span className="ml-2">
                      <span className="font-medium">Lesson:</span> {getLessonTitle(post.lessonId)}
                    </span>
                  )}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post._count.likes}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      loadPostDetails(post.id);
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post._count.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPost.title}
                </h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comments ({selectedPost._count.comments})
                </h3>

                {/* Add Comment */}
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleAddComment(selectedPost.id)}
                      disabled={!newComment.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedPost.comments?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {comment.isAnonymous ? (
                            <span className="text-gray-600 text-sm">?</span>
                          ) : (
                            <span className="text-gray-600 text-sm">
                              {comment.user.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {comment.isAnonymous ? 'Anonymous' : comment.user.name || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}