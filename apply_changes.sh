#!/bin/bash

# Apply changes to app/auth/page.tsx
sed -i '' 's|<AcademyLogoData className="w-16 h-16" />|<Image\
                src="/eudaimonia.png"\
                alt="EudAimonia Academy Logo"\
                width={80}\
                height={80}\
                className="w-20 h-20 object-contain"\
                priority\
              />|g' app/auth/page.tsx

sed -i '' 's|Welcome to Aristotle|Welcome to EudAimonia Academy|g' app/auth/page.tsx

# Apply changes to app/layout.tsx
sed -i '' 's|title: "Ancient Wisdom Wellness System"|title: "EudAimonia Academy - Ancient Wisdom, AI-Powered Growth"|g' app/layout.tsx

sed -i '' 's|description: "A comprehensive wellness system based on ancient philosophical wisdom and modern science"|description: "A comprehensive wellness system based on ancient philosophical wisdom and modern AI technology"|g' app/layout.tsx

# Apply changes to app/onboarding/page.tsx
sed -i '' 's|Welcome to Aristotle|Welcome to EudAimonia Academy|g' app/onboarding/page.tsx

echo "Changes applied successfully!"
