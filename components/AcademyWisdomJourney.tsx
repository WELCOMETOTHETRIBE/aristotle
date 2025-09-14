'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  FileText, 
  CheckCircle, 
  Circle, 
  Star, 
  Sparkles,
  Brain,
  Target,
  MessageCircle,
  Quote,
  Lightbulb,
  Award,
  Eye,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AcademyAI from './AcademyAI';

interface AcademyWisdomJourneyProps {
  lesson: any;
  path: any;
  userProgress: any;
  onComplete: (lessonId: string, data: any) => void;
  onBack: () => void;
}

export default function AcademyWisdomJourney({
  lesson,
  path,
  userProgress,
  onComplete,
  onBack
}: AcademyWisdomJourneyProps) {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [showScholarMode, setShowScholarMode] = useState(false);
  const [showAgora, setShowAgora] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [artifacts, setArtifacts] = useState<Record<string, any>>({});
  const [showAI, setShowAI] = useState(false);
  const [aiMode, setAiMode] = useState<'tutor' | 'evaluator' | 'coach'>('tutor');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize responses from saved progress
  useEffect(() => {
    if (userProgress[lesson.id]?.data) {
      setUserResponses(userProgress[lesson.id].data.responses || {});
      setArtifacts(userProgress[lesson.id].data.artifacts || {});
      setCompletedActivities(new Set(userProgress[lesson.id].data.completedActivities || []));
    }
  }, [lesson.id, userProgress]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setUserResponses(prev => ({
          ...prev,
          [`activity_${currentActivity}_audio`]: audioUrl
        }));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleTextResponse = (activityId: string, response: string) => {
    setUserResponses(prev => ({
      ...prev,
      [activityId]: response
    }));
  };

  const handleQuizAnswer = (activityId: string, answer: string) => {
    setUserResponses(prev => ({
      ...prev,
      [activityId]: answer
    }));
  };

  const completeActivity = (activityId: string) => {
    setCompletedActivities(prev => new Set([...prev, activityId]));
    
    // Generate artifact if this activity produces one
    const activity = lesson.activities.find((a: any) => a.id === activityId);
    if (activity && lesson.artifacts?.includes(activity.type)) {
      const artifact = {
        id: activityId,
        type: activity.type,
        content: userResponses[activityId],
        timestamp: new Date().toISOString(),
        lessonId: lesson.id
      };
      setArtifacts(prev => ({
        ...prev,
        [activityId]: artifact
      }));
    }
  };

  const canCompleteLesson = () => {
    return lesson.activities.every((activity: any) => 
      completedActivities.has(activity.id) || 
      (activity.type === 'reflection' && userResponses[activity.id]?.trim()) ||
      (activity.type === 'voice_note' && userResponses[`activity_${lesson.activities.indexOf(activity)}_audio`]) ||
      (activity.type === 'quiz' && userResponses[activity.id])
    );
  };

  const completeLesson = () => {
    if (canCompleteLesson()) {
      onComplete(lesson.id, {
        responses: userResponses,
        artifacts,
        completedActivities: Array.from(completedActivities),
        completedAt: new Date().toISOString()
      });
    }
  };

  const renderActivity = (activity: any, index: number) => {
    const activityId = activity.id;
    const isCompleted = completedActivities.has(activityId);
    const userResponse = userResponses[activityId];

    switch (activity.type) {
      case 'voice_note':
        return (
          <div key={activityId} className="p-6 bg-surface border border-border rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Voice Note</h4>
                <p className="text-sm text-muted">Record your response</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-text mb-2">{activity.prompt}</p>
              <p className="text-xs text-muted">Max {activity.max_seconds} seconds</p>
            </div>

            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </button>
              )}
              
              {userResponses[`activity_${index}_audio`] && (
                <div className="flex items-center space-x-2">
                  <audio controls className="h-8">
                    <source src={userResponses[`activity_${index}_audio`]} type="audio/wav" />
                  </audio>
                  <button
                    onClick={() => completeActivity(activityId)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'reflection':
        return (
          <div key={activityId} className="p-6 bg-surface border border-border rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Reflection</h4>
                <p className="text-sm text-muted">Share your thoughts</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-text mb-2">{activity.prompt}</p>
              <p className="text-xs text-muted">Max {activity.input?.max_len} characters</p>
            </div>

            <textarea
              value={userResponse || ''}
              onChange={(e) => handleTextResponse(activityId, e.target.value)}
              className="w-full p-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted resize-none"
              rows={4}
              placeholder="Share your reflection..."
              maxLength={activity.input?.max_len}
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted">
                {userResponse?.length || 0} / {activity.input?.max_len} characters
              </span>
              <button
                onClick={() => completeActivity(activityId)}
                disabled={!userResponse?.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  userResponse?.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-surface-2 text-muted cursor-not-allowed'
                )}
              >
                Complete
              </button>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div key={activityId} className="p-6 bg-surface border border-border rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Quiz</h4>
                <p className="text-sm text-muted">{activity.instructions}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {activity.questions?.map((question: any, qIndex: number) => (
                <div key={qIndex} className="space-y-3">
                  <p className="text-text font-medium">{question.stem}</p>
                  <div className="space-y-2">
                    {question.choices.map((choice: string, cIndex: number) => (
                      <button
                        key={cIndex}
                        onClick={() => handleQuizAnswer(activityId, choice)}
                        className={cn(
                          'w-full p-3 text-left rounded-lg border transition-colors',
                          userResponse === choice
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-surface-2 hover:bg-surface-3 text-text'
                        )}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => completeActivity(activityId)}
                disabled={!userResponse}
                className={cn(
                  'w-full py-2 rounded-lg font-medium transition-colors',
                  userResponse
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-surface-2 text-muted cursor-not-allowed'
                )}
              >
                Submit Answer
              </button>
            </div>
          </div>
        );

      case 'interactive_story':
        return (
          <div key={activityId} className="p-6 bg-surface border border-border rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Interactive Story</h4>
                <p className="text-sm text-muted">{activity.title}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activity.steps.map((step: string, sIndex: number) => (
                  <div
                    key={sIndex}
                    className={cn(
                      'p-3 rounded-lg border text-center transition-colors',
                      userResponse === step
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                        : 'border-border bg-surface-2 text-muted'
                    )}
                  >
                    <div className="text-sm font-medium">{step}</div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted">
                Click through the story steps to experience {activity.title}
              </p>
              
              <button
                onClick={() => completeActivity(activityId)}
                disabled={!userResponse}
                className={cn(
                  'w-full py-2 rounded-lg font-medium transition-colors',
                  userResponse
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-surface-2 text-muted cursor-not-allowed'
                )}
              >
                Complete Story
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div key={activityId} className="p-6 bg-surface border border-border rounded-xl">
            <p className="text-muted">Unknown activity type: {activity.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="flex items-center justify-between p-6 bg-surface border border-border rounded-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{lesson.title}</h2>
            <p className="text-sm text-muted">
              {path.title} • {lesson.time_minutes} minutes
            </p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-muted">
              <span>Lesson {path.lessons.findIndex((l: any) => l.id === lesson.id) + 1} of {path.lessons.length}</span>
              <span>•</span>
              <span>{lesson.objectives.length} objectives</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Paths</span>
        </button>
      </div>

      {/* Lesson Objectives */}
      <div className="p-6 bg-surface border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-text mb-4">Learning Objectives</h3>
        <div className="space-y-2">
          {lesson.objectives.map((objective: string, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-text">{objective}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Intro */}
      {lesson.narrative?.intro && (
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <Quote className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-text italic">{lesson.narrative.intro}</p>
            </div>
          </div>
        </div>
      )}

      {/* Activities */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-text">Activities</h3>
        {lesson.activities.map((activity: any, index: number) => (
          <div key={activity.id}>
            {renderActivity(activity, index)}
          </div>
        ))}
      </div>

      {/* Modern Payoff */}
      {lesson.modern_payoff && (
        <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-text mb-1">Modern Application</h4>
              <p className="text-text">{lesson.modern_payoff}</p>
            </div>
          </div>
        </div>
      )}

      {/* Scholar Mode */}
      {lesson.scholar_mode && (
        <div className="p-6 bg-surface border border-border rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Scholar Mode</h4>
                <p className="text-sm text-muted">{lesson.scholar_mode.estimated_minutes} minutes</p>
              </div>
            </div>
            <button
              onClick={() => setShowScholarMode(!showScholarMode)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {showScholarMode ? 'Hide' : 'Show'} Scholar Mode
            </button>
          </div>
          
          {showScholarMode && (
            <div className="space-y-4">
              <p className="text-text">{lesson.scholar_mode.exercise}</p>
              <div className="p-4 bg-surface-2 rounded-lg">
                <p className="text-sm text-muted italic">
                  "{lesson.scholar_mode.ai_prompt}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agora */}
      {lesson.agora && (
        <div className="p-6 bg-surface border border-border rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Agora Sharing</h4>
                <p className="text-sm text-muted">Share with the community</p>
              </div>
            </div>
            <button
              onClick={() => setShowAgora(!showAgora)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showAgora ? 'Hide' : 'Show'} Agora
            </button>
          </div>
          
          {showAgora && (
            <div className="space-y-4">
              <p className="text-text">{lesson.agora.prompt}</p>
              <textarea
                className="w-full p-3 bg-surface-2 border border-border rounded-lg text-text placeholder-muted resize-none"
                rows={3}
                placeholder="Share your insight with the community..."
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Share to Agora
              </button>
            </div>
          )}
        </div>
      )}

      {/* Narrative Outro */}
      {lesson.narrative?.outro && (
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <Quote className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-text italic">{lesson.narrative.outro}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Guidance Section */}
      <div className="p-6 bg-surface border border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text">AI Guidance</h3>
            <p className="text-sm text-muted">Get personalized guidance from Plato's Academy</p>
          </div>
          <button
            onClick={() => setShowAI(!showAI)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showAI ? 'Hide' : 'Show'} AI Guidance
          </button>
        </div>
        
        {showAI && (
          <div className="space-y-4">
            {/* AI Mode Selection */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAiMode('tutor')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  aiMode === 'tutor' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-surface-2 text-muted hover:text-text'
                )}
              >
                Tutor
              </button>
              <button
                onClick={() => setAiMode('evaluator')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  aiMode === 'evaluator' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-surface-2 text-muted hover:text-text'
                )}
              >
                Evaluator
              </button>
              <button
                onClick={() => setAiMode('coach')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  aiMode === 'coach' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-surface-2 text-muted hover:text-text'
                )}
              >
                Coach
              </button>
            </div>
            
            {/* AI Component */}
            <AcademyAI
              mode={aiMode}
              lesson={lesson}
              userResponse={Object.values(userResponses)[0]}
              onResponse={(response) => {
                console.log('AI Response:', response);
              }}
            />
          </div>
        )}
      </div>

      {/* Lesson Completion */}
      <div className="flex items-center justify-between p-6 bg-surface border border-border rounded-xl">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted">
            {completedActivities.size} of {lesson.activities.length} activities completed
          </div>
          <div className="w-32 bg-surface-2 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedActivities.size / lesson.activities.length) * 100}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={completeLesson}
          disabled={!canCompleteLesson()}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors',
            canCompleteLesson()
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
              : 'bg-surface-2 text-muted cursor-not-allowed'
          )}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Complete Lesson</span>
        </button>
      </div>
    </div>
  );
}
