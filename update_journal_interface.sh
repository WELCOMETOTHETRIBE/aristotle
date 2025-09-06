#!/bin/bash

# Update JournalEntry interface to match database structure
sed -i '' '/interface JournalEntry {/,/}/c\
interface JournalEntry {\
  id: string;\
  type: string;\
  content: string;\
  prompt?: string;\
  category?: string;\
  date: Date;\
  aiInsights?: string;\
  metadata?: any;\
}' components/cards/JournalCard.tsx

echo "JournalEntry interface updated to match database structure!"
