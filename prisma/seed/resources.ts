import { PrismaClient } from '@prisma/client';
import { RESOURCES } from './resources-data';

export async function seedResources(prisma: PrismaClient) {
  for (const r of RESOURCES) {
    const resourceData = {
      ...r,
      keyIdeas: JSON.stringify(r.keyIdeas || []),
      microPractices: JSON.stringify(r.microPractices || []),
      reflections: JSON.stringify(r.reflections || []),
      meta: JSON.stringify({})
    };
    
    await prisma.resource.upsert({
      where: { id: r.id },
      update: resourceData,
      create: resourceData,
    });
  }
} 