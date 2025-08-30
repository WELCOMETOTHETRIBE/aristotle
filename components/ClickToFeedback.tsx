'use client';

import { useState, useEffect } from 'react';
import { DeveloperFeedbackAPI } from '@/lib/developer-feedback';

interface ClickToFeedbackProps {
  children: React.ReactNode;
}

export default function ClickToFeedback({ children }: ClickToFeedbackProps) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [isWaitingForClick, setIsWaitingForClick] = useState(false);

  // Check if dev mode is active
  useEffect(() => {
    const checkDevMode = () => {
      const authenticated = sessionStorage.getItem('devAuthenticated') === 'true';
      setIsDevMode(authenticated);
    };

    checkDevMode();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkDevMode();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const interval = setInterval(checkDevMode, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleElementClick = (event: MouseEvent) => {
    if (!isDevMode || !isWaitingForClick) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const elementInfo = {
      tagName: target.tagName,
      className: target.className,
      id: target.id,
      textContent: target.textContent?.slice(0, 100) || '',
      innerHTML: target.innerHTML.slice(0, 200) || '',
      dataset: Object.fromEntries(Object.entries(target.dataset || {})),
      attributes: Array.from(target.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      }))
    };

    // Create feedback
    const feedback = {
      id: `click-feedback-${Date.now()}`,
      timestamp: new Date(),
      type: 'general' as const,
      targetId: target.id || target.className || target.tagName,
      frameworkSlug: undefined,
      location: window.location.pathname,
      comment: `Click-to-feedback on ${elementInfo.tagName}${elementInfo.id ? `#${elementInfo.id}` : ''}${elementInfo.className ? `.${elementInfo.className.split(' ')[0]}` : ''}`,
      priority: 'medium' as const,
      status: 'open' as const,
      category: 'improvement' as const,
      metadata: {
        elementInfo,
        clickPosition: { x: event.clientX, y: event.clientY },
        timestamp: new Date().toISOString()
      }
    };

    DeveloperFeedbackAPI.addFeedback(feedback);
    
    // Show success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]';
    notification.textContent = 'Feedback captured! Check developer dashboard.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);

    setIsWaitingForClick(false);
  };

  const startClickToFeedback = () => {
    if (!isDevMode) return;
    
    setIsWaitingForClick(true);
    
    // Add click listener to document
    document.addEventListener('click', handleElementClick, true);
    
    // Show instruction
    const instruction = document.createElement('div');
    instruction.id = 'click-feedback-instruction';
    instruction.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] text-center';
    instruction.innerHTML = `
      <div class="font-semibold mb-1">Click-to-Feedback Active</div>
      <div class="text-sm">Click any element to capture feedback</div>
      <button id="cancel-click-feedback" class="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs">Cancel</button>
    `;
    document.body.appendChild(instruction);
    
    // Add cancel button listener
    document.getElementById('cancel-click-feedback')?.addEventListener('click', () => {
      stopClickToFeedback();
    });
  };

  const stopClickToFeedback = () => {
    setIsWaitingForClick(false);
    document.removeEventListener('click', handleElementClick, true);
    
    const instruction = document.getElementById('click-feedback-instruction');
    if (instruction) {
      document.body.removeChild(instruction);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopClickToFeedback();
    };
  }, []);

  if (!isDevMode) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Click-to-Feedback Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={isWaitingForClick ? stopClickToFeedback : startClickToFeedback}
          className={`px-3 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium ${
            isWaitingForClick 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={isWaitingForClick ? 'Cancel click-to-feedback' : 'Start click-to-feedback'}
        >
          {isWaitingForClick ? 'Cancel' : 'Click to Feedback'}
        </button>
      </div>
    </>
  );
} 