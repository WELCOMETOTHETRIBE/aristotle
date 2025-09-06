#!/bin/bash

# Add fallback mechanism to daily wisdom API for mobile compatibility

# Add robust validation and fallback for frameworks
sed -i '' '/const selectedFrameworks = frameworks && frameworks.length > 0 ? frameworks : ['\''stoic'\''];/c\
  // Robust framework validation with fallback\
  let selectedFrameworks = ['\''stoic'\'']; // Default fallback\
  \
  if (frameworks && Array.isArray(frameworks) && frameworks.length > 0) {\
    // Filter out invalid frameworks and ensure they exist\
    const validFrameworks = frameworks.filter(f => f && typeof f === '\''string'\'' && frameworkDefinitions[f]);\
    if (validFrameworks.length > 0) {\
      selectedFrameworks = validFrameworks;\
    }\
  }\
  \
  console.log('\''📱 Server Debug - Selected frameworks after validation:'\'', selectedFrameworks);' app/api/generate/daily-wisdom/route.ts

echo "API fallback mechanism added for mobile compatibility!"
