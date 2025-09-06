#!/bin/bash

echo "🔍 Searching for and removing debug panels and duplicate widgets..."

# Remove any debug panels with yellow backgrounds from today page
sed -i.backup '/Debug Info\|debug.*yellow\|yellow.*debug\|bg-yellow.*debug\|debug.*bg-yellow/d' app/today/page.tsx

# Remove any debug sections or panels
sed -i.backup '/<!-- Debug/,/Debug -->/d' app/today/page.tsx
sed -i.backup '/{\/\* Debug/,/Debug \*\/}/d' app/today/page.tsx

# Remove any sections with "Debug" in className or content
sed -i.backup '/className.*[Dd]ebug\|[Dd]ebug.*className/d' app/today/page.tsx

# Check for duplicate nature photo widgets in tools page
grep -n "nature_photo\|Nature Photo" app/tools/page.tsx

echo "✅ Debug panels and duplicate checks completed"
