#!/bin/bash

# Add client-side debugging more carefully

# Add debugging before the fetch request
sed -i '' '/console.log(`🎯 Loading daily wisdom for frameworks:`/a\
      console.log('\''📱 Mobile Debug - Settings object:'\'', settings);\
      console.log('\''📱 Mobile Debug - Preferred frameworks:'\'', settings.preferredFrameworks);\
      console.log('\''📱 Mobile Debug - Frameworks to use:'\'', frameworksToUse);' components/cards/DailyWisdomCard.tsx

echo "Client-side debugging added correctly!"
