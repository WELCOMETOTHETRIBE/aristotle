import { PrismaClient } from '@prisma/client';
import { getAllFrameworks } from '../../lib/frameworks.config';

export async function seedFrameworks(prisma: PrismaClient) {
  const frameworks = getAllFrameworks();
  
  for (const framework of frameworks) {
    // Create framework with all data in config
    await prisma.framework.upsert({
      where: { slug: framework.slug },
      update: {
        name: framework.name,
        tone: framework.tone,
        virtuePrimary: framework.virtuePrimary,
        virtueSecondary: framework.virtueSecondary,
        config: {
          widgets: framework.widgets,
          quests: framework.quests,
          capstone: framework.capstone,
          teachingChip: framework.teachingChip
        }
      },
      create: {
        slug: framework.slug,
        name: framework.name,
        tone: framework.tone,
        virtuePrimary: framework.virtuePrimary,
        virtueSecondary: framework.virtueSecondary,
        config: {
          widgets: framework.widgets,
          quests: framework.quests,
          capstone: framework.capstone,
          teachingChip: framework.teachingChip
        }
      },
    });
  }
} 