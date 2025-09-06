#!/bin/bash

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

echo "fetchJournalEntries function updated!"
