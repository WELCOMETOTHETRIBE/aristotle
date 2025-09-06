#!/bin/bash

# Add refresh button to JournalCard header
sed -i '' '/<div className="flex items-center gap-1">/a\
          <button\
            onClick={fetchJournalEntries}\
            className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"\
            title="Refresh from database"\
          >\
            <RefreshCw className="w-4 h-4 text-muted hover:text-text" />\
          </button>' components/cards/JournalCard.tsx

echo "Refresh button added to JournalCard header!"
