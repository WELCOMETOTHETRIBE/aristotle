'use client';

import { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';

interface ClickToFeedbackProps {
  children: React.ReactNode;
}

export default function ClickToFeedback({ children }: ClickToFeedbackProps) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [isWaitingForClick, setIsWaitingForClick] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedElementInfo, setSelectedElementInfo] = useState<any>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

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
    console.log('Element clicked:', { isDevMode, isWaitingForClick, target: event.target });
    
    if (!isDevMode || !isWaitingForClick) {
      console.log('Click ignored - dev mode or waiting state not active');
      return;
    }

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

    console.log('Opening feedback modal with element info:', elementInfo);

    // Set element info and open modal
    setSelectedElementInfo(elementInfo);
    setClickPosition({ x: event.clientX, y: event.clientY });
    setFeedbackModalOpen(true);
    setIsWaitingForClick(false);
  };

  const startClickToFeedback = () => {
    if (!isDevMode) {
      console.log('Dev mode not active, cannot start click-to-feedback');
      return;
    }
    
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
    
    console.log('Click-to-feedback mode activated');
  };

  const stopClickToFeedback = () => {
    setIsWaitingForClick(false);
    document.removeEventListener('click', handleElementClick, true);
    
    const instruction = document.getElementById('click-feedback-instruction');
    if (instruction) {
      document.body.removeChild(instruction);
    }
  };

  // Listen for custom events and cleanup on unmount
  useEffect(() => {
    const handleStartClickToFeedback = () => {
      // Re-check dev mode when the event is triggered
      const authenticated = sessionStorage.getItem('devAuthenticated') === 'true';
      setIsDevMode(authenticated);
      
      if (authenticated) {
        startClickToFeedback();
      } else {
        console.log('Dev mode not active, cannot start click-to-feedback');
      }
    };

    window.addEventListener('startClickToFeedback', handleStartClickToFeedback);
    
    return () => {
      window.removeEventListener('startClickToFeedback', handleStartClickToFeedback);
      stopClickToFeedback();
    };
  }, []);

  if (!isDevMode) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {/* Dev mode indicator */}
      <div className="fixed bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg z-50">
        Dev Mode Active
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        elementInfo={selectedElementInfo}
        clickPosition={clickPosition}
      />
    </>
  );
} 