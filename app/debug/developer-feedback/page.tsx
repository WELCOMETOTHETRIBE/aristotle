'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Filter, Download, Trash2, X, CheckCircle, Clock, AlertCircle, Bug, Lightbulb, Palette, Zap, Settings, Plus } from 'lucide-react';
import { DeveloperFeedbackAPI, type DeveloperFeedback, getPriorityColor, getStatusColor, getCategoryIcon } from '@/lib/developer-feedback';
import PageLayout from '@/components/PageLayout';

export default function DeveloperFeedbackPage() {
  const [feedback, setFeedback] = useState<DeveloperFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/debug/developer-feedback');
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, newStatus: string) => {
    try {
      const updatedFeedback = feedback.map(f => 
        f.id === feedbackId ? { ...f, status: newStatus as any } : f
      );
      setFeedback(updatedFeedback);
      
      // Update in API
      await fetch('/api/debug/developer-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: feedbackId, status: newStatus })
      });
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const updatedFeedback = feedback.filter(f => f.id !== feedbackId);
      setFeedback(updatedFeedback);
      
      // Delete from API
      await fetch('/api/debug/developer-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: feedbackId })
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/debug/developer-feedback?format=json');
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `developer-feedback-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting feedback:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all feedback? This cannot be undone.')) return;
    
    try {
      await fetch('/api/debug/developer-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      setFeedback([]);
    } catch (error) {
      console.error('Error clearing feedback:', error);
    }
  };

  const filteredFeedback = feedback.filter(f => {
    if (filters.type !== 'all' && f.type !== filters.type) return false;
    if (filters.status !== 'all' && f.status !== filters.status) return false;
    if (filters.priority !== 'all' && f.priority !== filters.priority) return false;
    if (filters.category !== 'all' && f.category !== filters.category) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'wont-fix': return <X className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Plus className="w-4 h-4" />;
      case 'improvement': return <Lightbulb className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'other': return <Settings className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <PageLayout title="Developer Feedback Dashboard" description="Manage and review developer feedback">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Developer Feedback</h1>
            <p className="text-gray-300">
              {filteredFeedback.length} of {feedback.length} feedback items
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="widget">Widget</option>
                  <option value="section">Section</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="wont-fix">Won't Fix</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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
          </div>
        )}

        {/* Feedback List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading feedback...</p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No feedback found</p>
            </div>
          ) : (
            filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryIcon(item.category).props.className.includes('w-4') ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.targetId}</h3>
                      <p className="text-sm text-gray-400">
                        {item.type} • {item.location}
                        {item.frameworkSlug && ` • ${item.frameworkSlug}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{item.comment}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="wont-fix">Won't Fix</option>
                    </select>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                
                {item.metadata && (
                  <details className="mt-4">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      View Details
                    </summary>
                    <div className="mt-2 p-3 bg-white/5 rounded-lg">
                      <pre className="text-xs text-gray-300 overflow-auto">
                        {JSON.stringify(item.metadata, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
} 