"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Star, ChevronRight, Play, CheckCircle, Award } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { learningResources, getResourceById } from "@/lib/learning-resources";
import { LearningResource } from "@/lib/types";

interface ResourceSpotlightProps {
  className?: string;
}

export function ResourceSpotlight({ className = "" }: ResourceSpotlightProps) {
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const featuredResource = learningResources[0]; // Meditations by default

  const handleStartLearning = (resource: LearningResource) => {
    setSelectedResource(resource);
    setIsLearningMode(true);
    setCurrentLessonIndex(0);
  };

  const handleNextLesson = () => {
    if (selectedResource && currentLessonIndex < selectedResource.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleCompleteLesson = () => {
    if (selectedResource) {
      // In a real app, this would save to the database
      const updatedResource = {
        ...selectedResource,
        lessons: selectedResource.lessons.map((lesson, index) => 
          index === currentLessonIndex ? { ...lesson, isCompleted: true } : lesson
        )
      };
      setSelectedResource(updatedResource);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-muted';
    }
  };

  if (isLearningMode && selectedResource) {
    const currentLesson = selectedResource.lessons[currentLessonIndex];
    const progress = ((currentLessonIndex + 1) / selectedResource.lessons.length) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedResource.title}</h2>
                <p className="text-muted">by {selectedResource.author}</p>
              </div>
              <button
                onClick={() => setIsLearningMode(false)}
                className="text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>Lesson {currentLessonIndex + 1} of {selectedResource.lessons.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">{currentLesson.title}</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-secondary leading-relaxed font-sans">
                  {currentLesson.content}
                </pre>
              </div>
            </div>

            {/* Reflection Questions */}
            {currentLesson.questions && currentLesson.questions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Reflection Questions</h4>
                {currentLesson.questions.map((question, index) => (
                  <div key={question.id} className="bg-white/5 rounded-xl p-4">
                    <p className="text-white mb-3">{question.question}</p>
                    {question.type === 'text' && (
                      <textarea
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-muted"
                        placeholder="Write your reflection here..."
                        rows={3}
                      />
                    )}
                    {question.type === 'rating' && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent transition-colors text-white"
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Practices */}
            {currentLesson.practices && currentLesson.practices.length > 0 && (
              <div className="space-y-4 mt-6">
                <h4 className="text-lg font-semibold text-white">Practices</h4>
                {currentLesson.practices.map((practice) => (
                  <div key={practice.id} className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-2">{practice.title}</h5>
                    <p className="text-secondary mb-3">{practice.description}</p>
                    <div className="space-y-2">
                      {practice.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-accent text-black text-sm font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-secondary">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePreviousLesson}
              disabled={currentLessonIndex === 0}
              className="btn-high-contrast disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-3">
              {currentLesson.isCompleted && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle size={16} />
                  <span className="text-sm">Completed</span>
                </div>
              )}
              <button
                onClick={handleCompleteLesson}
                className="btn-primary-light"
              >
                {currentLesson.isCompleted ? 'Continue' : 'Complete Lesson'}
              </button>
            </div>

            <button
              onClick={handleNextLesson}
              disabled={currentLessonIndex === selectedResource.lessons.length - 1}
              className="btn-high-contrast disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <GlassCard 
      title="Resource Spotlight" 
      subtitle="Today's wisdom"
      action={
        <BookOpen size={18} className="text-accent" />
      }
      className={`col-span-full ${className}`}
    >
      <div className="space-y-6">
        {/* Featured Resource */}
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg">
            <BookOpen size={28} className="text-black" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {featuredResource.title}
              </h3>
              <p className="text-secondary leading-relaxed mb-3">
                {featuredResource.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span>by {featuredResource.author}</span>
                <span className={`${getDifficultyColor(featuredResource.difficulty)}`}>
                  {featuredResource.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {featuredResource.estimatedTime} min
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleStartLearning(featuredResource)}
                className="btn-primary-light flex items-center gap-2"
              >
                <Play size={16} />
                Start Learning
              </button>
              <button className="btn-high-contrast">Learn More</button>
            </div>
          </div>
        </div>

        {/* All Resources Grid */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">All Resources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningResources.map((resource) => (
              <motion.div
                key={resource.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => handleStartLearning(resource)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-white">{resource.title}</h5>
                    <p className="text-sm text-muted">by {resource.author}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted" />
                </div>
                <p className="text-sm text-secondary mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className={`${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {resource.estimatedTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    {resource.lessons.length} lessons
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
} 