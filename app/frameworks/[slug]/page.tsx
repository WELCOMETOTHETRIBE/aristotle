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
import BreathPacer from '../../../components/widgets/BreathPacer';
import FrameworkPersonaChat from '../../../components/FrameworkPersonaChat';
import FrameworkResourceSpotlight from '../../../components/FrameworkResourceSpotlight';
import BreathTimerCircle from '../../../components/BreathTimerCircle';
import { getVirtueEmoji, getVirtueColor, getVirtueGradient } from '../../../lib/virtue';
import { Trophy, Target, TrendingUp, BookOpen, Zap, Info } from 'lucide-react';
import WidgetGuard from '../../../components/WidgetGuard';
import DeveloperToolbar from '../../../components/DeveloperToolbar';

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
                return <BreathPacer {...commonProps} />;
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
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => setShowWidgetInfo(showWidgetInfo === widget.id ? null : widget.id)}
                  className="p-1 text-muted-foreground hover:text-white transition-colors bg-black/20 rounded-full"
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>
              {showWidgetInfo === widget.id && (
                <div className="absolute top-8 right-2 z-20 w-64 p-3 bg-black/90 backdrop-blur border border-white/20 rounded-lg text-xs">
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
          
          {/* Virtue Bars */}
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(virtueTotals).map(([virtue, total]) => (
              <div key={virtue} className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-lg">{getVirtueEmoji(virtue as keyof VirtueTotals)}</span>
                  <span className={`text-sm font-medium ${getVirtueColor(virtue as keyof VirtueTotals)}`}>
                    {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
                  </span>
                </div>
                <div className="w-16 h-2 bg-gray-700 rounded-full">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getVirtueGradient(virtue as keyof VirtueTotals)}`}
                    style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-300 mt-1">{total} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quest Deck */}
      <div className="page-section">
        <QuestDeck 
          quests={quests} 
          completedWidgets={completedWidgets}
        />
      </div>

      {/* Breathwork Practice */}
      <div className="page-section">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="section-title">Breathwork Practice</h2>
          <button
            onClick={() => setShowWidgetInfo(showWidgetInfo === 'breathwork' ? null : 'breathwork')}
            className="p-1 text-muted-foreground hover:text-white transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="section-description">
          Master your breath with {framework.name} breathing patterns
        </p>
        {showWidgetInfo === 'breathwork' && (
          <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-sm text-cyan-200">
              Practice framework-specific breathing patterns to cultivate the core virtues of this tradition. 
              Each pattern is designed to align with the philosophical principles and practical wisdom of {framework.name}.
            </p>
          </div>
        )}
        <div className="max-w-md mx-auto">
          <BreathTimerCircle 
            patternId={params.slug}
            ratio="4:4:4:4"
            useVoice={true}
            volume={0.7}
            onSessionComplete={(session) => {
              console.log('Breathwork session completed:', session);
              // Update virtue totals based on framework
              const virtueGain = 5; // Base virtue gain for breathwork
              setVirtueTotals(prev => ({
                ...prev,
                [framework.virtuePrimary]: prev[framework.virtuePrimary as keyof VirtueTotals] + virtueGain
              }));
            }}
          />
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="page-section">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="section-title">Practice Widgets</h2>
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
              These interactive widgets are specifically designed to help you embody the principles and practices of {framework.name}. 
              Each widget focuses on cultivating the core virtues of this tradition through practical, daily exercises.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {framework.widgets.map((widget: any) => (
            <div key={widget.id}>
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
          <div className="card-base">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Progress</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(virtueTotals).map(([virtue, total]) => (
                <div key={virtue} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{virtue}</span>
                  <span className={`text-sm font-medium ${getVirtueColor(virtue as keyof VirtueTotals)}`}>
                    {total} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Today's Progress</h3>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {completedWidgets.length} / {framework.widgets.length}
              </div>
              <div className="text-sm text-gray-400">Widgets Completed</div>
            </div>
          </div>

          <div className="card-base">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Certification</h3>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round((completedWidgets.length / framework.widgets.length) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Framework Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="page-section">
        <h2 className="section-title">Chat with {framework.name} Guide</h2>
        <p className="section-description">
          Get personalized guidance from the {framework.name} tradition
        </p>
        <FrameworkPersonaChat 
          frameworkId={params.slug} 
          title={framework.name}
        />
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