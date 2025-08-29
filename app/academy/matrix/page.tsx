"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FrameworkChips } from "@/components/FrameworkChips";
import FrameworkFilter from "@/components/FrameworkFilter";

interface Module {
  id: string;
  name: string;
  domain: string;
  description: string;
  levels: Array<{
    id: number;
    level: string;
    durationHint: string;
  }>;
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

const domainColors = {
  Mind: "bg-blue-100 text-blue-800",
  Body: "bg-green-100 text-green-800", 
  Spirit: "bg-purple-100 text-purple-800",
  Community: "bg-orange-100 text-orange-800",
  Knowledge: "bg-indigo-100 text-indigo-800"
};

export default function MatrixPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load modules
        const modulesResponse = await fetch('/api/modules');
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          setModules(modulesData);
        }
        
        // Load frameworks
        const frameworksResponse = await fetch('/api/frameworks');
        if (frameworksResponse.ok) {
          const frameworksData = await frameworksResponse.json();
          setFrameworks(frameworksData);
        }
      } catch (error) {
        console.error('Error loading matrix data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Group modules by domain
  const groupedModules: Record<string, Module[]> = {};
  modules.forEach((module) => {
    if (!groupedModules[module.domain]) groupedModules[module.domain] = [];
    groupedModules[module.domain].push(module);
  });

  // Get framework data for highlighting
  const selectedFrameworkData = selectedFramework 
    ? frameworks.find(f => f.id === selectedFramework) 
    : null;

  const isModuleCore = (moduleId: string) => {
    return selectedFrameworkData?.coreModules.includes(moduleId) || false;
  };

  const isModuleSupport = (moduleId: string) => {
    return selectedFrameworkData?.supportModules.includes(moduleId) || false;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Academy Matrix</h1>
      
      {/* Framework Filter */}
      <div className="mb-6">
        <FrameworkFilter onFrameworkChange={setSelectedFramework} />
      </div>
      
      {Object.entries(groupedModules).map(([domain, domainModules]) => (
        <div key={domain} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${domainColors[domain as keyof typeof domainColors]}`}>
              {domain}
            </span>
            {domain} Mastery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainModules.map((module) => {
              const isCore = isModuleCore(module.id);
              const isSupport = isModuleSupport(module.id);
              
              let cardClasses = "hover:shadow-lg transition-shadow";
              if (selectedFramework) {
                if (isCore) {
                  cardClasses += " ring-2 ring-blue-500 bg-blue-50";
                } else if (isSupport) {
                  cardClasses += " ring-1 ring-gray-400 bg-gray-50";
                } else {
                  cardClasses += " opacity-50";
                }
              }
              
              return (
                <Card key={module.id} className={cardClasses}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {module.name}
                      {isCore && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Core</span>}
                      {isSupport && <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Support</span>}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Levels:</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.levels.map((level) => (
                            <span key={level.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {level.level} ({level.durationHint})
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Frameworks:</h4>
                        <FrameworkChips moduleId={module.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 