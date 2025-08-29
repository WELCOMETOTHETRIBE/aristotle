#!/usr/bin/env tsx

import { loadFrameworkMap } from '../lib/frameworkMap';
import { prisma } from '../lib/db';

async function checkFrameworkMap() {
  console.log('🔍 Checking framework map integrity...\n');
  
  let hasErrors = false;
  
  try {
    // Load framework map
    const frameworkMap = loadFrameworkMap();
    console.log(`✅ Loaded framework map (${frameworkMap.frameworks.length} frameworks)`);
    
    // Check if database is available
    if (!prisma) {
      console.log('⚠️  Database not available, skipping DB checks');
      // Continue with non-DB checks
    } else {
      // Check featured practices exist in database
      console.log('\n📋 Checking featured practices...');
      for (const framework of frameworkMap.frameworks) {
        for (const practiceSlug of framework.featuredPractices) {
          const practice = await prisma.virtuePractice.findFirst({
            where: {
              OR: [
                { slug: practiceSlug },
                { slug: practiceSlug.replace(/_/g, '-') },
                { slug: practiceSlug.replace(/-/g, '_') }
              ]
            }
          });
          
          if (!practice) {
            console.error(`❌ Framework "${framework.name}": Practice "${practiceSlug}" not found in database`);
            hasErrors = true;
          } else {
            console.log(`✅ Framework "${framework.name}": Practice "${practiceSlug}" ✓`);
          }
        }
      }
    }
    
    // Check modules exist in catalog
    console.log('\n📚 Checking modules...');
    const allModules = new Set(frameworkMap.catalog.modules);
    
    for (const framework of frameworkMap.frameworks) {
      const allFrameworkModules = [...framework.coreModules, ...framework.supportModules];
      
      for (const moduleId of allFrameworkModules) {
        if (!allModules.has(moduleId)) {
          console.error(`❌ Framework "${framework.name}": Module "${moduleId}" not in catalog`);
          hasErrors = true;
        } else {
          console.log(`✅ Framework "${framework.name}": Module "${moduleId}" ✓`);
        }
      }
    }
    
    // Check for duplicate framework IDs
    console.log('\n🆔 Checking for duplicate framework IDs...');
    const frameworkIds = frameworkMap.frameworks.map((f: any) => f.id);
    const uniqueIds = new Set(frameworkIds);
    
    if (frameworkIds.length !== uniqueIds.size) {
      console.error('❌ Duplicate framework IDs found');
      hasErrors = true;
    } else {
      console.log('✅ No duplicate framework IDs ✓');
    }
    
    // Check for duplicate practice slugs
    console.log('\n🏷️  Checking for duplicate practice slugs...');
    const allPracticeSlugs = frameworkMap.frameworks.flatMap((f: any) => f.featuredPractices);
    const uniqueSlugs = new Set(allPracticeSlugs);
    
    if (allPracticeSlugs.length !== uniqueSlugs.size) {
      console.error('❌ Duplicate practice slugs found');
      hasErrors = true;
    } else {
      console.log('✅ No duplicate practice slugs ✓');
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Frameworks: ${frameworkMap.frameworks.length}`);
    console.log(`- Modules in catalog: ${frameworkMap.catalog.modules.length}`);
    console.log(`- Practices in catalog: ${frameworkMap.catalog.practices.length}`);
    console.log(`- Total featured practices: ${allPracticeSlugs.length}`);
    
    if (hasErrors) {
      console.log('\n❌ Framework map validation failed');
      process.exit(1);
    } else {
      console.log('\n✅ Framework map validation passed');
    }
    
  } catch (error) {
    console.error('❌ Error checking framework map:', error);
    process.exit(1);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

checkFrameworkMap(); 