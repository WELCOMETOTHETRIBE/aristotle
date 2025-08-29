"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface FrameworkResourceSpotlightProps {
  frameworkId: string;
  frameworkName: string;
  frameworkTone: string;
}

interface Resource {
  id: string;
  title: string;
  thinker?: string;
  era?: string;
  type: string;
  estMinutes?: number;
  keyIdeas?: string[];
  microPractices?: string[];
  reflections?: string[];
  level?: string;
  audioUrl?: string;
}

export default function FrameworkResourceSpotlight({ 
  frameworkId, 
  frameworkName, 
  frameworkTone 
}: FrameworkResourceSpotlightProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/resources');
        if (response.ok) {
          const allResources = await response.json();
          // Filter resources based on framework
          const frameworkResources = allResources.filter((resource: Resource) => {
            const title = resource.title.toLowerCase();
            const thinker = resource.thinker?.toLowerCase() || '';
            const type = resource.type.toLowerCase();
            
            // Framework-specific filtering logic
            switch (frameworkId) {
              case 'spartan':
                return title.includes('sparta') || title.includes('discipline') || 
                       thinker.includes('plutarch') || thinker.includes('xenophon');
              case 'bushido':
                return title.includes('samurai') || title.includes('bushido') || 
                       thinker.includes('yamamoto') || thinker.includes('musashi');
              case 'stoic':
                return title.includes('stoic') || thinker.includes('seneca') || 
                       thinker.includes('marcus aurelius') || thinker.includes('epictetus');
              case 'monastic':
                return title.includes('monastic') || title.includes('benedict') || 
                       thinker.includes('benedict') || type.includes('meditation');
              case 'yogic':
                return title.includes('yoga') || title.includes('patanjali') || 
                       thinker.includes('patanjali') || type.includes('breathwork');
              case 'indigenous':
                return title.includes('indigenous') || title.includes('native') || 
                       thinker.includes('indigenous') || type.includes('community');
              case 'martial':
                return title.includes('martial') || title.includes('kung fu') || 
                       thinker.includes('bruce lee') || type.includes('movement');
              case 'sufi':
                return title.includes('sufi') || title.includes('rumi') || 
                       thinker.includes('rumi') || thinker.includes('hafiz');
              case 'ubuntu':
                return title.includes('ubuntu') || title.includes('community') || 
                       thinker.includes('tutu') || type.includes('service');
              case 'highperf':
                return title.includes('performance') || title.includes('productivity') || 
                       thinker.includes('cal newport') || type.includes('focus');
              default:
                return false;
            }
          });
          setResources(frameworkResources.slice(0, 3)); // Show top 3
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [frameworkId]);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">📚 {frameworkName} Resources</h3>
        <p className="text-gray-300 mb-4">
          Curated wisdom and practices from the {frameworkName} tradition.
        </p>
        <div className="text-sm text-gray-400">
          Resources coming soon...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">📚 {frameworkName} Resources</h3>
      <p className="text-gray-300 mb-6">
        Curated wisdom and practices from the {frameworkName} tradition.
      </p>
      
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-medium text-white">{resource.title}</h4>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                {resource.estMinutes || 15} min
              </span>
            </div>
            
            {resource.thinker && (
              <p className="text-sm text-gray-400 mb-2">
                by {resource.thinker}
                {resource.era && ` (${resource.era})`}
              </p>
            )}
            
            <p className="text-sm text-gray-300 mb-3">
              {resource.type} • {resource.level || 'All levels'}
            </p>
            
            {resource.keyIdeas && resource.keyIdeas.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-blue-300 mb-1">Key Ideas:</h5>
                <ul className="text-xs text-gray-300 space-y-1">
                  {resource.keyIdeas.slice(0, 2).map((idea, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Link
              href={`/resources/${resource.id}`}
              className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
            >
              Explore Resource →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <Link
          href="/resources"
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          View All Resources →
        </Link>
      </div>
    </div>
  );
} 