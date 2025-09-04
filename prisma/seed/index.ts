// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../lib/auth';
import { seedModules } from './modules';
import { seedFrameworks } from './frameworks';
import { seedResources } from './resources';
import { seedVirtuePractices } from './virtue-practices';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed modules
  await seedModules(prisma);
  console.log('✅ Modules seeded');

  // Seed frameworks
  await seedFrameworks(prisma);
  console.log('✅ Frameworks seeded');

  // Seed resources
  await seedResources(prisma);
  console.log('✅ Resources seeded');

  // Seed virtue practices
  await seedVirtuePractices(prisma);
  console.log('✅ Virtue practices seeded');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 