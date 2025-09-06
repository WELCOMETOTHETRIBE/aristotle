#!/bin/bash

# Add robust JSON parsing error handling to daily wisdom API

# Add try-catch around JSON parsing
sed -i '' '/const body = await request.json();/c\
  let body;\
  try {\
    body = await request.json();\
  } catch (error) {\
    console.log('\''�� Server Debug - JSON parsing error:'\'', error);\
    console.log('\''📱 Server Debug - Request body (raw):'\'', await request.text());\
    return NextResponse.json(\
      { error: '\''Invalid JSON in request body'\'' },\
      { status: 400 }\
    );\
  }' app/api/generate/daily-wisdom/route.ts

echo "Robust JSON parsing error handling added!"
