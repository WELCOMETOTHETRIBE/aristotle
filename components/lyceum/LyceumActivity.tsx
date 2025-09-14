'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Camera,
  Mic,
  Sliders,
  Brain,
  MessageSquare,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Activity } from '@/lib/lyceum-data';

interface LyceumActivityProps {
  activity: Activity;
  onComplete: (response: any) => void;
  isLastActivity: boolean;
}

export default function LyceumActivity({ activity, onComplete, isLastActivity }: LyceumActivityProps) {
  const [response, setResponse] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (response) {
      setIsSubmitted(true);
      onComplete(response);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'drag_drop_categorize':
        return Brain;
      case 'reflection':
        return MessageSquare;
      case 'quiz':
        return CheckCircle;
      case 'photo_capture':
        return Camera;
      case 'slider':
        return Sliders;
      case 'voice_note':
        return Mic;
      default:
        return Brain;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'drag_drop_categorize':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'reflection':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'quiz':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'photo_capture':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'slider':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'voice_note':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const ActivityIcon = getActivityIcon(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl p-6"
    >
      {/* Activity Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          getActivityColor(activity.type)
        )}>
          <ActivityIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">Activity: {activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
          <p className="text-sm text-muted">{activity.instructions}</p>
        </div>
      </div>

      {/* Activity Content */}
      <div className="space-y-4">
        {activity.type === 'drag_drop_categorize' && (
          <DragDropCategorizeActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}

        {activity.type === 'reflection' && (
          <ReflectionActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}

        {activity.type === 'quiz' && (
          <QuizActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}

        {activity.type === 'photo_capture' && (
          <PhotoCaptureActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}

        {activity.type === 'slider' && (
          <SliderActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}

        {activity.type === 'voice_note' && (
          <VoiceNoteActivity
            activity={activity}
            onResponse={setResponse}
          />
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!response || isSubmitted}
          className={cn(
            'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2',
            response && !isSubmitted
              ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
              : 'bg-surface-2 text-muted cursor-not-allowed'
          )}
        >
          <span>{isLastActivity ? 'Complete Lesson' : 'Next Activity'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Individual Activity Components

function DragDropCategorizeActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [categorizations, setCategorizations] = useState<{ [key: string]: string }>({});

  const handleCategorize = (item: string, category: string) => {
    const newCategorizations = { ...categorizations, [item]: category };
    setCategorizations(newCategorizations);
    onResponse(newCategorizations);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Items to categorize */}
        <div>
          <h4 className="font-medium text-text mb-3">Items to Categorize</h4>
          <div className="space-y-2">
            {activity.items?.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-surface-2 rounded-lg border border-border cursor-pointer hover:bg-surface-3 transition-colors"
                onClick={() => {
                  // Simple click to cycle through categories
                  const currentCategory = categorizations[item];
                  const categoryIndex = activity.categories?.indexOf(currentCategory) || -1;
                  const nextCategory = activity.categories?.[(categoryIndex + 1) % (activity.categories?.length || 1)];
                  if (nextCategory) {
                    handleCategorize(item, nextCategory);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-text">{item}</span>
                  <span className="text-sm text-primary">
                    {categorizations[item] || 'Click to categorize'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-text mb-3">Categories</h4>
          <div className="space-y-2">
            {activity.categories?.map((category, index) => (
              <div key={index} className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-primary font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReflectionActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [text, setText] = useState('');

  const handleTextChange = (value: string) => {
    setText(value);
    onResponse({ text: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          {activity.prompt}
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          maxLength={activity.input?.max_len || 500}
          className="w-full p-4 bg-surface-2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none"
          rows={4}
          placeholder="Share your thoughts..."
        />
        <div className="text-xs text-muted mt-1">
          {text.length}/{activity.input?.max_len || 500} characters
        </div>
      </div>
    </div>
  );
}

function QuizActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = { ...answers, [questionIndex]: answer };
    setAnswers(newAnswers);
    onResponse(newAnswers);
  };

  return (
    <div className="space-y-6">
      {activity.questions?.map((question, index) => (
        <div key={index} className="space-y-3">
          <h4 className="font-medium text-text">{question.stem}</h4>
          <div className="space-y-2">
            {question.choices?.map((choice, choiceIndex) => (
              <button
                key={choiceIndex}
                onClick={() => handleAnswer(index, choice)}
                className={cn(
                  'w-full p-3 text-left rounded-lg border transition-colors',
                  answers[index] === choice
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface-2 text-text hover:bg-surface-3'
                )}
              >
                {choice}
              </button>
            ))}
          </div>
          {/* Show correct answer if provided */}
          {question.answer && (
            <div className="text-xs text-muted mt-2">
              Correct answer: {question.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PhotoCaptureActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhoto(result);
        onResponse({ 
          photo: result, 
          filename: file.name,
          timestamp: new Date().toISOString(),
          analysis: 'Photo captured successfully. AI analysis would be performed here.'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // For now, we'll simulate camera capture
      setTimeout(() => {
        const mockPhoto = 'data:image/jpeg;base64,mock-camera-photo-data';
        setPhoto(mockPhoto);
        onResponse({ 
          photo: mockPhoto, 
          source: 'camera',
          timestamp: new Date().toISOString(),
          analysis: 'Photo captured from camera. AI analysis would be performed here.'
        });
        setIsCapturing(false);
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    } catch (error) {
      console.error('Camera access denied:', error);
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-surface-2 border-2 border-dashed border-border rounded-lg flex items-center justify-center mx-auto mb-4">
          {photo ? (
            <div className="w-full h-full bg-primary/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          ) : (
            <Camera className="w-8 h-8 text-muted" />
          )}
        </div>
        
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Upload Photo
          </label>
          
          <button
            onClick={handleCameraCapture}
            disabled={isCapturing}
            className={cn(
              'block mx-auto px-4 py-2 rounded-lg transition-colors',
              isCapturing
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-surface-2 text-text hover:bg-surface-3'
            )}
          >
            {isCapturing ? 'Capturing...' : 'Use Camera'}
          </button>
        </div>
        
        <p className="text-sm text-muted mt-2">
          {activity.instructions || 'Capture or upload a photo related to this lesson.'}
        </p>
      </div>
    </div>
  );
}

function SliderActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [values, setValues] = useState<{ [key: string]: number }>({});

  const handleSliderChange = (virtueName: string, value: number) => {
    const newValues = { ...values, [virtueName]: value };
    setValues(newValues);
    onResponse(newValues);
  };

  return (
    <div className="space-y-6">
      {activity.virtues?.map((virtue, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">{virtue.name}</span>
            <span className="text-sm text-muted">{values[virtue.name] || virtue.start}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted">
              <span>{virtue.min_label}</span>
              <span>{virtue.max_label}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={values[virtue.name] || virtue.start}
              onChange={(e) => handleSliderChange(virtue.name, parseInt(e.target.value))}
              className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function VoiceNoteActivity({ activity, onResponse }: { activity: Activity; onResponse: (response: any) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        onResponse({ 
          audio: blob, 
          duration: recordingTime,
          timestamp: new Date().toISOString(),
          transcription: 'Voice note recorded. Transcription would be performed here.'
        });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioChunks(chunks);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (activity.max_seconds && newTime >= activity.max_seconds) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      // Store timer for cleanup
      (recorder as any).timer = timer;
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if ((mediaRecorder as any).timer) {
        clearInterval((mediaRecorder as any).timer);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-surface-2 border-2 border-dashed border-border rounded-full flex items-center justify-center mx-auto mb-4">
          {isRecording ? (
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
          ) : audioBlob ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Mic className="w-8 h-8 text-muted" />
          )}
        </div>
        
        {isRecording && (
          <div className="text-lg font-mono text-red-500 mb-2">
            {formatTime(recordingTime)}
          </div>
        )}
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            'px-6 py-3 rounded-lg font-semibold transition-colors',
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary text-white hover:bg-primary/90'
          )}
        >
          {isRecording ? 'Stop Recording' : audioBlob ? 'Re-record' : 'Start Recording'}
        </button>
        
        <p className="text-sm text-muted mt-2">
          {activity.prompt || 'Record a voice note sharing your thoughts on this lesson.'}
        </p>
        {activity.max_seconds && (
          <p className="text-xs text-muted">
            Maximum duration: {activity.max_seconds} seconds
          </p>
        )}
      </div>
    </div>
  );
}
