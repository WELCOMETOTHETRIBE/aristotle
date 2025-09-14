'use client';

import React, { useState } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumActivityResponse, LyceumEvaluation } from '@prisma/client';

interface LyceumArtifactsProps {
  pathId?: string;
  lessonId?: string;
}

export default function LyceumArtifacts({ pathId, lessonId }: LyceumArtifactsProps) {
  const { userProgress, lyceumData } = useLyceum();
  const [selectedArtifact, setSelectedArtifact] = useState<LyceumActivityResponse | null>(null);
  const [filter, setFilter] = useState<'all' | 'reflections' | 'photos' | 'quizzes' | 'evaluations'>('all');

  if (!userProgress) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Loading your artifacts...
        </div>
      </div>
    );
  }

  // Get all artifacts (activity responses and evaluations)
  const allArtifacts = [
    ...userProgress.lyceumActivityResponses,
    ...userProgress.lyceumEvaluations
  ];

  // Filter artifacts based on current view
  let filteredArtifacts = allArtifacts;
  if (pathId) {
    filteredArtifacts = filteredArtifacts.filter(artifact => {
      if ('lessonId' in artifact) {
        const lesson = lyceumData?.lessons.find(l => l.id === artifact.lessonId);
        return lesson?.pathId === pathId;
      }
      return false;
    });
  }
  if (lessonId) {
    filteredArtifacts = filteredArtifacts.filter(artifact => {
      if ('lessonId' in artifact) {
        return artifact.lessonId === lessonId;
      }
      return false;
    });
  }

  // Apply type filter
  if (filter !== 'all') {
    filteredArtifacts = filteredArtifacts.filter(artifact => {
      if ('activityType' in artifact) {
        switch (filter) {
          case 'reflections':
            return artifact.activityType === 'reflection';
          case 'photos':
            return artifact.activityType === 'photo_capture';
          case 'quizzes':
            return artifact.activityType === 'quiz';
          default:
            return true;
        }
      }
      if ('type' in artifact) {
        return filter === 'evaluations';
      }
      return false;
    });
  }

  const getArtifactType = (artifact: any) => {
    if ('activityType' in artifact) {
      return artifact.activityType;
    }
    if ('type' in artifact) {
      return 'evaluation';
    }
    return 'unknown';
  };

  const getArtifactTitle = (artifact: any) => {
    if ('activityType' in artifact) {
      const lesson = lyceumData?.lessons.find(l => l.id === artifact.lessonId);
      const activity = lesson?.activities.find(a => a.id === artifact.activityId);
      return activity?.title || 'Activity Response';
    }
    if ('type' in artifact) {
      return 'AI Evaluation';
    }
    return 'Artifact';
  };

  const getArtifactPreview = (artifact: any) => {
    if ('response' in artifact) {
      return artifact.response.substring(0, 100) + '...';
    }
    if ('feedback' in artifact) {
      return artifact.feedback.substring(0, 100) + '...';
    }
    return 'No preview available';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Artifacts</h2>
        <p className="text-gray-600">
          Collection of your work, reflections, and AI evaluations from your Lyceum journey
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', 'reflections', 'photos', 'quizzes', 'evaluations'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterType === 'all' ? 'All Artifacts' : 
             filterType === 'reflections' ? 'Reflections' :
             filterType === 'photos' ? 'Photos' :
             filterType === 'quizzes' ? 'Quizzes' : 'Evaluations'}
          </button>
        ))}
      </div>

      {/* Artifacts Grid */}
      {filteredArtifacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No artifacts found</div>
          <p className="text-gray-500">
            Complete some activities to start building your collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((artifact, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArtifact(artifact)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getArtifactType(artifact) === 'reflection' ? 'bg-purple-100 text-purple-700' :
                  getArtifactType(artifact) === 'photo_capture' ? 'bg-green-100 text-green-700' :
                  getArtifactType(artifact) === 'quiz' ? 'bg-blue-100 text-blue-700' :
                  getArtifactType(artifact) === 'evaluation' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getArtifactType(artifact)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(artifact.createdAt)}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {getArtifactTitle(artifact)}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3">
                {getArtifactPreview(artifact)}
              </p>

              {('score' in artifact && artifact.score !== null) && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 mr-2">Score:</span>
                  <span className={`font-medium ${
                    artifact.score >= 4 ? 'text-green-600' :
                    artifact.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {artifact.score}/5
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {getArtifactTitle(selectedArtifact)}
                </h3>
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getArtifactType(selectedArtifact) === 'reflection' ? 'bg-purple-100 text-purple-700' :
                  getArtifactType(selectedArtifact) === 'photo_capture' ? 'bg-green-100 text-green-700' :
                  getArtifactType(selectedArtifact) === 'quiz' ? 'bg-blue-100 text-blue-700' :
                  getArtifactType(selectedArtifact) === 'evaluation' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getArtifactType(selectedArtifact)}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  {formatDate(selectedArtifact.createdAt)}
                </span>
              </div>

              <div className="prose max-w-none">
                {('response' in selectedArtifact) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Response</h4>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-wrap">{selectedArtifact.response}</p>
                    </div>
                  </div>
                )}

                {('feedback' in selectedArtifact) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Feedback</h4>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-wrap">{selectedArtifact.feedback}</p>
                    </div>
                  </div>
                )}

                {('score' in selectedArtifact && selectedArtifact.score !== null) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Score</h4>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${
                        selectedArtifact.score >= 4 ? 'text-green-600' :
                        selectedArtifact.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedArtifact.score}/5
                      </span>
                      <span className="ml-2 text-gray-600">
                        {selectedArtifact.score >= 4 ? 'Excellent' :
                         selectedArtifact.score >= 3 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
