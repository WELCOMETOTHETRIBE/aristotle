'use client';

import { useState, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { DeveloperFeedbackAPI } from '@/lib/developer-feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementInfo: {
    tagName: string;
    className: string;
    id: string;
    textContent: string;
    innerHTML: string;
    dataset: Record<string, any>;
    attributes: Array<{ name: string; value: string }>;
  } | null;
  clickPosition: { x: number; y: number } | null;
}

export default function FeedbackModal({ isOpen, onClose, elementInfo, clickPosition }: FeedbackModalProps) {
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'bug' | 'feature' | 'improvement' | 'design' | 'performance' | 'other'>('improvement');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('FeedbackModal props:', { isOpen, elementInfo, clickPosition });

  useEffect(() => {
    if (isOpen) {
      setComment('');
      setCategory('improvement');
      setPriority('medium');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!comment.trim() || !elementInfo) return;

    setIsSubmitting(true);
    try {
      const feedback = {
        id: `click-feedback-${Date.now()}`,
        timestamp: new Date(),
        type: 'general' as const,
        targetId: elementInfo.id || elementInfo.className || elementInfo.tagName,
        frameworkSlug: undefined,
        location: window.location.pathname,
        comment: comment.trim(),
        priority,
        status: 'open' as const,
        category,
        metadata: {
          elementInfo,
          clickPosition,
          timestamp: new Date().toISOString()
        }
      };

      DeveloperFeedbackAPI.addFeedback(feedback);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]';
      notification.textContent = 'Feedback submitted successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]';
      notification.textContent = 'Error submitting feedback. Please try again.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!isOpen || !elementInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Element Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Element Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Selected Element</h3>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <div><strong>Tag:</strong> {elementInfo.tagName}</div>
              {elementInfo.id && <div><strong>ID:</strong> {elementInfo.id}</div>}
              {elementInfo.className && <div><strong>Class:</strong> {elementInfo.className}</div>}
              {elementInfo.textContent && (
                <div><strong>Text:</strong> {elementInfo.textContent.slice(0, 100)}...</div>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bug">Bug</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="design">Design</option>
              <option value="performance">Performance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your feedback about this element..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 