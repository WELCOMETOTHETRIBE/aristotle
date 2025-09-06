#!/bin/bash

# Add server-side debugging to daily wisdom API

# Add debug logging at the start of the POST function
sed -i '' '/export async function POST(request: NextRequest) {/a\
  console.log('\''📱 Server Debug - Daily Wisdom API called'\'');\
  console.log('\''📱 Server Debug - User Agent:'\'', request.headers.get('\''user-agent'\''));\
  console.log('\''📱 Server Debug - Content-Type:'\'', request.headers.get('\''content-type'\''));' app/api/generate/daily-wisdom/route.ts

# Add debug logging for the request body
sed -i '' '/const body = await request.json();/a\
  console.log('\''📱 Server Debug - Request body:'\'', body);\
  console.log('\''📱 Server Debug - Frameworks received:'\'', body.frameworks);\
  console.log('\''📱 Server Debug - Date received:'\'', body.date);' app/api/generate/daily-wisdom/route.ts

# Add debug logging for validation
sed -i '' '/if (!framework) {/a\
    console.log('\''📱 Server Debug - Invalid framework:'\'', randomFramework);\
    console.log('\''📱 Server Debug - Available frameworks:'\'', Object.keys(frameworkDefinitions));' app/api/generate/daily-wisdom/route.ts

echo "Server-side debugging added to daily wisdom API!"
