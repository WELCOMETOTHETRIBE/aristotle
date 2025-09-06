#!/bin/bash

# Fix hydration issues by adding client-side checks for localStorage usage

# Fix HydrationTrackerCard
sed -i '' 's/useEffect(() => {/useEffect(() => {\
    if (typeof window === '\''undefined'\'') return;/' components/cards/HydrationTrackerCard.tsx

# Fix ModuleWidgets HydrationWidget
sed -i '' 's/useEffect(() => {/useEffect(() => {\
    if (typeof window === '\''undefined'\'') return;/' components/ModuleWidgets.tsx

# Fix HabitTrackerCard
sed -i '' 's/useEffect(() => {/useEffect(() => {\
    if (typeof window === '\''undefined'\'') return;/' components/cards/HabitTrackerCard.tsx

# Fix WisdomSpotlightCard
sed -i '' 's/useEffect(() => {/useEffect(() => {\
    if (typeof window === '\''undefined'\'') return;/' components/cards/WisdomSpotlightCard.tsx

echo "Hydration errors fixed!"
