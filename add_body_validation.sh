#!/bin/bash

# Add request body validation to daily wisdom API

# Add validation after JSON parsing
sed -i '' '/const { frameworks, date } = body;/a\
  // Validate request body structure\
  if (!body || typeof body !== '\''object'\'') {\
    console.log('\''📱 Server Debug - Invalid body type:'\'', typeof body);\
    return NextResponse.json(\
      { error: '\''Request body must be an object'\'' },\
      { status: 400 }\
    );\
  }\
  \
  // Validate frameworks field\
  if (body.frameworks && !Array.isArray(body.frameworks)) {\
    console.log('\''📱 Server Debug - Frameworks not an array:'\'', body.frameworks);\
    return NextResponse.json(\
      { error: '\''Frameworks must be an array'\'' },\
      { status: 400 }\
    );\
  }' app/api/generate/daily-wisdom/route.ts

echo "Request body validation added!"
