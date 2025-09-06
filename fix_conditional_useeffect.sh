#!/bin/bash

# Fix the conditional useEffect in VirtueNavigation

# Move the useEffect before the conditional return
sed -i '' '/Hide navigation on auth page/,/return null;/c\
  // Hide navigation on auth page\
  if (pathname === '\''/auth'\'') {\
    return null;\
  }' components/VirtueNavigation.tsx

echo "Conditional useEffect fixed in VirtueNavigation!"
