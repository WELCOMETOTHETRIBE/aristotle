"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Star, ChevronRight, Play, CheckCircle, Award, ExternalLink, RefreshCw, Sparkles, Heart, Target, Users, Zap } from "lucide-react";

interface FrameworkResourceSpotlightProps {
  frameworkId: string;
  frameworkName: string;
  frameworkTone: string;
}

interface Resource {
  id: string;
  title: string;
  thinker?: string;
  era?: string;
  type: string;
  estMinutes?: number;
  keyIdeas?: string[];
  microPractices?: string[];
  reflections?: string[];
  level?: string;
  audioUrl?: string;
  description?: string;
  tags?: string[];
  externalLinks?: Array<{
    title: string;
    url: string;
    type: 'book' | 'video' | 'article' | 'podcast';
  }>;
  relatedResources?: string[];
  completionRate?: number;
  userRating?: number;
}

interface LearningSession {
  resourceId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  notes?: string;
  rating?: number;
}

export default function FrameworkResourceSpotlight({
  frameworkId,
  frameworkName,
  frameworkTone
}: FrameworkResourceSpotlightProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [userSessions, setUserSessions] = useState<LearningSession[]>([]);
  const [showAllResources, setShowAllResources] = useState(false);

  // Load user's learning sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem(`learning-sessions-${frameworkId}`);
    if (savedSessions) {
      setUserSessions(JSON.parse(savedSessions));
    }
  }, [frameworkId]);

  // Save user sessions to localStorage
  useEffect(() => {
    localStorage.setItem(`learning-sessions-${frameworkId}`, JSON.stringify(userSessions));
  }, [userSessions, frameworkId]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get static resources
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allResources = await response.json();

        // Filter resources based on framework
        const frameworkResources = allResources.filter((resource: Resource) => {
          const title = resource.title.toLowerCase();
          const thinker = resource.thinker?.toLowerCase() || '';
          const type = resource.type.toLowerCase();

          // Framework-specific filtering logic
          const frameworkFilter = () => {
            switch (frameworkId) {
              case 'stoic':
                return title.includes('stoic') || thinker.includes('marcus') || thinker.includes('epictetus') || thinker.includes('seneca');
              case 'spartan':
                return title.includes('spartan') || thinker.includes('plutarch') || thinker.includes('lycurgus');
              case 'bushido':
                return title.includes('bushido') || thinker.includes('yamamoto') || thinker.includes('musashi');
              case 'yogic':
                return title.includes('yogic') || thinker.includes('patanjali') || type.includes('breath');
              case 'monastic':
                return title.includes('monastic') || thinker.includes('benedict') || type.includes('lifestyle');
              default:
                return false;
            }
          };

          return frameworkFilter();
        });

        // If we have static resources, use them; otherwise generate AI resources
        if (frameworkResources.length > 0) {
          setResources(frameworkResources.slice(0, 3)); // Show top 3
        } else {
          // Generate AI resources for this framework
          await generateAIResources();
        }
      } catch (error) {
        console.error('Error loading resources:', error);
        setError('Failed to load resources');
        // Fallback to basic resources
        setResources([
          {
            id: 'fallback-1',
            title: `${frameworkName} Wisdom`,
            thinker: 'Ancient Sage',
            era: 'Timeless',
            type: 'capsule',
            estMinutes: 5,
            keyIdeas: ['Foundational principles', 'Practical application'],
            microPractices: ['Daily reflection', 'Mindful practice'],
            reflections: ['How does this wisdom apply today?'],
            level: 'Beginner',
            description: `Essential wisdom from the ${frameworkName} tradition for modern practitioners.`,
            tags: [frameworkName.toLowerCase(), 'wisdom', 'philosophy'],
            externalLinks: [
              {
                title: `${frameworkName} Classics`,
                url: '#',
                type: 'book'
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [frameworkId, frameworkName, frameworkTone]);

  const generateAIResources = async () => {
    setGenerating(true);
    try {
      // Generate multiple AI resources for variety
      const resourcePromises = [
        fetch('/api/generate/framework-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frameworkId,
            frameworkName,
            frameworkTone,
            type: 'practice'
          }),
        }),
        fetch('/api/generate/framework-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frameworkId,
            frameworkName,
            frameworkTone,
            type: 'reflection'
          }),
        }),
        fetch('/api/generate/framework-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frameworkId,
            frameworkName,
            frameworkTone,
            type: 'wisdom'
          }),
        })
      ];

      const responses = await Promise.all(resourcePromises);
      const aiResources = await Promise.all(
        responses.map(async (response, index) => {
          if (response.ok) {
            const resource = await response.json();
            return {
              ...resource,
              description: `AI-generated ${frameworkName} wisdom for modern practitioners.`,
              tags: [frameworkName.toLowerCase(), 'ai-generated', 'wisdom'],
              externalLinks: [
                {
                  title: `Learn More About ${frameworkName}`,
                  url: `https://en.wikipedia.org/wiki/${frameworkName}`,
                  type: 'article'
                }
              ],
              completionRate: 0,
              userRating: 0
            };
          }
          return null;
        })
      );

      const validResources = aiResources.filter(resource => resource !== null);
      if (validResources.length > 0) {
        setResources(validResources);
      } else {
        throw new Error('Failed to generate AI resources');
      }
    } catch (error) {
      console.error('Error generating AI resources:', error);
      setError('Failed to generate resources');
    } finally {
      setGenerating(false);
    }
  };

  const startLearningSession = (resource: Resource) => {
    setSelectedResource(resource);
    setIsLearningMode(true);
    setCurrentStep(0);
    
    // Create new learning session
    const newSession: LearningSession = {
      resourceId: resource.id,
      startTime: new Date(),
      completed: false
    };
    setUserSessions(prev => [...prev, newSession]);
  };

  const completeLearningSession = (rating?: number, notes?: string) => {
    if (selectedResource) {
      setUserSessions(prev => prev.map(session => 
        session.resourceId === selectedResource.id 
          ? { ...session, endTime: new Date(), completed: true, rating, notes }
          : session
      ));
      
      // Update resource completion rate
      setResources(prev => prev.map(resource => 
        resource.id === selectedResource.id
          ? { ...resource, completionRate: (resource.completionRate || 0) + 1 }
          : resource
      ));
    }
    
    setIsLearningMode(false);
    setSelectedResource(null);
    setCurrentStep(0);
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'practice': return <Zap className="w-5 h-5" />;
      case 'reflection': return <Heart className="w-5 h-5" />;
      case 'wisdom': return <Star className="w-5 h-5" />;
      case 'capsule': return <Target className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'practice': return 'from-blue-500 to-cyan-600';
      case 'reflection': return 'from-purple-500 to-pink-600';
      case 'wisdom': return 'from-amber-500 to-yellow-600';
      case 'capsule': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSessionForResource = (resourceId: string) => {
    return userSessions.find(session => session.resourceId === resourceId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-white">Loading wisdom resources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={generateAIResources}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Resources
            </>
          )}
        </button>
      </div>
    );
  }

  const displayedResources = showAllResources ? resources : resources.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedResources.map((resource) => {
          const session = getSessionForResource(resource.id);
          const isCompleted = session?.completed;
          
          return (
            <motion.div
              key={resource.id}
              className="glass-card p-6 hover:bg-white/10 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startLearningSession(resource)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getResourceColor(resource.type)} flex items-center justify-center text-white`}>
                  {getResourceIcon(resource.type)}
                </div>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {resource.title}
                </h3>
                
                {resource.description && (
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {resource.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {resource.estMinutes || 5}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {resource.level || 'Beginner'}
                  </div>
                </div>

                {/* Key Ideas Preview */}
                {resource.keyIdeas && resource.keyIdeas.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Key Ideas</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.keyIdeas.slice(0, 2).map((idea, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                        >
                          {idea}
                        </span>
                      ))}
                      {resource.keyIdeas.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                          +{resource.keyIdeas.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {resource.tags && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between">
                <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  {isCompleted ? 'Review' : 'Start Learning'}
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {session?.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < session.rating! ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {resources.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllResources(!showAllResources)}
            className="btn-secondary"
          >
            {showAllResources ? 'Show Less' : `Show ${resources.length - 3} More Resources`}
          </button>
        </div>
      )}

      {/* Generate More Resources Button */}
      <div className="text-center">
        <button
          onClick={generateAIResources}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Generating New Wisdom...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate More Wisdom
            </>
          )}
        </button>
      </div>

      {/* Learning Modal */}
      <AnimatePresence>
        {isLearningMode && selectedResource && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLearningMode(false)}
          >
            <motion.div
              className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getResourceColor(selectedResource.type)} flex items-center justify-center text-2xl text-white`}>
                    {getResourceIcon(selectedResource.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedResource.title}</h2>
                    <p className="text-gray-400">
                      {selectedResource.thinker} • {selectedResource.era} • {selectedResource.estMinutes} minutes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLearningMode(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Learning Steps */}
              <div className="space-y-6">
                {/* Step 1: Key Ideas */}
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white">Key Ideas</h3>
                    <div className="grid gap-3">
                      {selectedResource.keyIdeas?.map((idea, index) => (
                        <div key={index} className="p-4 bg-white/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                              {index + 1}
                            </div>
                            <p className="text-white">{idea}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-primary w-full"
                    >
                      Continue to Practices
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Micro Practices */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white">Micro Practices</h3>
                    <div className="grid gap-3">
                      {selectedResource.microPractices?.map((practice, index) => (
                        <div key={index} className="p-4 bg-white/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                              {index + 1}
                            </div>
                            <p className="text-white">{practice}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep(0)}
                        className="btn-secondary flex-1"
                      >
                        Back to Ideas
                      </button>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="btn-primary flex-1"
                      >
                        Continue to Reflection
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Reflection */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white">Reflection Questions</h3>
                    <div className="space-y-4">
                      {selectedResource.reflections?.map((reflection, index) => (
                        <div key={index} className="p-4 bg-white/10 rounded-lg">
                          <p className="text-white mb-3">{reflection}</p>
                          <textarea
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                            placeholder="Write your reflection here..."
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="btn-secondary flex-1"
                      >
                        Back to Practices
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="btn-primary flex-1"
                      >
                        Complete Learning
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Completion */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white">Complete Your Learning</h3>
                    
                    {/* Rating */}
                    <div className="space-y-2">
                      <p className="text-gray-300">How would you rate this wisdom resource?</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => completeLearningSession(rating)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-yellow-500/20 transition-colors text-white"
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* External Links */}
                    {selectedResource.externalLinks && selectedResource.externalLinks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-gray-300">Explore Further</p>
                        <div className="space-y-2">
                          {selectedResource.externalLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="btn-secondary flex-1"
                      >
                        Back to Reflection
                      </button>
                      <button
                        onClick={() => completeLearningSession()}
                        className="btn-primary flex-1"
                      >
                        Complete & Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 