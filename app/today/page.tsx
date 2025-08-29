"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserPrefs {
  framework: string | null;
  style: string | null;
  locale: string;
}

interface HiddenWisdom {
  insight: string;
  micro_experiment: string;
  reflection: string;
}

interface PracticeDetail {
  title: string;
  body: string;
  bullets: string[];
  coach_prompts: string[];
  safety_reminders: string[];
  est_time_min: number;
}

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
}

export default function TodayPage() {
  const [userPrefs, setUserPrefs] = useState<UserPrefs | null>(null);
  const [hiddenWisdom, setHiddenWisdom] = useState<HiddenWisdom | null>(null);
  const [practices, setPractices] = useState<PracticeDetail[]>([]);
  const [framework, setFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodayContent = async () => {
      try {
        setLoading(true);
        
        // Load user preferences
        const prefsResponse = await fetch('/api/prefs');
        const prefs = await prefsResponse.json();
        setUserPrefs(prefs);
        
        // Load hidden wisdom
        const dateBucket = new Date().toISOString().split('T')[0];
        const wisdomResponse = await fetch(
          `/api/generate/hidden-wisdom?dateBucket=${dateBucket}&style=${prefs.style || 'aristotle'}&locale=${prefs.locale || 'en'}`
        );
        const wisdom = await wisdomResponse.json();
        setHiddenWisdom(wisdom);
        
        // If user has a framework preference, load framework and practices
        if (prefs.framework) {
          const frameworkResponse = await fetch(`/api/frameworks/${prefs.framework}`);
          const frameworkData = await frameworkResponse.json();
          setFramework(frameworkData);
          
          // Load 2 core + 1 support module practices
          const moduleIds = [
            ...frameworkData.coreModules.slice(0, 2),
            ...frameworkData.supportModules.slice(0, 1)
          ];
          
          const practicePromises = moduleIds.map(moduleId =>
            fetch(`/api/generate/practice?moduleId=${moduleId}&level=Beginner&style=${prefs.framework}&locale=${prefs.locale || 'en'}`)
              .then(r => r.json())
          );
          
          const practiceResults = await Promise.all(practicePromises);
          setPractices(practiceResults);
        }
      } catch (error) {
        console.error('Error loading today content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodayContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Today's Wisdom</h1>
          <p className="text-gray-300">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Hidden Wisdom */}
        {hiddenWisdom && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">✨ Hidden Wisdom</h2>
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">{hiddenWisdom.insight}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Micro Experiment</h4>
                  <p className="text-gray-300">{hiddenWisdom.micro_experiment}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-300 mb-2">Reflection</h4>
                  <p className="text-gray-300">{hiddenWisdom.reflection}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Personalized Practices */}
        {framework && practices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              🎯 {framework.name} Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practices.map((practice, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{practice.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{practice.body}</p>
                  
                  {practice.bullets.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {practice.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>⏱️ {practice.est_time_min} min</span>
                    <span className="text-blue-300">{framework.nav.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Framework Selected */}
        {!framework && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Choose Your Path</h2>
            <div className="p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="text-gray-300 mb-4">
                Select a framework to get personalized practices and wisdom.
              </p>
              <Link
                href="/frameworks"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Explore Frameworks
              </Link>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/breath"
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🫁</div>
              <h3 className="text-white font-medium">Breathwork</h3>
              <p className="text-sm text-gray-400">Find your center</p>
            </Link>
            
            <Link
              href="/coach"
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="text-white font-medium">AI Coach</h3>
              <p className="text-sm text-gray-400">Get guidance</p>
            </Link>
            
            <Link
              href="/progress"
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-white font-medium">Progress</h3>
              <p className="text-sm text-gray-400">Track growth</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 