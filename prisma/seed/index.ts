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

  // Create default user with hashed password
  const hashedPassword = await hashPassword('password123');
  
  const defaultUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@aristotle.com',
      password: hashedPassword,
      displayName: 'Demo User',
      tz: 'America/Los_Angeles'
    }
  });

  console.log('✅ Default user created:', defaultUser.username);

  // Create user preferences
  await prisma.userPreference.upsert({
    where: { userId: defaultUser.id },
    update: {},
    create: {
      userId: defaultUser.id,
      framework: 'stoic',
      style: 'modern',
      locale: 'en'
    }
  });

  console.log('✅ User preferences created');

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