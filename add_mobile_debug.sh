#!/bin/bash

# Add mobile debugging to daily wisdom API calls

# Add debug logging to the API call
sed -i '' '/const response = await fetch('\''\/api\/generate\/daily-wisdom'\'', {/i\
      console.log('\''📱 Mobile Debug - Request body:'\'', {\
        frameworks: frameworksToUse,\
        date: new Date().toISOString().split('\''T'\'')[0],\
        userAgent: navigator.userAgent,\
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)\
      });' components/cards/DailyWisdomCard.tsx

# Add error handling for the response
sed -i '' '/if (response.ok) {/i\
      if (!response.ok) {\
        const errorData = await response.json().catch(() => ({}));\
        console.error('\''📱 Mobile Debug - API Error:'\'', {\
          status: response.status,\
          statusText: response.statusText,\
          error: errorData,\
          requestBody: {\
            frameworks: frameworksToUse,\
            date: new Date().toISOString().split('\''T'\'')[0]\
          }\
        });\
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);\
      }' components/cards/DailyWisdomCard.tsx

echo "Mobile debugging added to daily wisdom API calls!"
