'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Filter, Download, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DeveloperFeedbackAPI, 
  type DeveloperFeedback,
  getPriorityColor,
  getStatusColor,
  getCategoryIcon
} from '@/lib/developer-feedback';

interface DeveloperFeedbackDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DeveloperFeedbackDashboard({ isVisible, onClose }: DeveloperFeedbackDashboardProps) {
  const [feedback, setFeedback] = useState<DeveloperFeedback[]>([]);
  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    priority: string;
    category: string;
  }>({
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  useEffect(() => {
    if (isVisible) {
      setFeedback(DeveloperFeedbackAPI.getAllFeedback());
    }
  }, [isVisible]);

  const filteredFeedback = feedback.filter(item => {
    if (filter.type !== 'all' && item.type !== filter.type) return false;
    if (filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.priority !== 'all' && item.priority !== filter.priority) return false;
    if (filter.category !== 'all' && item.category !== filter.category) return false;
    return true;
  });

  const handleStatusUpdate = (id: string, status: DeveloperFeedback['status']) => {
    DeveloperFeedbackAPI.updateFeedbackStatus(id, status);
    setFeedback(DeveloperFeedbackAPI.getAllFeedback());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      DeveloperFeedbackAPI.deleteFeedback(id);
      setFeedback(DeveloperFeedbackAPI.getAllFeedback());
    }
  };

  const handleExport = () => {
    const data = DeveloperFeedbackAPI.exportFeedback();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `developer-feedback-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all feedback? This cannot be undone.')) {
      DeveloperFeedbackAPI.clearAllFeedback();
      setFeedback([]);
    }
  };

  const getStatusIcon = (status: DeveloperFeedback['status']) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-purple-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'wont-fix': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Developer Feedback Dashboard</h2>
              <p className="text-sm text-gray-600">
                {filteredFeedback.length} of {feedback.length} feedback items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Types</option>
              <option value="widget">Widget</option>
              <option value="section">Section</option>
              <option value="general">General</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="wont-fix">Won't Fix</option>
            </select>

            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Categories</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="improvement">Improvement</option>
              <option value="design">Design</option>
              <option value="performance">Performance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="overflow-auto max-h-[calc(90vh-200px)]">
          {filteredFeedback.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No feedback found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getCategoryIcon(item.category)}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">
                            {item.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.timestamp.toLocaleString()}
                        </span>
                      </div>

                      {/* Target Info */}
                      <div className="text-sm text-gray-600 mb-3">
                        <div><strong>Target:</strong> {item.targetId}</div>
                        {item.frameworkSlug && <div><strong>Framework:</strong> {item.frameworkSlug}</div>}
                        <div><strong>Location:</strong> {item.location}</div>
                      </div>

                      {/* Comment */}
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {item.comment}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* Status Update */}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item.id, e.target.value as DeveloperFeedback['status'])}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="wont-fix">Won't Fix</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete feedback"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 