import { getAllFrameworks } from '@/lib/frameworkMap';
import { getToneGradient, getToneTextColor } from '@/lib/tone';
import Link from 'next/link';

export default function FrameworksPage() {
  const frameworks = getAllFrameworks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Ancient Wisdom Frameworks
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore timeless traditions and their practical applications for modern life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {frameworks.map((framework) => (
            <Link
              key={framework.id}
              href={`/frameworks/${framework.id}`}
              className="group block"
            >
              <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getToneGradient(framework.nav.tone)} p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">{framework.nav.emoji}</div>
                  <h3 className={`text-xl font-bold mb-2 ${getToneTextColor(framework.nav.tone)}`}>
                    {framework.name}
                  </h3>
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
        </div>
      </div>
    </div>
  );
} 