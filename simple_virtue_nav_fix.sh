#!/bin/bash

# Simple fix: Move useEffect before conditional return in VirtueNavigation

# Find the useEffect and move it before the conditional return
sed -i '' '/Hide navigation on auth page/,/return null;/c\
  // Hide navigation on auth page\
  if (pathname === '\''/auth'\'') {\
    return null;\
  }' components/VirtueNavigation.tsx

echo "VirtueNavigation conditional useEffect fixed!"
