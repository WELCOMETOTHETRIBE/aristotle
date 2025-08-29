'use client';

import { useEffect, useState } from 'react';
import { getToneGradient, getToneTextColor, getToneAccentColor } from '../../../lib/tone';
import Link from 'next/link';
import BreathOfThePath from '../../../components/BreathOfThePath';
import FrameworkResourceSpotlight from '../../../components/FrameworkResourceSpotlight';
import FrameworkPersonaChat from '../../../components/FrameworkPersonaChat';
import ModuleWidget from '../../../components/ModuleWidgets';
import PageLayout, { 
  PageTitle, 
  PageSubtitle, 
  SectionTitle, 
  SectionDescription, 
  CardTitle, 
  CardDescription, 
  PageSection, 
  PageGrid 
} from '../../../components/PageLayout';

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
      <PageLayout background="default">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-16 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-8 bg-white/10 rounded-lg mb-8"></div>
            </div>
            <p className="text-gray-400">Loading framework...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !framework) {
    return (
      <PageLayout background="default">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <PageTitle size="large">Framework Not Found</PageTitle>
            <PageSubtitle className="mt-4">
              {error || 'The framework you\'re looking for could not be loaded.'}
            </PageSubtitle>
            <div className="mt-8">
              <Link
                href="/frameworks"
                className="btn-secondary inline-flex items-center"
              >
                ← Back to All Frameworks
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const virtueEmphasis = getVirtueEmphasis(framework.id);

  return (
    <PageLayout background="default">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${getToneGradient(framework.nav.tone)} py-16 -mt-12`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">{framework.nav.emoji}</div>
            <PageTitle size="large" className={getToneTextColor(framework.nav.tone)}>
              {framework.name}
            </PageTitle>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mt-4">
              <span className={`text-lg font-medium ${getToneTextColor(framework.nav.tone)}`}>
                {framework.nav.badge}
              </span>
            </div>
            
            {/* Virtue Bar */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
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
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breath of the Path */}
        <PageSection>
          <SectionTitle>Breath of the Path</SectionTitle>
          <SectionDescription>
            A breathing technique inspired by the {framework.name} tradition
          </SectionDescription>
          <BreathOfThePath 
            frameworkId={framework.id}
            frameworkName={framework.name}
            frameworkTone={framework.nav.tone}
          />
        </PageSection>

        {/* Core Modules - Interactive Widgets */}
        <PageSection>
          <SectionTitle>Core Modules</SectionTitle>
          <SectionDescription>
            Essential interactive practices that define the {framework.name} tradition
          </SectionDescription>
          <PageGrid cols={2}>
            {framework.coreModules.map((moduleId) => (
              <ModuleWidget
                key={moduleId}
                moduleId={moduleId}
                moduleName={moduleId.replace(/_/g, ' ')}
                frameworkTone={framework.nav.tone}
              />
            ))}
          </PageGrid>
        </PageSection>

        {/* Support Modules - Interactive Widgets */}
        <PageSection>
          <SectionTitle>Support Modules</SectionTitle>
          <SectionDescription>
            Complementary interactive practices that enhance the {framework.name} path
          </SectionDescription>
          <PageGrid cols={2}>
            {framework.supportModules.map((moduleId) => (
              <ModuleWidget
                key={moduleId}
                moduleId={moduleId}
                moduleName={moduleId.replace(/_/g, ' ')}
                frameworkTone={framework.nav.tone}
              />
            ))}
          </PageGrid>
        </PageSection>

        {/* Resource Spotlight */}
        <PageSection>
          <FrameworkResourceSpotlight 
            frameworkId={framework.id}
            frameworkName={framework.name}
            frameworkTone={framework.nav.tone}
          />
        </PageSection>

        {/* Chat with Influential Leader */}
        <PageSection>
          <SectionTitle>Chat with {framework.name} Guide</SectionTitle>
          <SectionDescription>
            Get personalized guidance from the {framework.name} tradition
          </SectionDescription>
          <FrameworkPersonaChat frameworkId={framework.id} title={framework.name} />
        </PageSection>

        {/* Featured Practices */}
        <PageSection>
          <SectionTitle>Featured Practices</SectionTitle>
          <SectionDescription>
            Key practices that embody the {framework.name} tradition
          </SectionDescription>
          <PageGrid cols={3}>
            {framework.featuredPractices.map((practiceSlug) => (
              <div
                key={practiceSlug}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <CardTitle className="capitalize mb-3">
                  {practiceSlug.replace(/_/g, ' ')}
                </CardTitle>
                <CardDescription className="mb-4">
                  A key practice from the {framework.name} tradition
                </CardDescription>
                <div className="text-sm text-gray-400">
                  Coming soon...
                </div>
              </div>
            ))}
          </PageGrid>
        </PageSection>

        {/* Back to Frameworks */}
        <div className="text-center mt-12">
          <Link
            href="/frameworks"
            className="btn-secondary inline-flex items-center"
          >
            ← Back to All Frameworks
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 