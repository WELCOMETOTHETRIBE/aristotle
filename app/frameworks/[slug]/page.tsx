'use client';

import { useEffect, useState } from 'react';
import { getToneGradient, getToneTextColor } from '../../../lib/tone';
import { getFrameworkBySlug } from '../../../lib/frameworks.config';
import { getPersonaByKey } from '../../../lib/ai/personas';
import { VirtueTotals } from '../../../lib/virtue';
import { Quest } from '../../../lib/quest-engine';
import Link from 'next/link';
import PageLayout from '../../../components/PageLayout';
import QuestDeck from '../../../components/QuestDeck';
import TimerCard from '../../../components/widgets/TimerCard';
import CounterCard from '../../../components/widgets/CounterCard';

import FrameworkPersonaChat from '../../../components/FrameworkPersonaChat';
import FrameworkResourceSpotlight from '../../../components/FrameworkResourceSpotlight';
import { HydrationWidget } from '../../../components/ModuleWidgets';
import { BreathworkWidgetNew } from '../../../components/BreathworkWidgetNew';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '../../../lib/virtue';
import { Trophy, Target, TrendingUp, BookOpen, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetGuard from '../../../components/WidgetGuard';
import DeveloperToolbar from '../../../components/DeveloperToolbar';
import FrameworkTerminology from '../../../components/FrameworkTerminology';
import MilestonesDropdown from '../../../components/MilestonesDropdown';

interface FrameworkDetailPageProps {
  params: { slug: string };
}

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const [framework, setFramework] = useState<any>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedWidgets, setCompletedWidgets] = useState<string[]>([]);
  const [virtueTotals, setVirtueTotals] = useState<VirtueTotals>({
    wisdom: 45,
    justice: 32,
    courage: 28,
    temperance: 38
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWidgetInfo, setShowWidgetInfo] = useState<string | null>(null);

  useEffect(() => {
    const loadFrameworkData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load framework config
        const frameworkConfig = getFrameworkBySlug(params.slug);
        if (!frameworkConfig) {
          throw new Error('Framework not found');
        }
        setFramework(frameworkConfig);

        // Load quests
        const questResponse = await fetch(`/api/plan/today?frameworkSlug=${params.slug}`);
        if (questResponse.ok) {
          const questData = await questResponse.json();
          setQuests(questData.quests);
          setVirtueTotals(questData.userVirtues);
        }

        // Load progress summary
        const progressResponse = await fetch(`/api/progress/summary?frameworkSlug=${params.slug}`);
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setVirtueTotals(progressData.virtueTotals);
        }

      } catch (err) {
        console.error('Error loading framework data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load framework');
      } finally {
        setLoading(false);
      }
    };

    loadFrameworkData();
  }, [params.slug]);

  const handleWidgetComplete = async (widgetId: string, payload: any) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId,
          frameworkSlug: params.slug,
          payload
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCompletedWidgets(prev => [...prev, widgetId]);
        
        // Update virtue totals
        if (data.checkin.virtues) {
          setVirtueTotals(prev => ({
            wisdom: prev.wisdom + (data.checkin.virtues.wisdom || 0),
            justice: prev.justice + (data.checkin.virtues.justice || 0),
            courage: prev.courage + (data.checkin.virtues.courage || 0),
            temperance: prev.temperance + (data.checkin.virtues.temperance || 0)
          }));
        }
      }
    } catch (error) {
      console.error('Error completing widget:', error);
    }
  };

  const renderWidget = (widget: any) => {
    return (
      <WidgetGuard
          widget={widget}
          framework={framework}
          onComplete={(payload) => handleWidgetComplete(widget.id, payload)}
        >
          {(normalizedWidget: any, onComplete: any) => {
            const commonProps = {
              title: normalizedWidget.title,
              config: normalizedWidget.config,
              onComplete,
              virtueGrantPerCompletion: normalizedWidget.virtueGrantPerCompletion
            };

            const widgetComponent = (() => {
              switch (normalizedWidget.kind) {
                case 'TIMER':
                  return <TimerCard {...commonProps} />;
                case 'COUNTER':
                  return <CounterCard {...commonProps} />;
                case 'BREATH':
                  return <BreathworkWidgetNew frameworkTone={framework.tone} />;
                case 'HYDRATION':
                  return <HydrationWidget frameworkTone={framework.tone} />;
                case 'JOURNAL':
                case 'AUDIO_NOTE':
                case 'PHOTO':
                case 'WHEEL':
                case 'DRAG_BOARD':
                case 'CHECKLIST':
                case 'BALANCE_GYRO':
                case 'SLIDERS':
                  // Use ModuleWidget for all other widget types
                  return (
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-white/10">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{normalizedWidget.title}</h3>
                          <p className="text-sm text-gray-400">{normalizedWidget.config.teaching}</p>
                        </div>
                      </div>
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-sm mb-4">
                          <p className="mb-2"><strong>Widget Type:</strong> {normalizedWidget.kind}</p>
                          {normalizedWidget.config.prompt && (
                            <p className="mb-2"><strong>Prompt:</strong> {normalizedWidget.config.prompt}</p>
                          )}
                          {normalizedWidget.config.minWords && (
                            <p className="mb-2"><strong>Min Words:</strong> {normalizedWidget.config.minWords}</p>
                          )}
                        </div>
                        <Button 
                          onClick={() => onComplete({ completed: true, note: 'Widget completed' })}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Complete {normalizedWidget.title}
                        </Button>
                      </div>
                    </div>
                  );
                default:
                  return (
                    <div className="p-6 bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">{normalizedWidget.title}</h3>
                      <p className="text-gray-400">Widget type {normalizedWidget.kind} not implemented yet</p>
                    </div>
                  );
              }
            })();

            return (
              <div className="relative">
                <div className="absolute top-2 right-8 z-10">
                  <button
                    onClick={() => setShowWidgetInfo(showWidgetInfo === widget.id ? null : widget.id)}
                    className="p-1 text-muted-foreground hover:text-white transition-colors bg-black/20 rounded-full"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </div>
                {showWidgetInfo === widget.id && (
                  <div className="absolute top-8 right-8 z-20 w-64 p-3 bg-black/90 backdrop-blur border border-white/20 rounded-lg text-xs">
                    <p className="text-white mb-2">{normalizedWidget.config.teaching}</p>
                    <p className="text-gray-300">Virtue gains: {Object.entries(normalizedWidget.virtueGrantPerCompletion).map(([virtue, amount]) => `${virtue} +${amount}`).join(', ')}</p>
                  </div>
                )}
                {widgetComponent}
              </div>
            );
          }}
        </WidgetGuard>
    );
  };

  if (loading) {
    return (
      <PageLayout title="Loading Framework" description="Please wait while we load the framework details">
        <div className="text-center py-12">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="body-text">Loading framework...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !framework) {
    return (
      <PageLayout title="Framework Not Found" description="The framework you're looking for could not be loaded">
        <div className="text-center py-12">
          <p className="body-text mb-6">{error || 'The framework you\'re looking for could not be loaded.'}</p>
          <Link href="/frameworks" className="btn-secondary">
            ← Back to All Frameworks
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showAurora={false}>


      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${getToneGradient(framework.tone)} py-16 -mt-12 mb-8`}>
        <div className="text-center">
          <h1 className={`headline mb-4 ${getToneTextColor(framework.tone)}`}>
            {framework.name}
          </h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <span className={`text-lg font-medium ${getToneTextColor(framework.tone)}`}>
              {framework.virtuePrimary.charAt(0).toUpperCase() + framework.virtuePrimary.slice(1)}
            </span>
          </div>
          
          {/* Framework Intention */}
          <div className="max-w-2xl mx-auto mb-6">
            <p className={`text-lg ${getToneTextColor(framework.tone)} opacity-90 leading-relaxed`}>
              {framework.teachingChip}
            </p>
          </div>
          
          {/* Milestones Dropdown */}
          <div className="flex justify-center">
            <MilestonesDropdown virtueTotals={virtueTotals} frameworkSlug={framework.slug} />
          </div>
        </div>
      </div>

      {/* About Framework - Moved Above Chat */}
      <div className="page-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title text-3xl mb-4">About {framework.name}</h2>
            <p className="section-description text-lg leading-relaxed">
              {framework.teachingChip}
            </p>
          </div>
        </div>
      </div>

      {/* AI Chat - Prominently Displayed */}
      <div className="page-section">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
            <FrameworkPersonaChat 
              frameworkId={params.slug} 
              title={framework.name}
            />
          </div>
        </div>
      </div>

      {/* Terminology */}
      <FrameworkTerminology 
        frameworkSlug={framework.slug}
        frameworkName={framework.name}
        frameworkTone={framework.tone}
      />

      {/* Quest Deck */}
      <div className="page-section">
        <QuestDeck 
          quests={quests} 
          completedWidgets={completedWidgets}
        />
      </div>



      {/* Practice Widgets */}
      <div className="page-section">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="section-title">Practice Tools</h2>
            <button
              onClick={() => setShowWidgetInfo(showWidgetInfo === 'practice_widgets' ? null : 'practice_widgets')}
              className="p-1 text-muted-foreground hover:text-white transition-colors"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="section-description">
            Interactive tools to embody the {framework.name} tradition
          </p>
          {showWidgetInfo === 'practice_widgets' && (
            <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-200">
                These interactive tools are specifically designed to help you embody the principles and practices of {framework.name}. 
                Each tool focuses on cultivating the core virtues of this tradition through practical, daily exercises.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {framework.widgets.map((widget: any) => (
              <div key={widget.id} className="relative group">
                {renderWidget(widget)}
              </div>
            ))}
          </div>
        </div>

      {/* Resources Spotlight */}
      <div className="page-section">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="section-title">Wisdom Resources</h2>
            <button
              onClick={() => setShowWidgetInfo(showWidgetInfo === 'wisdom_resources' ? null : 'wisdom_resources')}
              className="p-1 text-muted-foreground hover:text-white transition-colors"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="section-description">
            Curated knowledge and practices from the {framework.name} tradition
          </p>
          {showWidgetInfo === 'wisdom_resources' && (
            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-sm text-purple-200">
                Discover curated wisdom, teachings, and practices from the {framework.name} tradition. 
                These resources provide deeper insights into the philosophical foundations and practical applications of this ancient wisdom.
              </p>
            </div>
          )}
          <FrameworkResourceSpotlight 
            frameworkId={params.slug}
            frameworkName={framework.name}
            frameworkTone={framework.tone}
          />
        </div>

      {/* Progress Panel */}
      <div className="page-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Virtue Progress</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(virtueTotals).map(([virtue, total]) => (
                <div key={virtue} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 capitalize">{virtue}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getVirtueGradient(virtue as keyof VirtueTotals)}`}
                        style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getVirtueColor(virtue as keyof VirtueTotals)}`}>
                      {total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Today's Progress</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {completedWidgets.length} / {framework.widgets.length}
              </div>
              <div className="text-sm text-gray-400 mb-3">Tools Completed</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(completedWidgets.length / framework.widgets.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card-base bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Framework Mastery</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {Math.round((completedWidgets.length / framework.widgets.length) * 100)}%
              </div>
              <div className="text-sm text-gray-400 mb-3">Overall Progress</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${(completedWidgets.length / framework.widgets.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Back to Frameworks */}
      <div className="text-center mt-12">
        <Link href="/frameworks" className="btn-secondary">
          ← Back to All Frameworks
        </Link>
      </div>

      {/* Developer Toolbar */}
      <DeveloperToolbar />
    </PageLayout>
  );
} 