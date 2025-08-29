'use client';

import { useEffect, useState } from 'react';
import { getToneGradient, getToneTextColor } from '../../lib/tone';
import Link from 'next/link';
import PageLayout, { 
  PageTitle, 
  PageSubtitle, 
  CardTitle, 
  PageSection, 
  PageGrid,
  SectionTitle,
  SectionDescription
} from '../../components/PageLayout';
// import ModuleWidget from '../../components/ModuleWidgets';

interface Framework {
  id: string;
  name: string;
  nav: {
    tone: string;
    badge: string;
    emoji: string;
  };
  coreModules: string[];
  featuredPractices: string[];
}

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/frameworks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFrameworks(data);
      } catch (err) {
        console.error('Error loading frameworks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load frameworks');
        // Set fallback frameworks
        setFrameworks([
          {
            id: 'spartan',
            name: 'Spartan Agōgē',
            nav: { tone: 'gritty', badge: 'Discipline', emoji: '🛡️' },
            coreModules: ['strength', 'discipline', 'courage'],
            featuredPractices: ['cold_exposure', 'adversity_training']
          },
          {
            id: 'stoic',
            name: 'Stoicism',
            nav: { tone: 'calm', badge: 'Clarity', emoji: '🧱' },
            coreModules: ['wisdom', 'temperance', 'reflection'],
            featuredPractices: ['evening_reflection', 'memento_mori']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFrameworks();
  }, []);

  if (loading) {
    return (
      <PageLayout background="default">
        <PageSection spacing="large">
          <div className="text-center">
            <PageTitle>Ancient Wisdom Frameworks</PageTitle>
            <PageSubtitle className="mt-4 max-w-2xl mx-auto">
              Loading frameworks...
            </PageSubtitle>
          </div>
        </PageSection>
        
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>
        </PageSection>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout background="default">
        <PageSection spacing="large">
          <div className="text-center">
            <PageTitle>Ancient Wisdom Frameworks</PageTitle>
            <PageSubtitle className="mt-4 max-w-2xl mx-auto">
              Unable to load frameworks
            </PageSubtitle>
            <p className="text-gray-400 mt-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary mt-6"
            >
              Try Again
            </button>
          </div>
        </PageSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout background="default">
      <PageSection spacing="large">
        <div className="text-center">
          <PageTitle>Ancient Wisdom Frameworks</PageTitle>
          <PageSubtitle className="mt-4 max-w-2xl mx-auto">
            Explore timeless traditions and their practical applications for modern life
          </PageSubtitle>
        </div>
      </PageSection>

      <PageSection>
        <PageGrid cols="auto">
          {frameworks.map((framework) => (
            <Link
              key={framework.id}
              href={`/frameworks/${framework.id}`}
              className="group block"
            >
              <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getToneGradient(framework.nav.tone)} p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl h-full`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">{framework.nav.emoji}</div>
                  <CardTitle className={`mb-2 ${getToneTextColor(framework.nav.tone)}`}>
                    {framework.name}
                  </CardTitle>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className={`text-sm font-medium ${getToneTextColor(framework.nav.tone)}`}>
                      {framework.nav.badge}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-xs text-white/70 mb-2">
                    Core Modules: {framework.coreModules.length}
                  </div>
                  <div className="text-xs text-white/70">
                    Featured Practices: {framework.featuredPractices.length}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </PageGrid>
      </PageSection>

      {/* Interactive Widgets Preview */}
      {/* <PageSection>
        <div className="text-center mb-8">
          <SectionTitle>Interactive Practice Widgets</SectionTitle>
          <SectionDescription>
            Each framework includes interactive widgets for hands-on practice
          </SectionDescription>
        </div>
        <PageGrid cols={3}>
          <ModuleWidget moduleId="breathwork" moduleName="Breathwork" />
          <ModuleWidget moduleId="focus_deepwork" moduleName="Focus Timer" />
          <ModuleWidget moduleId="gratitude_awe" moduleName="Gratitude Journal" />
        </PageGrid>
      </PageSection> */}
    </PageLayout>
  );
} 