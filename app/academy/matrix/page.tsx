import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MatrixClient } from "./matrix-client";
import { FrameworkChips } from "@/components/FrameworkChips";
import { FrameworkFilter } from "@/components/FrameworkFilter";

async function getModules() {
  if (!prisma) {
    console.warn('Database not available, returning empty modules list');
    return [];
  }
  
  try {
    const modules = await prisma.module.findMany({
      orderBy: { name: "asc" },
      include: {
        levels: { orderBy: { level: "asc" } }
      }
    });
    return modules;
  } catch (error) {
    console.warn('Failed to fetch modules:', error);
    return [];
  }
}

const domainColors = {
  Mind: "bg-blue-100 text-blue-800",
  Body: "bg-green-100 text-green-800", 
  Spirit: "bg-purple-100 text-purple-800",
  Community: "bg-orange-100 text-orange-800",
  Knowledge: "bg-indigo-100 text-indigo-800"
};

export default async function MatrixPage() {
  const modules = await getModules();
  
  // Group modules by domain
  const groupedModules: Record<string, any[]> = {};
  modules.forEach((module: any) => {
    if (!groupedModules[module.domain]) groupedModules[module.domain] = [];
    groupedModules[module.domain].push(module);
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Academy Matrix</h1>
      
      <FrameworkFilter onFrameworkChange={(frameworkId) => {
        // This will be handled by client-side filtering
        console.log('Framework filter changed:', frameworkId);
      }} />
      
      {Object.entries(groupedModules).map(([domain, domainModules]) => (
        <div key={domain} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${domainColors[domain as keyof typeof domainColors]}`}>
              {domain}
            </span>
            {domain} Mastery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainModules.map((module: any) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Levels:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.levels.map((level: any) => (
                          <span key={level.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {level.level} ({level.durationHint})
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Preview Styles:</h4>
                      <MatrixClient module={module} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Frameworks:</h4>
                      <FrameworkChips moduleId={module.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 