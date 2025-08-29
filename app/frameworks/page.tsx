import { getAllFrameworks } from '@/lib/frameworkMap';
import { getToneGradient, getToneTextColor } from '@/lib/tone';
import Link from 'next/link';
import PageLayout, { 
  PageTitle, 
  PageSubtitle, 
  CardTitle, 
  PageSection, 
  PageGrid 
} from '@/components/PageLayout';

export default function FrameworksPage() {
  const frameworks = getAllFrameworks();

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
    </PageLayout>
  );
} 