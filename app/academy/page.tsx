'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/nav/Header';
import { TabBar } from '@/components/nav/TabBar';
import { Sparkles, Brain, Shield, Scale, Leaf, ArrowRight, BookOpen, Target, Heart, Zap, Star, Clock, Lightbulb, MessageCircle, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import PhilosophersJourney from '@/components/PhilosophersJourney';

interface VirtueSpotlight {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  lessons: Lesson[];
  completed: boolean;
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  teaching: string;
  question: string;
  response?: string;
  completed: boolean;
}

const virtueSpotlights: VirtueSpotlight[] = [
  {
    id: 'wisdom',
    name: 'Wisdom',
    description: 'The virtue of knowledge, understanding, and sound judgment',
    icon: Brain,
    color: 'bg-primary/20 text-primary border-primary/30',
    gradient: 'from-primary/20 to-primary/5',
    progress: 0,
    completed: false,
    lessons: [
      {
        id: 'wisdom-1',
        title: 'The Socratic Method',
        teaching: 'Socrates taught that true wisdom begins with recognizing what we do not know. The Socratic method involves asking probing questions to examine our beliefs and assumptions. This practice helps us develop critical thinking and avoid intellectual arrogance.',
        question: 'What is one belief or assumption you hold that you could examine more deeply through questioning?',
        completed: false
      },
      {
        id: 'wisdom-2',
        title: 'The Golden Mean',
        teaching: 'Aristotle\'s concept of the Golden Mean teaches that virtue lies between excess and deficiency. For example, courage is the mean between cowardice (deficiency) and recklessness (excess). This principle helps us find balance in our actions and decisions.',
        question: 'In what area of your life could you apply the Golden Mean to find better balance?',
        completed: false
      },
      {
        id: 'wisdom-3',
        title: 'Contemplative Practice',
        teaching: 'Ancient philosophers emphasized the importance of regular contemplation and reflection. This practice allows us to examine our experiences, learn from them, and develop deeper understanding of ourselves and the world.',
        question: 'How could you incorporate more contemplative time into your daily routine?',
        completed: false
      }
    ]
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'The virtue of fairness, right relationships, and social harmony',
    icon: Scale,
    color: 'bg-justice/20 text-justice border-justice/30',
    gradient: 'from-justice/20 to-justice/5',
    progress: 0,
    completed: false,
    lessons: [
      {
        id: 'justice-1',
        title: 'Fairness in Relationships',
        teaching: 'Justice in relationships means treating others with fairness, respect, and dignity. It involves listening to different perspectives, considering others\' needs, and acting with integrity in our interactions.',
        question: 'How can you practice greater fairness in your relationships with others?',
        completed: false
      },
      {
        id: 'justice-2',
        title: 'Social Responsibility',
        teaching: 'Justice extends beyond individual relationships to our role in society. It calls us to contribute to the common good, stand up for what is right, and work toward a more just and harmonious community.',
        question: 'What is one way you could contribute to creating more justice in your community?',
        completed: false
      },
      {
        id: 'justice-3',
        title: 'Balanced Judgment',
        teaching: 'Just judgment requires us to consider multiple perspectives, examine evidence carefully, and make decisions based on principles rather than personal bias. This practice helps us act with wisdom and fairness.',
        question: 'When making decisions, how could you better consider multiple perspectives?',
        completed: false
      }
    ]
  },
  {
    id: 'courage',
    name: 'Courage',
    description: 'The virtue of facing challenges with strength and determination',
    icon: Shield,
    color: 'bg-courage/20 text-courage border-courage/30',
    gradient: 'from-courage/20 to-courage/5',
    progress: 0,
    completed: false,
    lessons: [
      {
        id: 'courage-1',
        title: 'Facing Fear',
        teaching: 'Courage is not the absence of fear, but the ability to act despite it. Ancient philosophers taught that true courage involves facing our fears with wisdom and determination, rather than avoiding difficult situations.',
        question: 'What fear are you currently facing that requires courage to overcome?',
        completed: false
      },
      {
        id: 'courage-2',
        title: 'Moral Courage',
        teaching: 'Moral courage is the strength to stand up for what is right, even when it is difficult or unpopular. This includes speaking truth to power, defending others, and maintaining our integrity in challenging circumstances.',
        question: 'When have you needed moral courage to stand up for what you believe is right?',
        completed: false
      },
      {
        id: 'courage-3',
        title: 'Perseverance',
        teaching: 'Courage also involves perseverance—the ability to persist through difficulties and setbacks. This virtue helps us maintain our commitment to our goals and values even when progress is slow or obstacles arise.',
        question: 'What goal or value are you committed to that requires perseverance?',
        completed: false
      }
    ]
  },
  {
    id: 'temperance',
    name: 'Temperance',
    description: 'The virtue of self-control, moderation, and inner harmony',
    icon: Leaf,
    color: 'bg-temperance/20 text-temperance border-temperance/30',
    gradient: 'from-temperance/20 to-temperance/5',
    progress: 0,
    completed: false,
    lessons: [
      {
        id: 'temperance-1',
        title: 'Self-Control',
        teaching: 'Temperance involves mastering our desires and impulses through self-discipline. This virtue helps us make choices that align with our long-term well-being rather than giving in to immediate gratification.',
        question: 'What area of your life could benefit from greater self-control?',
        completed: false
      },
      {
        id: 'temperance-2',
        title: 'Moderation',
        teaching: 'The principle of moderation teaches us to find balance in all things—work and rest, activity and reflection, giving and receiving. This balance helps us maintain harmony in our lives and relationships.',
        question: 'Where in your life could you practice greater moderation?',
        completed: false
      },
      {
        id: 'temperance-3',
        title: 'Inner Harmony',
        teaching: 'Temperance leads to inner harmony—a state of peace and balance within ourselves. This involves managing our emotions, thoughts, and actions in ways that promote our well-being and the well-being of others.',
        question: 'What practices help you maintain inner harmony and peace?',
        completed: false
      }
    ]
  },

];

export default function AcademyPage() {
  const { user, loading } = useAuth();
  const [selectedVirtue, setSelectedVirtue] = useState<VirtueSpotlight | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [spotlights, setSpotlights] = useState<VirtueSpotlight[]>(virtueSpotlights);

  // Load saved progress
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      // Authenticated user - load their personal progress
      const savedSpotlights = localStorage.getItem(`academySpotlights_${user.id}`);
      if (savedSpotlights) {
        setSpotlights(JSON.parse(savedSpotlights));
      } else {
        // New authenticated user - start with fresh progress
        setSpotlights(virtueSpotlights);
      }
    } else {
      // Unauthenticated users start with fresh progress
      setSpotlights(virtueSpotlights);
    }
  }, [user, loading]);

  // Save progress
  const saveProgress = (updatedSpotlights: VirtueSpotlight[]) => {
    setSpotlights(updatedSpotlights);
    if (user) {
      localStorage.setItem(`academySpotlights_${user.id}`, JSON.stringify(updatedSpotlights));
    }
  };

  const startVirtueJourney = (virtue: VirtueSpotlight) => {
    setSelectedVirtue(virtue);
    const firstLesson = virtue.lessons.find(lesson => !lesson.completed) || virtue.lessons[0];
    setCurrentLesson(firstLesson);
  };

  const submitResponse = () => {
    if (!userResponse.trim() || !currentLesson || !selectedVirtue) return;

    // Update lesson with response
    const updatedVirtue = {
      ...selectedVirtue,
      lessons: selectedVirtue.lessons.map(lesson =>
        lesson.id === currentLesson.id
          ? { ...lesson, response: userResponse.trim(), completed: true }
          : lesson
      )
    };

    // Calculate progress
    const completedLessons = updatedVirtue.lessons.filter(lesson => lesson.completed).length;
    const progress = Math.round((completedLessons / updatedVirtue.lessons.length) * 100);
    updatedVirtue.progress = progress;
    updatedVirtue.completed = progress === 100;

    // Update spotlights
    const updatedSpotlights = spotlights.map(spotlight =>
      spotlight.id === selectedVirtue.id ? updatedVirtue : spotlight
    );
    saveProgress(updatedSpotlights);

    // Store response for journal integration
    const journalEntry = {
      id: Date.now().toString(),
      title: `${selectedVirtue.name} Spotlight: ${currentLesson.title}`,
      content: `Teaching: ${currentLesson.teaching}\n\nQuestion: ${currentLesson.question}\n\nMy Response: ${userResponse.trim()}`,
      timestamp: new Date(),
      tags: ['academy', selectedVirtue.id.toLowerCase(), 'virtue-learning'],
      virtue: selectedVirtue.id
    };

    if (user) {
      // Authenticated user - save to user-specific storage
      const existingEntries = localStorage.getItem(`journalEntries_${user.id}`) || '[]';
      const entries = JSON.parse(existingEntries);
      entries.unshift(journalEntry);
      localStorage.setItem(`journalEntries_${user.id}`, JSON.stringify(entries));
    }

    setUserResponse('');
    
    // Move to next lesson or complete virtue
    const nextLesson = updatedVirtue.lessons.find(lesson => !lesson.completed);
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    } else {
      setCurrentLesson(null);
      setSelectedVirtue(null);
    }
  };

  const getVirtueIcon = (virtueId: string) => {
    switch (virtueId) {
      case 'wisdom': return Brain;
      case 'justice': return Scale;
      case 'courage': return Shield;
      case 'temperance': return Leaf;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <Header focusVirtue="wisdom" />
      
      <main className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Academy</h1>
          <p className="text-muted">Master the four cardinal virtues through guided learning journeys</p>
        </div>

        {!selectedVirtue ? (
          /* Virtue Selection */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spotlights.map((virtue) => {
                const IconComponent = virtue.icon;
                return (
                  <button
                    key={virtue.id}
                    onClick={() => startVirtueJourney(virtue)}
                    className="p-6 bg-surface border border-border rounded-2xl hover:bg-surface-2 transition-all duration-200 hover:scale-105 text-left group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', virtue.color)}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-text mb-1">{virtue.name}</h3>
                        <p className="text-sm text-muted">{virtue.description}</p>
                      </div>
                      {virtue.completed && (
                        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-success" />
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Progress</span>
                        <span className="font-medium text-text">{virtue.progress}%</span>
                      </div>
                      <div className="w-full bg-surface-2 rounded-full h-2">
                        <div 
                          className={cn(
                            'h-2 rounded-full transition-all duration-500',
                            virtue.id === 'wisdom' ? 'bg-primary' :
                            virtue.id === 'justice' ? 'bg-justice' :
                            virtue.id === 'courage' ? 'bg-courage' :
                            'bg-temperance'
                          )}
                          style={{ width: `${virtue.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Lesson Preview */}
                    <div className="mt-4 space-y-2">
                      {virtue.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center space-x-2">
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                            lesson.completed 
                              ? 'bg-success/20 text-success' 
                              : 'bg-surface-2 text-muted'
                          )}>
                            {lesson.completed ? '✓' : index + 1}
                          </div>
                          <span className={cn(
                            'text-sm',
                            lesson.completed ? 'text-success' : 'text-muted'
                          )}>
                            {lesson.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {virtue.lessons.filter(l => l.completed).length} of {virtue.lessons.length} lessons
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Lesson Interface */
          <div className="space-y-6">
            {/* Virtue Header */}
            <div className="flex items-center justify-between p-6 bg-surface border border-border rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', selectedVirtue.color)}>
                  {(() => {
                    const IconComponent = selectedVirtue.icon;
                    return <IconComponent className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{selectedVirtue.name} Spotlight</h2>
                  <p className="text-sm text-muted">{selectedVirtue.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedVirtue(null);
                  setCurrentLesson(null);
                }}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                Back to Virtues
              </button>
            </div>

            {currentLesson && (
              <div className="space-y-6">
                {/* Lesson Content */}
                <div className="bg-gradient-to-br from-surface via-surface to-surface-2 border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text">{currentLesson.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-surface-2 border border-border rounded-xl p-4">
                      <h4 className="font-medium text-text mb-2">Teaching</h4>
                      <p className="text-sm text-muted leading-relaxed">{currentLesson.teaching}</p>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <h4 className="font-medium text-primary mb-2">Reflection Question</h4>
                      <p className="text-sm text-text leading-relaxed">{currentLesson.question}</p>
                    </div>
                  </div>
                </div>

                {/* Response Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-courage/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-courage" />
                    </div>
                    <h3 className="font-semibold text-text">Your Response</h3>
                  </div>
                  
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Share your thoughts and reflections..."
                    className="w-full p-4 bg-surface border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    rows={4}
                  />
                  
                  <button
                    onClick={submitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Continue Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

                   <PhilosophersJourney />
      <TabBar />
    </div>
  );
} 