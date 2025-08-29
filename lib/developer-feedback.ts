export interface DeveloperFeedback {
  id: string;
  timestamp: Date;
  type: 'widget' | 'section' | 'general';
  targetId: string; // widget ID, section ID, or general
  frameworkSlug?: string;
  location: string; // page path
  comment: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';
  category: 'bug' | 'feature' | 'improvement' | 'design' | 'performance' | 'other';
  metadata?: Record<string, any>; // additional context
}

// In-memory storage for development (in production, this would be a database)
let feedbackStorage: DeveloperFeedback[] = [];

export const DeveloperFeedbackAPI = {
  // Add new feedback
  addFeedback(feedback: Omit<DeveloperFeedback, 'id' | 'timestamp'>): DeveloperFeedback {
    const newFeedback: DeveloperFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    feedbackStorage.push(newFeedback);
    
    // Log to console for immediate visibility
    console.log('🔧 Developer Feedback Added:', {
      id: newFeedback.id,
      type: newFeedback.type,
      targetId: newFeedback.targetId,
      priority: newFeedback.priority,
      comment: newFeedback.comment
    });
    
    return newFeedback;
  },

  // Get all feedback
  getAllFeedback(): DeveloperFeedback[] {
    return [...feedbackStorage].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Get feedback by type
  getFeedbackByType(type: DeveloperFeedback['type']): DeveloperFeedback[] {
    return feedbackStorage.filter(f => f.type === type);
  },

  // Get feedback by target
  getFeedbackByTarget(targetId: string): DeveloperFeedback[] {
    return feedbackStorage.filter(f => f.targetId === targetId);
  },

  // Get feedback by framework
  getFeedbackByFramework(frameworkSlug: string): DeveloperFeedback[] {
    return feedbackStorage.filter(f => f.frameworkSlug === frameworkSlug);
  },

  // Update feedback status
  updateFeedbackStatus(id: string, status: DeveloperFeedback['status']): DeveloperFeedback | null {
    const feedback = feedbackStorage.find(f => f.id === id);
    if (feedback) {
      feedback.status = status;
      return feedback;
    }
    return null;
  },

  // Delete feedback
  deleteFeedback(id: string): boolean {
    const index = feedbackStorage.findIndex(f => f.id === id);
    if (index !== -1) {
      feedbackStorage.splice(index, 1);
      return true;
    }
    return false;
  },

  // Clear all feedback
  clearAllFeedback(): void {
    feedbackStorage = [];
  },

  // Export feedback for sharing
  exportFeedback(): string {
    return JSON.stringify(feedbackStorage, null, 2);
  },

  // Import feedback
  importFeedback(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      feedbackStorage = data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Failed to import feedback:', error);
    }
  }
};

// Helper functions for common feedback patterns
export const FeedbackHelpers = {
  // Widget-specific feedback
  widgetFeedback(
    widgetId: string,
    frameworkSlug: string,
    comment: string,
    priority: DeveloperFeedback['priority'] = 'medium',
    category: DeveloperFeedback['category'] = 'improvement'
  ): DeveloperFeedback {
    return DeveloperFeedbackAPI.addFeedback({
      type: 'widget',
      targetId: widgetId,
      frameworkSlug,
      location: window.location.pathname,
      comment,
      priority,
      category,
      status: 'open'
    });
  },

  // Section-specific feedback
  sectionFeedback(
    sectionId: string,
    comment: string,
    priority: DeveloperFeedback['priority'] = 'medium',
    category: DeveloperFeedback['category'] = 'improvement'
  ): DeveloperFeedback {
    return DeveloperFeedbackAPI.addFeedback({
      type: 'section',
      targetId: sectionId,
      location: window.location.pathname,
      comment,
      priority,
      category,
      status: 'open'
    });
  },

  // General feedback
  generalFeedback(
    comment: string,
    priority: DeveloperFeedback['priority'] = 'medium',
    category: DeveloperFeedback['category'] = 'improvement'
  ): DeveloperFeedback {
    return DeveloperFeedbackAPI.addFeedback({
      type: 'general',
      targetId: 'general',
      location: window.location.pathname,
      comment,
      priority,
      category,
      status: 'open'
    });
  }
};

// Priority colors for UI
export const getPriorityColor = (priority: DeveloperFeedback['priority']) => {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Status colors for UI
export const getStatusColor = (status: DeveloperFeedback['status']) => {
  switch (status) {
    case 'open': return 'text-blue-600 bg-blue-100';
    case 'in-progress': return 'text-purple-600 bg-purple-100';
    case 'resolved': return 'text-green-600 bg-green-100';
    case 'wont-fix': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Category icons
export const getCategoryIcon = (category: DeveloperFeedback['category']) => {
  switch (category) {
    case 'bug': return '🐛';
    case 'feature': return '✨';
    case 'improvement': return '🔧';
    case 'design': return '🎨';
    case 'performance': return '⚡';
    case 'other': return '📝';
    default: return '📝';
  }
}; 