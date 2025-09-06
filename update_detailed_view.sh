#!/bin/bash

# Update detailed entry view for database structure
sed -i '' '/{entry.wordCount} words • {entry.tags.join('\'', '\'')}/c\
                      {entry.content.length} characters • {entry.category || '\''General'\''}' components/cards/JournalCard.tsx

# Update AI insights display
sed -i '' '/{entry.aiInsights.map((insight, index) => (/c\
                        {entry.aiInsights && entry.aiInsights.split('\''\n'\'').map((insight, index) => (' components/cards/JournalCard.tsx

echo "Detailed entry view updated for database structure!"
