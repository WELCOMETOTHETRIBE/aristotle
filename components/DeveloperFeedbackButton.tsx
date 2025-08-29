'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, AlertCircle, Star, Zap, Palette, Bug, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DeveloperFeedbackAPI, 
  FeedbackHelpers, 
  type DeveloperFeedback,
  getPriorityColor,
  getCategoryIcon
} from '@/lib/developer-feedback';

interface DeveloperFeedbackButtonProps {
  targetId: string;
  type: 'widget' | 'section' | 'general';
  frameworkSlug?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DeveloperFeedbackButton({ 
  targetId, 
  type, 
  frameworkSlug, 
  className = '',
  children 
}: DeveloperFeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState<DeveloperFeedback['priority']>('medium');
  const [category, setCategory] = useState<DeveloperFeedback['category']>('improvement');

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  const handleSubmit = () => {
    if (!comment.trim()) return;

    if (type === 'widget' && frameworkSlug) {
      FeedbackHelpers.widgetFeedback(targetId, frameworkSlug, comment, priority, category);
    } else if (type === 'section') {
      FeedbackHelpers.sectionFeedback(targetId, comment, priority, category);
    } else {
      FeedbackHelpers.generalFeedback(comment, priority, category);
    }

    setComment('');
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 right-2 z-50 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 opacity-0 hover:opacity-100 group-hover:opacity-100"
        title="Add developer feedback"
      >
        <MessageSquare className="h-3 w-3" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Developer Feedback</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Target Info */}
              <div className="text-sm text-gray-600">
                <div><strong>Type:</strong> {type}</div>
                <div><strong>Target:</strong> {targetId}</div>
                {frameworkSlug && <div><strong>Framework:</strong> {frameworkSlug}</div>}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'bug', icon: '🐛', label: 'Bug' },
                    { key: 'feature', icon: '✨', label: 'Feature' },
                    { key: 'improvement', icon: '🔧', label: 'Improvement' },
                    { key: 'design', icon: '🎨', label: 'Design' },
                    { key: 'performance', icon: '⚡', label: 'Performance' },
                    { key: 'other', icon: '📝', label: 'Other' }
                  ].map(({ key, icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key as DeveloperFeedback['category'])}
                      className={`p-2 rounded border text-sm transition-colors ${
                        category === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{icon}</div>
                      <div>{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {[
                    { key: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
                    { key: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
                    { key: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
                    { key: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' }
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setPriority(key as DeveloperFeedback['priority'])}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        priority === key ? color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Describe the issue, feature request, or improvement..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Press Cmd/Ctrl + Enter to submit
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <div className="text-xs text-gray-500">
                This feedback is only visible in development mode
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!comment.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 