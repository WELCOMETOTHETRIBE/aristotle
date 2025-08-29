import { PrismaClient } from '@prisma/client';
import { MODULES } from './modules-data';

export async function seedModules(prisma: PrismaClient) {
  for (const m of MODULES) {
    await prisma.module.upsert({
      where: { id: m.id },
      update: { ...m },
      create: { ...m },
    });
    
    // Create 4 default levels per module
    for (const [level, hint] of [
      ["Beginner","1–5 min"],["Intermediate","5–10 min"],["Advanced","10–20 min"],["Expert","20–45 min"]
    ] as const) {
      await prisma.moduleLevel.upsert({
        where: { moduleId_level: { moduleId: m.id, level: level } },
        update: { durationHint: hint },
        create: { moduleId: m.id, level: level, durationHint: hint },
      });
    }
    
    // Create default virtue map (weight 10)
    await prisma.moduleVirtueMap.upsert({
      where: { moduleId_virtue: { moduleId: m.id, virtue: m.defaultVirtue } },
      update: { weight: 10 },
      create: { moduleId: m.id, virtue: m.defaultVirtue, weight: 10 },
    });
  }
} 