import { PrismaClient } from '@prisma/client';
import { FRAMEWORKS } from './frameworks-data';

export async function seedFrameworks(prisma: PrismaClient) {
  for (const f of FRAMEWORKS) {
    const { moduleEmphasis = [], ...rest } = f as any;
    const frameworkData = {
      ...rest,
      coreValues: JSON.stringify(rest.coreValues || []),
      dailyRituals: JSON.stringify(rest.dailyRituals || []),
      weeklyChallenges: JSON.stringify(rest.weeklyChallenges || []),
      sayings: JSON.stringify(rest.sayings || []),
      moduleEmphasis: JSON.stringify(moduleEmphasis || []),
      starterProtocol: JSON.stringify(rest.starterProtocol || []),
      meta: JSON.stringify(rest.meta || {})
    };
    
    await prisma.framework.upsert({
      where: { id: f.id },
      update: frameworkData,
      create: frameworkData,
    });
    
    // Create framework-module mappings
    for (const em of moduleEmphasis) {
      await prisma.frameworkModuleMap.upsert({
        where: { frameworkId_moduleId: { frameworkId: f.id, moduleId: em.module_id } },
        update: { emphasis: JSON.stringify(em) },
        create: { frameworkId: f.id, moduleId: em.module_id, emphasis: JSON.stringify(em) },
      });
    }
  }
} 