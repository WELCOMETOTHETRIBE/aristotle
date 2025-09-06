#!/bin/bash

# Fix the template literal syntax in the daily wisdom route
sed -i '' 's/\\`/\`/g' app/api/generate/daily-wisdom/route.ts
sed -i '' 's/\\${/\${/g' app/api/generate/daily-wisdom/route.ts

echo "Fixed template literal syntax!"
