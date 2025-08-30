'use client';

import { useState } from 'react';
import { CheckCircle, Clock, Target, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Quest } from '@/lib/quest-engine';
import { getVirtueEmoji, getVirtueColor } from '@/lib/virtue';

interface QuestDeckProps {
  quests: Quest[];
  completedWidgets: string[];
  onQuestComplete?: (questId: string) => void;
}

export default function QuestDeck({ quests, completedWidgets, onQuestComplete }: QuestDeckProps) {
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);

  const getQuestProgress = (quest: Quest) => {
    const completedCount = quest.widgetIds.filter(widgetId => 
      completedWidgets.includes(widgetId)
    ).length;
    return (completedCount / quest.widgetIds.length) * 100;
  };

  const isQuestComplete = (quest: Quest) => {
    return quest.widgetIds.every(widgetId => 
      completedWidgets.includes(widgetId)
    );
  };

  const getVirtueDisplay = (virtues: any) => {
    return Object.entries(virtues).map(([virtue, xp]) => (
      <span 
        key={virtue}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getVirtueColor(virtue as any)}`}
      >
        {getVirtueEmoji(virtue as any)} {xp as number} XP
      </span>
    ));
  };

  const nextQuest = () => {
    setCurrentQuestIndex((prev) => (prev + 1) % quests.length);
  };

  const prevQuest = () => {
    setCurrentQuestIndex((prev) => (prev - 1 + quests.length) % quests.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Today's Quest Deck</h2>
      </div>

      {/* Quest Gallery */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevQuest}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          disabled={quests.length <= 1}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <button
          onClick={nextQuest}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          disabled={quests.length <= 1}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Quest Cards Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentQuestIndex * 100}%)` }}
          >
            {quests.map((quest) => {
              const progress = getQuestProgress(quest);
              const complete = isQuestComplete(quest);
              
              return (
                <div key={quest.id} className="w-full flex-shrink-0 px-4">
                  <GlassCard
                    title={quest.title}
                    action={
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{quest.minutes}m</span>
                      </div>
                    }
                    className={`transition-all duration-300 ${
                      complete ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      complete 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{progress.toFixed(0)}% complete</span>
                  <span>{quest.widgetIds.length} widgets</span>
                </div>
              </div>

              {/* Virtue Rewards */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Virtue Rewards:</h4>
                <div className="flex flex-wrap gap-2">
                  {getVirtueDisplay(quest.virtueGrants)}
                </div>
              </div>

              {/* Widget List */}
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Widgets:</h4>
                <div className="space-y-2">
                  {quest.widgetIds.map((widgetId) => {
                    const isCompleted = completedWidgets.includes(widgetId);
                    return (
                      <div 
                        key={widgetId}
                        className={`flex items-center gap-2 p-2 rounded ${
                          isCompleted ? 'bg-green-900/20' : 'bg-gray-700/20'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Target className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${
                          isCompleted ? 'text-green-400' : 'text-gray-300'
                        }`}>
                          {widgetId.replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complete Status */}
              {complete && (
                <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Quest Complete!</span>
                  </div>
                </div>
              )}
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        {quests.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {quests.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuestIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-400">Total Time: </span>
            <span className="text-white font-medium">
              {quests.reduce((sum, quest) => sum + quest.minutes, 0)} minutes
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Completed: </span>
            <span className="text-white font-medium">
              {quests.filter(q => isQuestComplete(q)).length} / {quests.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 