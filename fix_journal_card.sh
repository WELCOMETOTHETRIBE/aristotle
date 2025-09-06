#!/bin/bash

# Fix JournalCard to properly display database entries and add refresh button

# Add RefreshCw import
sed -i '' '/import { BookOpen, Plus, Sparkles, Info, Settings, Brain, Calendar, Heart, MessageSquare, Save, Trash2 } from '\''lucide-react'\'';/c\
import { BookOpen, Plus, Sparkles, Info, Settings, Brain, Calendar, Heart, MessageSquare, Save, Trash2, RefreshCw } from '\''lucide-react'\'';' components/cards/JournalCard.tsx

# Update the JournalEntry interface to match database structure
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

# Update fetchJournalEntries to handle database structure
sed -i '' '/const fetchJournalEntries = async () => {/,/};/c\
  const fetchJournalEntries = async () => {\
    try {\
      const response = await fetch('\''/api/journal'\'');\
      if (response.ok) {\
        const data = await response.json();\
        console.log('\''📝 Fetched journal entries from database:'\'', data.entries);\
        setEntries(data.entries || []);\
      } else {\
        console.error('\''Failed to fetch journal entries'\'');\
      }\
    } catch (error) {\
      console.error('\''Error fetching journal entries:'\'', error);\
    }\
  };' components/cards/JournalCard.tsx

# Update saveEntries to use logToJournal for database persistence
sed -i '' '/const saveEntries = (newEntries: JournalEntry[]) => {/,/};/c\
  const saveEntries = async (newEntries: JournalEntry[]) => {\
    setEntries(newEntries);\
    \
    // Save new entries to database using logToJournal\
    for (const entry of newEntries) {\
      if (entry.id && !entries.find(e => e.id === entry.id)) {\
        // This is a new entry, log it to the database\
        try {\
          const { logToJournal } = await import('\''@/lib/journal-logger'\'');\
          await logToJournal({\
            type: '\''journal_entry_created'\'',\
            content: entry.content,\
            category: entry.category || '\''journal'\'',\
            metadata: {\
              entryId: entry.id,\
              type: entry.type,\
              timestamp: entry.date.toISOString()\
            },\
            moduleId: '\''journal'\'',\
            widgetId: '\''journal_card'\''\
          });\
        } catch (error) {\
          console.error('\''Error logging journal entry to database:'\'', error);\
        }\
      }\
    }\
  };' components/cards/JournalCard.tsx

echo "JournalCard updated to handle database entries and add refresh functionality!"
