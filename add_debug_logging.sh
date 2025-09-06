#!/bin/bash

# Add debug logging to help troubleshoot journal logging issues

# Replace the logToJournal calls with debug versions
sed -i '' 's/await logToJournal(addLogData);/console.log("📝 Attempting to log quote favorited to journal:", addLogData);\
      const logResult = await logToJournal(addLogData);\
      console.log("📝 Journal log result:", logResult);/' components/cards/DailyWisdomCard.tsx

sed -i '' 's/await logToJournal(removeLogData);/console.log("📝 Attempting to log quote unfavorited to journal:", removeLogData);\
      const logResult = await logToJournal(removeLogData);\
      console.log("📝 Journal log result:", logResult);/' components/cards/DailyWisdomCard.tsx

echo "Debug logging added successfully!"
