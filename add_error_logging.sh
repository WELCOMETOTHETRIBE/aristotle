#!/bin/bash

# Add more detailed error logging to help identify the issue

# Add error logging to the ErrorBoundary
sed -i '' '/componentDidCatch(error: Error, errorInfo: any) {/a\
    console.error('\''🚨 ErrorBoundary caught an error:'\'', {\
      error: error.message,\
      stack: error.stack,\
      componentStack: errorInfo.componentStack,\
      userAgent: navigator.userAgent,\
      timestamp: new Date().toISOString()\
    });' components/ErrorBoundary.tsx

# Add error logging to the global error handler
sed -i '' '/console.error('\''Global error:'\'', error);/a\
    console.error('\''🚨 Global error details:'\'', {\
      message: error.message,\
      stack: error.stack,\
      digest: error.digest,\
      userAgent: navigator.userAgent,\
      timestamp: new Date().toISOString()\
    });' app/error.tsx

echo "Enhanced error logging added!"
