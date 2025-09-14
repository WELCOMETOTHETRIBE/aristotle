'use client';

import React, { useState } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumActivityResponse, LyceumEvaluation } from '@prisma/client';

interface LyceumPortfolioProps {
  userId?: string;
}

export default function LyceumPortfolio({ userId }: LyceumPortfolioProps) {
  const { userProgress, lyceumData } = useLyceum();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedMastery, setSelectedMastery] = useState<string | null>(null);

  if (!userProgress || !lyceumData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Loading your portfolio...
        </div>
      </div>
    );
  }

  // Calculate mastery scores
  const masteryScores = {
    theoretical: userProgress.masteryTheoretical || 0,
    practical: userProgress.masteryPractical || 0,
    reflective: userProgress.masteryReflective || 0,
    creative: userProgress.masteryCreative || 0
  };

  const totalMastery = Object.values(masteryScores).reduce((sum, score) => sum + score, 0);
  const averageMastery = totalMastery / 4;

  // Get all artifacts
  const allArtifacts = [
    ...userProgress.lyceumActivityResponses,
    ...userProgress.lyceumEvaluations
  ];

  // Filter artifacts by path
  const getArtifactsByPath = (pathId: string) => {
    return allArtifacts.filter(artifact => {
      if ('lessonId' in artifact) {
        const lesson = lyceumData.lessons.find(l => l.id === artifact.lessonId);
        return lesson?.pathId === pathId;
      }
      return false;
    });
  };

  // Get best artifacts for each mastery domain
  const getBestArtifactsByMastery = (masteryDomain: string) => {
    return allArtifacts.filter(artifact => {
      if ('masteryDomain' in artifact) {
        return artifact.masteryDomain === masteryDomain;
      }
      return false;
    }).sort((a, b) => {
      const scoreA = 'score' in a ? a.score || 0 : 0;
      const scoreB = 'score' in b ? b.score || 0 : 0;
      return scoreB - scoreA;
    }).slice(0, 3);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMasteryColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100';
    if (score >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getMasteryLabel = (score: number) => {
    if (score >= 4) return 'Master';
    if (score >= 3) return 'Proficient';
    if (score >= 2) return 'Developing';
    return 'Beginning';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Lyceum Portfolio</h1>
        <p className="text-gray-600">
          A comprehensive view of your philosophical journey and achievements
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userProgress.completedPaths || 0}/12
            </div>
            <div className="text-sm text-gray-600">Paths Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userProgress.completedLessons || 0}/36
            </div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {allArtifacts.length}
            </div>
            <div className="text-sm text-gray-600">Artifacts Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {averageMastery.toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-600">Average Mastery</div>
          </div>
        </div>
      </div>

      {/* Mastery Domains */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mastery Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(masteryScores).map(([domain, score]) => (
            <div
              key={domain}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedMastery === domain ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMastery(selectedMastery === domain ? null : domain)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {domain}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(score)}`}>
                  {getMasteryLabel(score)}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {score.toFixed(1)}/5
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Path Progress */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Path Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lyceumData.paths.map((path) => {
            const pathProgress = userProgress.lyceumPathProgress.find(p => p.pathId === path.id);
            const pathArtifacts = getArtifactsByPath(path.id);
            const completionRate = pathProgress ? (pathProgress.completedLessons / 3) * 100 : 0;

            return (
              <div
                key={path.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPath === path.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{path.title}</h3>
                  <span className="text-sm text-gray-500">
                    {pathProgress?.completedLessons || 0}/3
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {pathArtifacts.length} artifacts
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Artifacts by Mastery */}
      {selectedMastery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Best {selectedMastery} Artifacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getBestArtifactsByMastery(selectedMastery).map((artifact, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {('activityType' in artifact) ? artifact.activityType : 'evaluation'}
                  </span>
                  {('score' in artifact && artifact.score !== null) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      artifact.score >= 4 ? 'bg-green-100 text-green-700' :
                      artifact.score >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {artifact.score}/5
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {formatDate(artifact.createdAt)}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {('response' in artifact) ? artifact.response.substring(0, 100) + '...' :
                   ('feedback' in artifact) ? artifact.feedback.substring(0, 100) + '...' :
                   'No preview available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Path Artifacts */}
      {selectedPath && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lyceumData.paths.find(p => p.id === selectedPath)?.title} Artifacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getArtifactsByPath(selectedPath).map((artifact, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {('activityType' in artifact) ? artifact.activityType : 'evaluation'}
                  </span>
                  {('score' in artifact && artifact.score !== null) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      artifact.score >= 4 ? 'bg-green-100 text-green-700' :
                      artifact.score >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {artifact.score}/5
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {formatDate(artifact.createdAt)}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {('response' in artifact) ? artifact.response.substring(0, 100) + '...' :
                   ('feedback' in artifact) ? artifact.feedback.substring(0, 100) + '...' :
                   'No preview available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Progress */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${
                  (userProgress.completedPaths || 0) >= 12 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                Complete all 12 paths
              </li>
              <li className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${
                  averageMastery >= 3.5 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                Achieve 3.5+ average mastery
              </li>
              <li className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${
                  allArtifacts.length >= 20 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                Create 20+ artifacts
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Paths</span>
                <span>{userProgress.completedPaths || 0}/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${((userProgress.completedPaths || 0) / 12) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Mastery</span>
                <span>{averageMastery.toFixed(1)}/3.5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((averageMastery / 3.5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
