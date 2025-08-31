// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../lib/auth';
import { seedModules } from './modules';
import { seedFrameworks } from './frameworks';
import { seedResources } from './resources';
import { seedVirtuePractices } from './virtue-practices';

const prisma = new PrismaClient();

// Seed community data
async function seedCommunity() {
  console.log('🌱 Seeding community data...');

  // Get the demo user
  const demoUser = await prisma.user.findUnique({
    where: { username: 'demo' }
  });

  if (!demoUser) {
    console.log('⚠️  Demo user not found, skipping community seeding');
    return;
  }

  // Create some AI Academy posts
  const aiPosts = [
    {
      title: 'How do you apply Stoic principles when facing workplace adversity?',
      content: 'The AI Academy invites you to reflect on how ancient Stoic wisdom can guide us through modern workplace challenges. Share your experiences and learn from others who have navigated similar situations.',
      type: 'ai_question',
      category: 'Stoicism',
      tags: ['Workplace', 'Adversity', 'Stoic Principles'],
      isAIQuestion: true,
      isPinned: true,
      aiInsights: [
        'Focus on what you can control',
        'Practice negative visualization',
        'Maintain perspective on challenges'
      ]
    },
    {
      title: 'What does Aristotle\'s concept of "eudaimonia" mean in your daily life?',
      content: 'Eudaimonia, often translated as "flourishing" or "human flourishing," is central to Aristotle\'s ethics. How do you understand and pursue this concept in your modern life?',
      type: 'ai_question',
      category: 'Aristotelian Ethics',
      tags: ['Eudaimonia', 'Flourishing', 'Purpose'],
      isAIQuestion: true,
      aiInsights: [
        'Cultivate virtues consistently',
        'Find balance in all activities',
        'Develop meaningful relationships'
      ]
    },
    {
      title: 'How do you practice courage in small, everyday moments?',
      content: 'Courage isn\'t just about grand gestures. The AI Academy asks: How do you demonstrate courage in your daily interactions, decisions, and challenges?',
      type: 'ai_question',
      category: 'Courage',
      tags: ['Daily Practice', 'Small Acts', 'Personal Growth'],
      isAIQuestion: true,
      aiInsights: [
        'Speak up when it matters',
        'Try new things regularly',
        'Face discomfort willingly'
      ]
    }
  ];

  for (const postData of aiPosts) {
    await prisma.communityPost.create({
      data: {
        ...postData,
        authorId: demoUser.id
      }
    });
  }

  // Create some member discussion posts
  const memberPosts = [
    {
      title: 'My journey with morning meditation and its impact on wisdom',
      content: 'I\'ve been practicing morning meditation for 6 months now, and I\'ve noticed significant improvements in my ability to think clearly and make better decisions throughout the day. Has anyone else experienced this?',
      type: 'member_discussion',
      category: 'Wisdom',
      tags: ['Meditation', 'Morning Routine', 'Personal Experience']
    },
    {
      title: 'Building justice in family relationships - practical tips',
      content: 'I\'ve been working on applying principles of justice in my family relationships. Here are some practical strategies that have worked for me...',
      type: 'member_discussion',
      category: 'Justice',
      tags: ['Family', 'Relationships', 'Practical Tips']
    }
  ];

  for (const postData of memberPosts) {
    await prisma.communityPost.create({
      data: {
        ...postData,
        authorId: demoUser.id
      }
    });
  }

  // Create some notifications
  const notifications = [
    {
      type: 'new_question',
      title: 'New AI Academy Question',
      message: 'The AI Academy has posted a new question: "How do you practice courage in small, everyday moments?"',
      isRead: false
    },
    {
      type: 'new_reply',
      title: 'New reply to your comment',
      message: 'Someone replied to your comment on "How do you apply Stoic principles when facing workplace adversity?"',
      isRead: false
    }
  ];

  for (const notificationData of notifications) {
    await prisma.communityNotification.create({
      data: {
        ...notificationData,
        userId: demoUser.id
      }
    });
  }

  console.log('✅ Community data seeded');
}

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

  // Seed community data
  await seedCommunity();

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