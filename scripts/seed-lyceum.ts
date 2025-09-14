import { PrismaClient } from '@prisma/client';
import { lyceumData } from '../lib/lyceum-data';

const prisma = new PrismaClient();

async function seedLyceum() {
  console.log('🌱 Seeding Lyceum data...');

  try {
    // Clear existing data
    await prisma.lyceumEvaluation.deleteMany();
    await prisma.lyceumActivityResponse.deleteMany();
    await prisma.lyceumLessonProgress.deleteMany();
    await prisma.lyceumPathProgress.deleteMany();
    await prisma.lyceumUserProgress.deleteMany();
    await prisma.lyceumCertificate.deleteMany();
    await prisma.lyceumAgoraComment.deleteMany();
    await prisma.lyceumAgoraLike.deleteMany();
    await prisma.lyceumAgoraPost.deleteMany();
    await prisma.lyceumDailyCheckin.deleteMany();
    await prisma.lyceumAssessment.deleteMany();
    await prisma.lyceumActivity.deleteMany();
    await prisma.lyceumLesson.deleteMany();
    await prisma.lyceumPath.deleteMany();

    console.log('✅ Cleared existing Lyceum data');

    // Seed paths
    for (const path of lyceumData.paths) {
      await prisma.lyceumPath.create({
        data: {
          id: path.id,
          title: path.title,
          description: path.description,
          order: path.order,
          estimatedDuration: path.estimatedDuration,
          difficulty: path.difficulty,
          prerequisites: path.prerequisites || [],
          learningOutcomes: path.learningOutcomes || [],
          tags: path.tags || []
        }
      });
    }

    console.log('✅ Seeded paths');

    // Seed lessons
    for (const lesson of lyceumData.lessons) {
      await prisma.lyceumLesson.create({
        data: {
          id: lesson.id,
          pathId: lesson.pathId,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          estimatedDuration: lesson.estimatedDuration,
          difficulty: lesson.difficulty,
          objectives: lesson.objectives || [],
          keyTerms: lesson.keyTerms || [],
          prerequisites: lesson.prerequisites || [],
          learningOutcomes: lesson.learningOutcomes || [],
          tags: lesson.tags || [],
          scholarMode: lesson.scholarMode ? JSON.stringify(lesson.scholarMode) : null
        }
      });
    }

    console.log('✅ Seeded lessons');

    // Seed activities
    for (const lesson of lyceumData.lessons) {
      if (lesson.activities) {
        for (const activity of lesson.activities) {
          await prisma.lyceumActivity.create({
            data: {
              id: activity.id,
              lessonId: lesson.id,
              title: activity.title,
              description: activity.description,
              type: activity.type,
              order: activity.order,
              estimatedDuration: activity.estimatedDuration,
              difficulty: activity.difficulty,
              instructions: activity.instructions || '',
              expectedOutcome: activity.expectedOutcome || '',
              masteryDomain: activity.masteryDomain,
              tags: activity.tags || []
            }
          });
        }
      }
    }

    console.log('✅ Seeded activities');

    // Seed assessments
    for (const lesson of lyceumData.lessons) {
      if (lesson.assessment) {
        await prisma.lyceumAssessment.create({
          data: {
            id: `${lesson.id}-assessment`,
            lessonId: lesson.id,
            title: lesson.assessment.title,
            description: lesson.assessment.description,
            criteria: lesson.assessment.criteria || [],
            rubric: lesson.assessment.rubric || [],
            passingScore: lesson.assessment.passingScore || 3,
            maxAttempts: lesson.assessment.maxAttempts || 3,
            timeLimit: lesson.assessment.timeLimit || null,
            masteryDomain: lesson.assessment.masteryDomain,
            tags: lesson.assessment.tags || []
          }
        });
      }
    }

    console.log('✅ Seeded assessments');

    console.log('🎉 Lyceum data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${lyceumData.paths.length} paths`);
    console.log(`   - ${lyceumData.lessons.length} lessons`);
    console.log(`   - ${lyceumData.lessons.reduce((sum, lesson) => sum + (lesson.activities?.length || 0), 0)} activities`);
    console.log(`   - ${lyceumData.lessons.filter(lesson => lesson.assessment).length} assessments`);

  } catch (error) {
    console.error('❌ Error seeding Lyceum data:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedLyceum();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedLyceum };