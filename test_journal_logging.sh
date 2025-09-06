#!/bin/bash

# Add debug logging to the daily wisdom favoriting functionality

# Add console.log statements to help debug journal logging
sed -i '' '/await logToJournal(addLogData);/a\
      console.log("�� Attempting to log quote favorited to journal:", addLogData);\
      const logResult = await logToJournal(addLogData);\
      console.log("📝 Journal log result:", logResult);' components/cards/DailyWisdomCard.tsx

sed -i '' '/await logToJournal(removeLogData);/a\
      console.log("📝 Attempting to log quote unfavorited to journal:", removeLogData);\
      const logResult = await logToJournal(removeLogData);\
      console.log("📝 Journal log result:", logResult);' components/cards/DailyWisdomCard.tsx

echo "Debug logging added to daily wisdom favoriting!"
