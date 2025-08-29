import { PrismaClient } from '@prisma/client';
import { VIRTUE_PRACTICES } from './virtue-practices-data';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function seedVirtuePractices(prisma: PrismaClient) {
  for (const p of VIRTUE_PRACTICES) {
    const practiceData = {
      ...p,
      slug: p.slug ?? slugify(p.title),
      virtue: 'Wisdom', // Default virtue
      shortDesc: p.description,
      targetModuleId: null,
      tags: JSON.stringify([]),
      safety: p.safetyNotes,
      measurement: p.metrics,
      meta: JSON.stringify({})
    };
    
    await prisma.virtuePractice.upsert({
      where: { slug: practiceData.slug },
      update: practiceData,
      create: practiceData,
    });
  }
} 