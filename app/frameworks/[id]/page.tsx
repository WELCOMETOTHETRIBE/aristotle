import { getFrameworkById } from '@/lib/frameworkMap';
import { getToneGradient, getToneTextColor, getToneAccentColor } from '@/lib/tone';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BreathOfThePath from '@/components/BreathOfThePath';
import FrameworkResourceSpotlight from '@/components/FrameworkResourceSpotlight';
import FrameworkChat from '@/components/FrameworkChat';

interface FrameworkDetailPageProps {
  params: { id: string };
}

export default function FrameworkDetailPage({ params }: FrameworkDetailPageProps) {
  const framework = getFrameworkById(params.id);

  if (!framework) {
    notFound();
  }

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

  // Define leader information for each framework
  const getLeaderInfo = (frameworkId: string) => {
    const leaders: Record<string, any> = {
      'spartan': {
        name: 'King Leonidas',
        title: 'Spartan King & Warrior',
        description: 'Embodying discipline, courage, and the warrior ethos of Sparta.',
        avatar: '🛡️'
      },
      'bushido': {
        name: 'Miyamoto Musashi',
        title: 'Legendary Samurai',
        description: 'Master of the sword and author of "The Book of Five Rings."',
        avatar: '🗡️'
      },
      'stoic': {
        name: 'Marcus Aurelius',
        title: 'Philosopher-Emperor',
        description: 'Roman emperor and author of "Meditations," embodying Stoic wisdom.',
        avatar: '🧱'
      },
      'monastic': {
        name: 'Saint Benedict',
        title: 'Founder of Western Monasticism',
        description: 'Author of "The Rule of Saint Benedict," teaching stability and humility.',
        avatar: '⛪'
      },
      'yogic': {
        name: 'Patanjali',
        title: 'Sage & Yoga Master',
        description: 'Compiler of the Yoga Sutras, guiding the path to self-realization.',
        avatar: '🧘'
      },
      'indigenous': {
        name: 'Wise Elder',
        title: 'Indigenous Wisdom Keeper',
        description: 'Guardian of traditional knowledge and connection to the earth.',
        avatar: '🌿'
      },
      'martial': {
        name: 'Bruce Lee',
        title: 'Martial Artist & Philosopher',
        description: 'Transcended traditional boundaries, teaching adaptability and self-expression.',
        avatar: '🥋'
      },
      'sufi': {
        name: 'Rumi',
        title: 'Sufi Poet & Mystic',
        description: 'Great poet of love and devotion, guiding spiritual awakening.',
        avatar: '🕊️'
      },
      'ubuntu': {
        name: 'Desmond Tutu',
        title: 'Archbishop & Peacemaker',
        description: 'Embodying Ubuntu philosophy: "I am because we are."',
        avatar: '🤝'
      },
      'highperf': {
        name: 'Cal Newport',
        title: 'Author & Professor',
        description: 'Expert in deep work and systematic approaches to excellence.',
        avatar: '🚀'
      }
    };
    return leaders[frameworkId] || leaders['stoic'];
  };

  const virtueEmphasis = getVirtueEmphasis(framework.id);
  const leaderInfo = getLeaderInfo(framework.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${getToneGradient(framework.nav.tone)} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">{framework.nav.emoji}</div>
            <h1 className={`text-5xl font-bold mb-4 ${getToneTextColor(framework.nav.tone)}`}>
              {framework.name}
            </h1>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <span className={`text-lg font-medium ${getToneTextColor(framework.nav.tone)}`}>
                {framework.nav.badge}
              </span>
            </div>
            
            {/* Virtue Bar */}
            <div className="mt-6 flex justify-center gap-2">
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
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Breath of the Path</h2>
          <BreathOfThePath 
            frameworkId={framework.id}
            frameworkName={framework.name}
            frameworkTone={framework.nav.tone}
          />
        </section>

        {/* Core Modules */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Core Modules</h2>
          <p className="text-gray-300 mb-6">
            Essential foundations that define the {framework.name} tradition
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {framework.coreModules.map((moduleId) => (
              <div
                key={moduleId}
                className={`p-6 rounded-lg border-2 ${getToneAccentColor(framework.nav.tone)} bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors`}
              >
                <h3 className="text-lg font-semibold text-white capitalize mb-2">
                  {moduleId.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-300">
                  Essential foundation of this framework
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                    Core Module
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Modules */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Support Modules</h2>
          <p className="text-gray-300 mb-6">
            Complementary practices that enhance the {framework.name} path
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {framework.supportModules.map((moduleId) => (
              <div
                key={moduleId}
                className="p-6 rounded-lg border border-gray-600 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white capitalize mb-2">
                  {moduleId.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-400">
                  Complementary practices
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                    Support Module
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Spotlight */}
        <section className="mb-12">
          <FrameworkResourceSpotlight 
            frameworkId={framework.id}
            frameworkName={framework.name}
            frameworkTone={framework.nav.tone}
          />
        </section>

        {/* Featured Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Featured Practices</h2>
          <p className="text-gray-300 mb-6">
            Key practices that embody the {framework.name} tradition
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {framework.featuredPractices.map((practiceSlug) => (
              <div
                key={practiceSlug}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white mb-3 capitalize">
                  {practiceSlug.replace(/_/g, ' ')}
                </h3>
                <p className="text-gray-300 mb-4">
                  A key practice from the {framework.name} tradition
                </p>
                <div className="text-sm text-gray-400">
                  Coming soon...
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Frameworks */}
        <div className="text-center">
          <Link
            href="/frameworks"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            ← Back to All Frameworks
          </Link>
        </div>
      </div>

      {/* Framework Chat */}
      <FrameworkChat
        frameworkId={framework.id}
        frameworkName={framework.name}
        leaderName={leaderInfo.name}
        leaderTitle={leaderInfo.title}
        leaderDescription={leaderInfo.description}
        leaderAvatar={leaderInfo.avatar}
      />
    </div>
  );
} 