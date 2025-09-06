#!/bin/bash

# Add a refresh button to the journal widget header

# Add RefreshCw import if not already present
if ! grep -q "RefreshCw" components/cards/JournalCard.tsx; then
  sed -i '' 's/import { BookOpen, Plus, Settings, Info, Sparkles, Heart, TrendingUp, TrendingDown, Minus, X, Save, Edit3, Trash2, Calendar, Tag, Brain, Moon, Sun, Cloud, CloudRain, Zap } from '\''lucide-react'\'';/import { BookOpen, Plus, Settings, Info, Sparkles, Heart, TrendingUp, TrendingDown, Minus, X, Save, Edit3, Trash2, Calendar, Tag, Brain, Moon, Sun, Cloud, CloudRain, Zap, RefreshCw } from '\''lucide-react'\'';/' components/cards/JournalCard.tsx
fi

# Add refresh button to the header
sed -i '' '/<button.*Settings.*>/a\
          <button\
            onClick={refreshEntries}\
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"\
            title="Refresh journal entries"\
          >\
            <RefreshCw className="w-4 h-4 text-muted" />\
          </button>' components/cards/JournalCard.tsx

echo "Refresh button added to journal widget!"
