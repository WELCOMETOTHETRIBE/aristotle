import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VirtueRadar from "@/components/VirtueRadar";
import { TodayClient, WisdomClient } from "./today-client";

async function getVirtueScores() {
  if (!prisma) {
    console.warn('Database not available, returning default virtue scores');
    return [
      { virtue: "Wisdom", score: 0 },
      { virtue: "Courage", score: 0 },
      { virtue: "Temperance", score: 0 },
      { virtue: "Justice", score: 0 }
    ];
  }
  
  try {
    const userId = 1; // placeholder user
    const since = new Date(Date.now() - 14 * 24 * 3600 * 1000);
    
    const recent = await prisma.session.findMany({
      where: { 
        userId, 
        startedAt: { gte: since }, 
        moduleId: { not: null } 
      },
      select: { moduleId: true }
    });
    
    const weights = await prisma.moduleVirtueMap.findMany();
    const map = new Map<string, { virtue: string; weight: number }[]>();
    
    for (const w of weights) {
      const arr = map.get(w.moduleId) || [];
      arr.push({ virtue: w.virtue, weight: w.weight });
      map.set(w.moduleId, arr);
    }
    
    const scores: Record<string, number> = { 
      Wisdom: 0, 
      Courage: 0, 
      Temperance: 0, 
      Justice: 0 
    };
    
    for (const r of recent) {
      const vs = map.get(r.moduleId!);
      if (!vs) continue;
      for (const v of vs) scores[v.virtue] = Math.min(100, scores[v.virtue] + v.weight);
    }
    
    // Convert to VirtueData format
    return Object.entries(scores).map(([virtue, score]) => ({
      virtue,
      score
    }));
  } catch (error) {
    console.warn('Failed to fetch virtue scores:', error);
    return [
      { virtue: "Wisdom", score: 0 },
      { virtue: "Courage", score: 0 },
      { virtue: "Temperance", score: 0 },
      { virtue: "Justice", score: 0 }
    ];
  }
}
}

async function getRandomModules() {
  if (!prisma) {
    console.warn('Database not available, returning default modules');
    return [
      { id: "breathwork", name: "Breathwork", domain: "Mind", description: "Train breath to modulate state (calm, focus, energy)." },
      { id: "movement_posture", name: "Movement & Posture", domain: "Body", description: "Mobility, gait, posture as confidence & function." },
      { id: "philosophy_capsules", name: "Philosophy Capsules", domain: "Spirit", description: "Actionable micro-lessons from classic works." }
    ];
  }
  
  try {
    const modules = await prisma.module.findMany({
      orderBy: { name: "asc" }
    });
    
    // Pick 3 modules from different domains
    const domains = ["Mind", "Body", "Spirit", "Community", "Knowledge"];
    const selectedModules = [];
    
    for (const domain of domains) {
      const domainModules = modules.filter((m: any) => m.domain === domain);
      if (domainModules.length > 0) {
        const randomModule = domainModules[Math.floor(Math.random() * domainModules.length)];
        selectedModules.push(randomModule);
        if (selectedModules.length >= 3) break;
      }
    }
    
    return selectedModules;
  } catch (error) {
    console.warn('Failed to fetch modules:', error);
    return [
      { id: "breathwork", name: "Breathwork", domain: "Mind", description: "Train breath to modulate state (calm, focus, energy)." },
      { id: "movement_posture", name: "Movement & Posture", domain: "Body", description: "Mobility, gait, posture as confidence & function." },
      { id: "philosophy_capsules", name: "Philosophy Capsules", domain: "Spirit", description: "Actionable micro-lessons from classic works." }
    ];
  }
}

export default async function TodayPage() {
  const [virtueScores, modules] = await Promise.all([
    getVirtueScores(),
    getRandomModules()
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Today's Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtue Radar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Virtue Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <VirtueRadar data={virtueScores} />
            </CardContent>
          </Card>
        </div>
        
        {/* Hidden Wisdom */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Hidden Wisdom</CardTitle>
            </CardHeader>
            <CardContent>
              <WisdomClient />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Practice Cards */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Today's Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((module: any) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{module.name}</CardTitle>
                <p className="text-sm text-gray-600">{module.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      module.domain === 'Mind' ? 'bg-blue-100 text-blue-800' :
                      module.domain === 'Body' ? 'bg-green-100 text-green-800' :
                      module.domain === 'Spirit' ? 'bg-purple-100 text-purple-800' :
                      module.domain === 'Community' ? 'bg-orange-100 text-orange-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {module.domain}
                    </span>
                  </div>
                  
                                     <TodayClient module={module} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 