#!/bin/bash

# Fix the JournalCard to fetch entries from database instead of localStorage

# Update the JournalCard to fetch from API
sed -i '' '/Load saved data/,/}, \[\]);/c\
  // Load journal entries from database API\
  useEffect(() => {\
    fetchJournalEntries();\
  }, []);\
\
  const fetchJournalEntries = async () => {\
    try {\
      const response = await fetch('\''/api/journal'\'');\
      if (response.ok) {\
        const data = await response.json();\
        setEntries(data.entries || []);\
      } else {\
        console.error('\''Failed to fetch journal entries'\'');\
      }\
    } catch (error) {\
      console.error('\''Error fetching journal entries:'\'', error);\
    }\
  };' components/cards/JournalCard.tsx

echo "Journal widget updated to use database API!"
