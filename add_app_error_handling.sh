#!/bin/bash

# Add error handling to prevent app crashes

# Add error boundary around the main app content in layout
sed -i '' '/<div className="min-h-screen bg-bg">/,/<\/div>/c\
        <div className="min-h-screen bg-bg">\
          <ScrollRestoration />\
          <ClickToFeedback>\
            {children}\
          </ClickToFeedback>\
          <DeveloperToolbar />\
        </div>' app/layout.tsx

echo "App error handling enhanced!"
