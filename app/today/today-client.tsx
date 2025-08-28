"use client";

import { Button } from "@/components/ui/button";

interface TodayClientProps {
  module: any;
}

export function TodayClient({ module }: TodayClientProps) {
  const handleGeneratePractice = async () => {
    try {
      const response = await fetch(
        `/api/generate/practice?moduleId=${module.id}&level=Beginner&style=stoic`
      );
      const data = await response.json();
      console.log('Practice generated:', data);
      alert('Practice generated! Check console for details.');
    } catch (error) {
      console.error('Error generating practice:', error);
      alert('Error generating practice. Please try again.');
    }
  };

  const handleStartSession = async () => {
    try {
      const response = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: module.id })
      });
      const data = await response.json();
      console.log('Session started:', data);
      alert(`Session started! Session ID: ${data.sessionId}`);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session. Please try again.');
    }
  };

  const handleGenerateWisdom = async () => {
    try {
      const response = await fetch('/api/generate/hidden-wisdom?style=stoic');
      const data = await response.json();
      console.log('Hidden wisdom:', data);
      alert('Wisdom generated! Check console for details.');
    } catch (error) {
      console.error('Error generating wisdom:', error);
      alert('Error generating wisdom. Please try again.');
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        className="w-full"
        onClick={handleGeneratePractice}
      >
        Generate Practice
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleStartSession}
      >
        Start Session
      </Button>
    </div>
  );
}

export function WisdomClient() {
  const handleGenerateWisdom = async () => {
    try {
      const response = await fetch('/api/generate/hidden-wisdom?style=stoic');
      const data = await response.json();
      console.log('Hidden wisdom:', data);
      alert('Wisdom generated! Check console for details.');
    } catch (error) {
      console.error('Error generating wisdom:', error);
      alert('Error generating wisdom. Please try again.');
    }
  };

  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">Loading today's wisdom...</p>
      <Button onClick={handleGenerateWisdom}>
        Generate Wisdom
      </Button>
    </div>
  );
} 