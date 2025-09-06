#!/bin/bash

# Fix conditional useAuth hook in auth page
sed -i '' '/Safe auth context usage with error boundary/,/const { signIn, signUp, user, loading } = authContext || {};/c\
  // Always call useAuth hook - React hooks must be called unconditionally\
  const { signIn, signUp, user, loading } = useAuth();' app/auth/page.tsx

# Fix conditional useEffect in VirtueNavigation
sed -i '' '/Hide navigation on auth page/,/return null;/c\
  // Hide navigation on auth page\
  if (pathname === '\''/auth'\'') {\
    return null;\
  }' components/VirtueNavigation.tsx

echo "React hook errors fixed!"
