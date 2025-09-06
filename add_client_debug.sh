#!/bin/bash

# Add additional client-side debugging for mobile daily wisdom

# Add debugging before the fetch request
sed -i '' '/const response = await fetch('\''\/api\/generate\/daily-wisdom'\'', {/i\
      console.log('\''📱 Mobile Debug - Settings object:'\'', settings);\
      console.log('\''📱 Mobile Debug - Preferred frameworks:'\'', settings.preferredFrameworks);\
      console.log('\''📱 Mobile Debug - Frameworks to use:'\'', frameworksToUse);\
      console.log('\''📱 Mobile Debug - Request payload:'\'', {\
        frameworks: frameworksToUse,\
        date: new Date().toISOString().split('\''T'\'')[0]\
      });' components/cards/DailyWisdomCard.tsx

echo "Additional client-side debugging added!"
