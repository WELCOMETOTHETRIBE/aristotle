#!/bin/bash

# Add RefreshCw import to JournalCard
sed -i '' 's/import { BookOpen, Plus, Sparkles, Info, Settings, Brain, Calendar, Heart, MessageSquare, Save, Trash2 } from '\''lucide-react'\'';/import { BookOpen, Plus, Sparkles, Info, Settings, Brain, Calendar, Heart, MessageSquare, Save, Trash2, RefreshCw } from '\''lucide-react'\'';/' components/cards/JournalCard.tsx

echo "RefreshCw import added to JournalCard!"
