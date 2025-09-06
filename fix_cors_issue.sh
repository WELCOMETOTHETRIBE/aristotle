#!/bin/bash

# Fix CORS issue by using relative URLs for client-side API calls

# Update journal logger to use relative URLs for client-side calls
sed -i '' 's|const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '\''http://localhost:3000'\'';|// Use relative URL for client-side calls|' lib/journal-logger.ts
sed -i '' 's|const url = `\${baseUrl}/api/journal`;|const url = '\''/api/journal'\'';|' lib/journal-logger.ts

echo "CORS issue fixed - using relative URLs for API calls!"
