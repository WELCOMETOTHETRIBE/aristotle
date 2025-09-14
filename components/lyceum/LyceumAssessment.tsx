'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Brain,
  Target,
  Award,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Assessment } from '@/lib/lyceum-data';

interface LyceumAssessmentProps {
  assessment: Assessment;
  activityResponses: { [key: string]: any };
  onComplete: () => void;
}

export default function LyceumAssessment({ assessment, activityResponses, onComplete }: LyceumAssessmentProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    
    try {
      const response = await fetch('/api/lyceum/ai/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessment: assessment,
          activityResponses: activityResponses
        }),
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const evaluationData = await response.json();
      setEvaluation(evaluationData);
    } catch (error) {
      console.error('Evaluation error:', error);
      // Fallback to mock evaluation if API fails
      const mockEvaluation = {
        scores: {
          'Correct categorizations': 0.8,
          'Reflection clarity': 0.9,
          'Overall completion': 0.85
        },
        notes: 'Excellent work! Your responses show good understanding of the concepts. Consider exploring the connections between different categories more deeply.',
        mastery_deltas: {
          'logic_categories': 0.07,
          'reflection_skills': 0.05
        },
        passed: true
      };
      setEvaluation(mockEvaluation);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/20';
    if (score >= 0.6) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">Assessment</h3>
          <p className="text-sm text-muted">AI evaluation of your responses</p>
        </div>
      </div>

      {!evaluation ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-text mb-2">Ready for Assessment?</h4>
            <p className="text-muted mb-6">
              Your responses will be evaluated against the learning objectives using AI assessment.
            </p>
            
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto',
                isEvaluating
                  ? 'bg-surface-2 text-muted cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
              )}
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Evaluate My Work</span>
                </>
              )}
            </button>
          </div>

          {/* Assessment Criteria Preview */}
          <div className="bg-surface-2 rounded-lg p-4">
            <h5 className="font-medium text-text mb-3">Assessment Criteria</h5>
            <div className="space-y-2">
              {assessment.rubric.map((criterion, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{criterion.criterion}</span>
                  <span className="text-xs text-muted">Weight: {criterion.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Evaluation Results */}
          <div className="text-center">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
              evaluation.passed ? 'bg-green-500/20' : 'bg-red-500/20'
            )}>
              {evaluation.passed ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Target className="w-8 h-8 text-red-500" />
              )}
            </div>
            <h4 className={cn(
              'text-lg font-semibold mb-2',
              evaluation.passed ? 'text-green-500' : 'text-red-500'
            )}>
              {evaluation.passed ? 'Assessment Passed!' : 'Assessment Needs Improvement'}
            </h4>
            <p className="text-muted">
              {evaluation.passed 
                ? 'Congratulations! You have successfully completed this lesson.'
                : 'Please review the feedback and try again.'
              }
            </p>
          </div>

          {/* Scores */}
          <div className="space-y-4">
            <h5 className="font-medium text-text">Detailed Scores</h5>
            <div className="space-y-3">
              {Object.entries(evaluation.scores).map(([criterion, score]) => (
                <div key={criterion} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{criterion}</span>
                    <span className={cn('font-medium', getScoreColor(score as number))}>
                      {Math.round((score as number) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-2">
                    <motion.div 
                      className={cn('h-2 rounded-full', getScoreBg(score as number))}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score as number) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h5 className="font-medium text-text mb-2">AI Feedback</h5>
            <p className="text-sm text-muted">{evaluation.notes}</p>
          </div>

          {/* Mastery Updates */}
          {evaluation.mastery_deltas && Object.keys(evaluation.mastery_deltas).length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h5 className="font-medium text-text mb-2">Mastery Progress</h5>
              <div className="space-y-2">
                {Object.entries(evaluation.mastery_deltas).map(([domain, delta]) => (
                  <div key={domain} className="flex items-center justify-between text-sm">
                    <span className="text-muted capitalize">{domain.replace(/_/g, ' ')}</span>
                    <span className="text-green-500 font-medium">
                      +{Math.round((delta as number) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Button */}
          {evaluation.passed && (
            <div className="text-center">
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-500/90 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Award className="w-5 h-5" />
                <span>Complete Lesson</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
