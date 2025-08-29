'use client';

import { useEffect, useState } from 'react';
import { getToneGradient, getToneTextColor } from '../../../lib/tone';
import Link from 'next/link';
import FrameworkBreathWidget from '../../../components/FrameworkBreathWidget';
import FrameworkResourceSpotlight from '../../../components/FrameworkResourceSpotlight';
import FrameworkPersonaChat from '../../../components/FrameworkPersonaChat';
import ModuleWidget from '../../../components/ModuleWidgets';
import PageLayout from '../../../components/PageLayout';

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  coreModules: string[];
  supportModules: string[];
  featuredPractices: string[];
}

interface FrameworkDetailPageProps {
  params: { id: string };
}

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFramework = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/frameworks/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Framework not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFramework(data);
      } catch (err) {
        console.error('Error loading framework:', err);
        setError(err instanceof Error ? err.message : 'Failed to load framework');
      } finally {
        setLoading(false);
      }
    };

    loadFramework();
  }, [params.id]);

  // Define virtue emphasis for each framework
  const getVirtueEmphasis = (frameworkId: string) => {
    const virtueMap: Record<string, string[]> = {
      'spartan': ['Courage', 'Temperance'],
      'bushido': ['Honor', 'Courage'],
      'stoic': ['Wisdom', 'Temperance'],
      'monastic': ['Temperance', 'Devotion'],
      'yogic': ['Temperance', 'Wisdom'],
      'indigenous': ['Stewardship', 'Community'],
      'martial': ['Discipline', 'Courage'],
      'sufi': ['Devotion', 'Wisdom'],
      'ubuntu': ['Justice', 'Community'],
      'highperf': ['Wisdom', 'Justice']
    };
    return virtueMap[frameworkId] || ['Wisdom'];
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

  const virtueEmphasis = getVirtueEmphasis(framework.id);

  return (
    <PageLayout showAurora={false}>
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${getToneGradient(framework.nav.tone)} py-16 -mt-12 mb-8`}>
        <div className="text-center">
          <div className="text-6xl mb-4">{framework.nav.emoji}</div>
          <h1 className={`headline mb-4 ${getToneTextColor(framework.nav.tone)}`}>
            {framework.name}
          </h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <span className={`text-lg font-medium ${getToneTextColor(framework.nav.tone)}`}>
              {framework.nav.badge}
            </span>
          </div>
          
          {/* Virtue Bar */}
          <div className="flex justify-center gap-2 flex-wrap">
            {virtueEmphasis.map((virtue) => (
              <span
                key={virtue}
                className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium"
              >
                <span className={getToneTextColor(framework.nav.tone)}>{virtue}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Breath of the Path */}
      <div className="page-section">
        <h2 className="section-title">Breath of the Path</h2>
        <p className="section-description">
          A breathing technique inspired by the {framework.name} tradition
        </p>
        <FrameworkBreathWidget 
          frameworkId={framework.id as keyof typeof import('../../../data/frameworkBreath').FRAMEWORK_BREATH_MAP}
        />
      </div>

      {/* Core Modules */}
      <div className="page-section">
        <h2 className="section-title">Core Modules</h2>
        <p className="section-description">
          Essential practices that define the {framework.name} tradition
        </p>
        <div className="page-grid page-grid-cols-3">
          {framework.coreModules.map((moduleId) => (
            <ModuleWidget
              key={moduleId}
              moduleId={moduleId}
              moduleName={moduleId.replace(/_/g, ' ')}
              frameworkTone={framework.nav.tone}
            />
          ))}
        </div>
      </div>

      {/* Support Modules */}
      <div className="page-section">
        <h2 className="section-title">Support Modules</h2>
        <p className="section-description">
          Complementary practices that enhance the {framework.name} path
        </p>
        <div className="page-grid page-grid-cols-3">
          {framework.supportModules.map((moduleId) => (
            <ModuleWidget
              key={moduleId}
              moduleId={moduleId}
              moduleName={moduleId.replace(/_/g, ' ')}
              frameworkTone={framework.nav.tone}
            />
          ))}
        </div>
      </div>

      {/* Resource Spotlight */}
      <div className="page-section">
        <FrameworkResourceSpotlight 
          frameworkId={framework.id}
          frameworkName={framework.name}
          frameworkTone={framework.nav.tone}
        />
      </div>

      {/* Chat with Influential Leader */}
      <div className="page-section">
        <h2 className="section-title">Chat with {framework.name} Guide</h2>
        <p className="section-description">
          Get personalized guidance from the {framework.name} tradition
        </p>
        <FrameworkPersonaChat frameworkId={framework.id} title={framework.name} />
      </div>

      {/* Featured Practices */}
      <div className="page-section">
        <h2 className="section-title">Featured Practices</h2>
        <p className="section-description">
          Key practices that embody the {framework.name} tradition
        </p>
        <div className="page-grid page-grid-cols-3">
          {framework.featuredPractices.map((practiceSlug) => (
            <div
              key={practiceSlug}
              className="card-base hover-lift"
            >
              <h3 className="font-bold text-white text-lg capitalize mb-3">
                {practiceSlug.replace(/_/g, ' ')}
              </h3>
              <p className="body-text mb-4">
                A key practice from the {framework.name} tradition
              </p>
              <div className="text-sm text-gray-400">
                Practice details will be available soon
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Frameworks */}
      <div className="text-center mt-12">
        <Link href="/frameworks" className="btn-secondary">
          ← Back to All Frameworks
        </Link>
      </div>
    </PageLayout>
  );
} 