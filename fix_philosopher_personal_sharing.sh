#!/bin/bash

# Fix philosopher AI responses to allow personal sharing by enhancing the system prompt

# Update the AI comment route to enhance the system prompt
sed -i '' 's/content: randomPhilosopher.systemPrompt/content: `${randomPhilosopher.systemPrompt}

IMPORTANT: When users ask about your personal experiences, thoughts, or examples from your life, you should share relevant insights from your philosophical journey. Do not deflect to generic philosophical discussions - engage authentically with their specific questions about your experiences. Be willing to share examples from your own understanding and journey with your philosophical tradition.`/' app/api/community/ai-comment/route.ts

echo "Philosopher personal sharing fix applied!"
