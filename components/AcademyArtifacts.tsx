'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Mic, 
  Brain, 
  BookOpen, 
  Star, 
  Award, 
  Download, 
  Share, 
  Eye, 
  Calendar,
  CheckCircle,
  Circle,
  Quote,
  Lightbulb,
  Target,
  Compass,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artifact {
  id: string;
  type: string;
  content: any;
  timestamp: string;
  lessonId: string;
  lessonTitle?: string;
  pathTitle?: string;
}

interface AcademyArtifactsProps {
  userProgress: any;
  academyData: any;
}

export default function AcademyArtifacts({ userProgress, academyData }: AcademyArtifactsProps) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    // Collect all artifacts from user progress
    const allArtifacts: Artifact[] = [];
    
    Object.entries(userProgress).forEach(([lessonId, progress]: [string, any]) => {
      if (progress?.data?.artifacts) {
        Object.entries(progress.data.artifacts).forEach(([artifactId, artifact]: [string, any]) => {
          const lesson = academyData.paths
            .flatMap((path: any) => path.lessons)
            .find((l: any) => l.id === lessonId);
          
          if (lesson) {
            const path = academyData.paths.find((p: any) => 
              p.lessons.some((l: any) => l.id === lessonId)
            );
            
            allArtifacts.push({
              ...artifact,
              lessonTitle: lesson.title,
              pathTitle: path?.title
            });
          }
        });
      }
    });
    
    setArtifacts(allArtifacts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, [userProgress, academyData]);

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'dialogue_fragment': return FileText;
      case 'refined_definition': return Brain;
      case 'academy_vow': return Star;
      case 'cave_note': return Eye;
      case 'turning_action': return Compass;
      case 'math_gate_card': return Target;
      case 'form_invariant_note': return Lightbulb;
      case 'line_card': return FileText;
      case 'belief_raise_note': return Brain;
      case 'soul_balance_card': return Star;
      case 'justice_step': return Target;
      case 'leadership_note': return Award;
      case 'ladder_step': return Compass;
      case 'long_view_note': return Eye;
      case 'good_star': return Star;
      case 'academy_speech': return Mic;
      case 'fearless_note': return Sparkles;
      default: return FileText;
    }
  };

  const getArtifactTitle = (type: string) => {
    const titles: Record<string, string> = {
      'dialogue_fragment': 'Dialogue Fragment',
      'refined_definition': 'Refined Definition',
      'academy_vow': 'Academy Vow',
      'cave_note': 'Cave Reflection',
      'turning_action': 'Turning Action',
      'math_gate_card': 'Math Gateway Card',
      'form_invariant_note': 'Form Invariant Note',
      'line_card': 'Divided Line Card',
      'belief_raise_note': 'Belief Raise Note',
      'soul_balance_card': 'Soul Balance Card',
      'justice_step': 'Justice Step',
      'leadership_note': 'Leadership Note',
      'ladder_step': 'Ladder Step',
      'long_view_note': 'Long View Note',
      'good_star': 'Good Star',
      'academy_speech': 'Academy Speech',
      'fearless_note': 'Fearless Note'
    };
    return titles[type] || type;
  };

  const getArtifactDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'dialogue_fragment': 'A piece of Socratic dialogue from your learning',
      'refined_definition': 'Your refined understanding of a concept',
      'academy_vow': 'Your commitment to the Academy journey',
      'cave_note': 'Reflection on the Allegory of the Cave',
      'turning_action': 'Action to turn toward the light',
      'math_gate_card': 'Mathematical insight card',
      'form_invariant_note': 'Note on eternal forms',
      'line_card': 'Understanding of the Divided Line',
      'belief_raise_note': 'Note on raising beliefs to knowledge',
      'soul_balance_card': 'Card for soul harmony',
      'justice_step': 'Step toward justice',
      'leadership_note': 'Note on philosopher-king leadership',
      'ladder_step': 'Step on the ladder of love',
      'long_view_note': 'Note on immortality and long view',
      'good_star': 'Your orienting value',
      'academy_speech': 'Your truthful speech practice',
      'fearless_note': 'Note on practicing fearlessness'
    };
    return descriptions[type] || 'Learning artifact';
  };

  const filteredArtifacts = filterType === 'all' 
    ? artifacts 
    : artifacts.filter(artifact => artifact.type === filterType);

  const artifactTypes = [...new Set(artifacts.map(a => a.type))];

  const generatePortfolio = () => {
    const portfolioData = {
      title: "Academy Dialogue Portfolio",
      student: "Academy Scholar",
      date: new Date().toLocaleDateString(),
      artifacts: artifacts.map(artifact => ({
        type: getArtifactTitle(artifact.type),
        content: artifact.content,
        lesson: artifact.lessonTitle,
        path: artifact.pathTitle,
        date: new Date(artifact.timestamp).toLocaleDateString()
      })),
      summary: {
        totalArtifacts: artifacts.length,
        completedPaths: academyData.paths.filter((path: any) => 
          path.lessons.every((lesson: any) => userProgress[lesson.id]?.completed)
        ).length,
        totalPaths: academyData.paths.length
      }
    };

    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academy-portfolio.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Your Academy Portfolio</h2>
          <p className="text-muted">Collection of your learning artifacts and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generatePortfolio}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Portfolio</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface border border-border rounded-xl text-center">
          <div className="text-2xl font-bold text-text">{artifacts.length}</div>
          <div className="text-sm text-muted">Total Artifacts</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl text-center">
          <div className="text-2xl font-bold text-text">{artifactTypes.length}</div>
          <div className="text-sm text-muted">Artifact Types</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl text-center">
          <div className="text-2xl font-bold text-text">
            {academyData.paths.filter((path: any) => 
              path.lessons.every((lesson: any) => userProgress[lesson.id]?.completed)
            ).length}
          </div>
          <div className="text-sm text-muted">Paths Completed</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl text-center">
          <div className="text-2xl font-bold text-text">
            {academyData.certificate.requirements.portfolio_items_required.filter((item: string) =>
              artifacts.some(artifact => artifact.type === item)
            ).length}
          </div>
          <div className="text-sm text-muted">Certificate Items</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            filterType === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-surface-2 text-muted hover:text-text'
          )}
        >
          All ({artifacts.length})
        </button>
        {artifactTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filterType === type 
                ? 'bg-primary text-white' 
                : 'bg-surface-2 text-muted hover:text-text'
            )}
          >
            {getArtifactTitle(type)} ({artifacts.filter(a => a.type === type).length})
          </button>
        ))}
      </div>

      {/* Artifacts Grid */}
      {filteredArtifacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">No Artifacts Yet</h3>
          <p className="text-muted">Complete lessons to start building your Academy portfolio</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((artifact) => {
            const IconComponent = getArtifactIcon(artifact.type);
            return (
              <motion.div
                key={artifact.id}
                onClick={() => setSelectedArtifact(artifact)}
                className="p-6 bg-surface border border-border rounded-xl hover:bg-surface-2 transition-all duration-200 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text truncate">{getArtifactTitle(artifact.type)}</h3>
                    <p className="text-sm text-muted truncate">{artifact.lessonTitle}</p>
                    <p className="text-xs text-muted">{artifact.pathTitle}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted">{getArtifactDescription(artifact.type)}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(artifact.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Click to view</span>
                  <Eye className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {(() => {
                  const IconComponent = getArtifactIcon(selectedArtifact.type);
                  return (
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-indigo-400" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-bold text-text">{getArtifactTitle(selectedArtifact.type)}</h3>
                  <p className="text-sm text-muted">{selectedArtifact.lessonTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedArtifact(null)}
                className="p-2 text-muted hover:text-text transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-2 rounded-lg">
                <h4 className="font-semibold text-text mb-2">Content</h4>
                {typeof selectedArtifact.content === 'string' ? (
                  <p className="text-text">{selectedArtifact.content}</p>
                ) : selectedArtifact.content?.audio ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted">Audio Response:</p>
                    <audio controls className="w-full">
                      <source src={selectedArtifact.content.audio} type="audio/wav" />
                    </audio>
                  </div>
                ) : (
                  <pre className="text-sm text-text whitespace-pre-wrap">
                    {JSON.stringify(selectedArtifact.content, null, 2)}
                  </pre>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Path:</span>
                  <span className="text-text ml-2">{selectedArtifact.pathTitle}</span>
                </div>
                <div>
                  <span className="text-muted">Date:</span>
                  <span className="text-text ml-2">{new Date(selectedArtifact.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
