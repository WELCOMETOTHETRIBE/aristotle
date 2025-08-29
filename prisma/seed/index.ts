// prisma/seed/index.ts
import { PrismaClient } from "@prisma/client";
import { MODULES } from "./modules";
import { FRAMEWORKS } from "./frameworks";
import { RESOURCES } from "./resources";
import { VIRTUE_PRACTICES } from "./virtue-practices";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Seed modules
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

  // Seed frameworks
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

  // Seed resources
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

  // Seed virtue practices
  for (const p of VIRTUE_PRACTICES) {
    await prisma.virtuePractice.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // Create a default user
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { 
      id: 1,
      email: "demo@aristotle.com",
      displayName: "Demo User"
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 