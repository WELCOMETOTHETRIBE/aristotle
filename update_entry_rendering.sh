#!/bin/bash

# Update entry rendering to handle database structure
sed -i '' '/<h5 className="text-sm font-medium text-text truncate">{entry.title}<\/h5>/c\
                  <h5 className="text-sm font-medium text-text truncate">{entry.type.replace(/_/g, '\'' '\'').replace(/\b\w/g, l => l.toUpperCase())}</h5>' components/cards/JournalCard.tsx

# Update mood display to handle database structure
sed -i '' '/{settings.showMoodTracking && (/c\
                    {entry.metadata?.mood && (' components/cards/JournalCard.tsx

sed -i '' '/<span className="text-sm">{moodEmojis[entry.mood - 1]}<\/span>/c\
                      <span className="text-sm">{moodEmojis[entry.metadata?.mood - 1] || '\''😐'\''}</span>' components/cards/JournalCard.tsx

# Update timestamp display
sed -i '' '/{entry.timestamp.toLocaleDateString()}/c\
                      {new Date(entry.date).toLocaleDateString()}' components/cards/JournalCard.tsx

# Update content display
sed -i '' '/<p className="text-xs text-muted line-clamp-2">{entry.content}<\/p>/c\
                <p className="text-xs text-muted line-clamp-2">{entry.content}</p>' components/cards/JournalCard.tsx

echo "Entry rendering updated for database structure!"
