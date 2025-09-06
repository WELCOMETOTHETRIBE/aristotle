#!/bin/bash

# Update the auth page logo size and remove welcome message
sed -i '' 's|width={80}|width={400}|g' app/auth/page.tsx
sed -i '' 's|height={80}|height={400}|g' app/auth/page.tsx
sed -i '' 's|className="w-20 h-20 object-contain"|className="w-96 h-96 object-contain"|g' app/auth/page.tsx

# Remove the welcome message heading
sed -i '' '/<h1 className="text-3xl font-bold text-text mb-2">/,/<\/h1>/d' app/auth/page.tsx

echo "Auth page logo updated successfully!"
