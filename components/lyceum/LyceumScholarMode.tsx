'use client';

import React, { useState, useEffect } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { LyceumLesson, LyceumScholarContent } from '@/lib/lyceum-data';

interface LyceumScholarModeProps {
  lesson: LyceumLesson;
  onClose: () => void;
}

export default function LyceumScholarMode({ lesson, onClose }: LyceumScholarModeProps) {
  const { lyceumData } = useLyceum();
  const [activeTab, setActiveTab] = useState<'overview' | 'readings' | 'exercises' | 'discussions'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!lesson.scholarMode) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No Scholar Mode content available for this lesson
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const scholarContent = lesson.scholarMode;

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {scholarContent.learningObjectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarContent.keyConcepts.map((concept, index) => (
            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">{concept.term}</h4>
              <p className="text-blue-800 text-sm">{concept.definition}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Historical Context</h3>
        <p className="text-gray-700 leading-relaxed">{scholarContent.historicalContext}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Modern Relevance</h3>
        <p className="text-gray-700 leading-relaxed">{scholarContent.modernRelevance}</p>
      </div>
    </div>
  );

  const renderReadings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Sources</h3>
        <div className="space-y-4">
          {scholarContent.primarySources.map((source, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{source.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{source.author}</p>
              <p className="text-gray-700 mb-3">{source.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Pages: {source.pages}</span>
                <span>Difficulty: {source.difficulty}/5</span>
                <span>Time: {source.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Secondary Sources</h3>
        <div className="space-y-4">
          {scholarContent.secondarySources.map((source, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{source.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{source.author}</p>
              <p className="text-gray-700 mb-3">{source.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Pages: {source.pages}</span>
                <span>Difficulty: {source.difficulty}/5</span>
                <span>Time: {source.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Resources</h3>
        <div className="space-y-4">
          {scholarContent.additionalResources.map((resource, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
              <p className="text-gray-700 mb-3">{resource.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Type: {resource.type}</span>
                <span>Time: {resource.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Critical Thinking Exercises</h3>
        <div className="space-y-4">
          {scholarContent.criticalThinkingExercises.map((exercise, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Exercise {index + 1}</h4>
              <p className="text-gray-700 mb-3">{exercise.question}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Difficulty: {exercise.difficulty}/5</span>
                <span>Time: {exercise.estimatedTime}</span>
                <span>Type: {exercise.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Projects</h3>
        <div className="space-y-4">
          {scholarContent.researchProjects.map((project, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-gray-700 mb-3">{project.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Duration: {project.duration}</span>
                <span>Difficulty: {project.difficulty}/5</span>
                <span>Type: {project.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Writing Assignments</h3>
        <div className="space-y-4">
          {scholarContent.writingAssignments.map((assignment, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>
              <p className="text-gray-700 mb-3">{assignment.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Length: {assignment.length}</span>
                <span>Difficulty: {assignment.difficulty}/5</span>
                <span>Time: {assignment.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDiscussions = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Discussion Questions</h3>
        <div className="space-y-4">
          {scholarContent.discussionQuestions.map((question, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Question {index + 1}</h4>
              <p className="text-gray-700 mb-3">{question.question}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Difficulty: {question.difficulty}/5</span>
                <span>Time: {question.estimatedTime}</span>
                <span>Type: {question.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Debate Topics</h3>
        <div className="space-y-4">
          {scholarContent.debateTopics.map((topic, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{topic.title}</h4>
              <p className="text-gray-700 mb-3">{topic.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Duration: {topic.duration}</span>
                <span>Difficulty: {topic.difficulty}/5</span>
                <span>Type: {topic.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Activities</h3>
        <div className="space-y-4">
          {scholarContent.groupActivities.map((activity, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{activity.title}</h4>
              <p className="text-gray-700 mb-3">{activity.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Duration: {activity.duration}</span>
                <span>Group Size: {activity.groupSize}</span>
                <span>Type: {activity.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Scholar Mode</h1>
              <p className="text-blue-100 mt-1">{lesson.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {(['overview', 'readings', 'exercises', 'discussions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'readings' && renderReadings()}
          {activeTab === 'exercises' && renderExercises()}
          {activeTab === 'discussions' && renderDiscussions()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Scholar Mode provides deep-dive content for advanced learners
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}