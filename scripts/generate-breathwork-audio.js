const fs = require('fs');
const path = require('path');

// Simplified audio files for smooth breathwork experience
const audioFiles = [
  // Core breathing instructions - short and clear
  { text: 'Inhale', filename: 'inhale.mp3' },
  { text: 'Hold', filename: 'hold.mp3' },
  { text: 'Exhale', filename: 'exhale.mp3' },
  { text: 'Hold empty', filename: 'hold-empty.mp3' },
  
  // Efficient counting - just the numbers
  { text: 'One', filename: 'count-1.mp3' },
  { text: 'Two', filename: 'count-2.mp3' },
  { text: 'Three', filename: 'count-3.mp3' },
  { text: 'Four', filename: 'count-4.mp3' },
  { text: 'Five', filename: 'count-5.mp3' },
  { text: 'Six', filename: 'count-6.mp3' },
  { text: 'Seven', filename: 'count-7.mp3' },
  { text: 'Eight', filename: 'count-8.mp3' },
  { text: 'Nine', filename: 'count-9.mp3' },
  { text: 'Ten', filename: 'count-10.mp3' },
  { text: 'Eleven', filename: 'count-11.mp3' },
  { text: 'Twelve', filename: 'count-12.mp3' },
  { text: 'Thirteen', filename: 'count-13.mp3' },
  { text: 'Fourteen', filename: 'count-14.mp3' },
  { text: 'Fifteen', filename: 'count-15.mp3' },
  
  // Session messages
  { text: 'Begin your breathwork session', filename: 'session-start.mp3' },
  { text: 'Session complete. Well done', filename: 'session-complete.mp3' },
];

async function generateAudioFile(text, filename) {
  try {
    console.log(`Generating TTS for: "${text}"`);
    
    const response = await fetch('http://localhost:3001/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: 'nova' // Use nova voice for clarity
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Generated: ${filename} -> ${data.url}`);
    
    return data.url;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    return null;
  }
}

async function generateAllAudioFiles() {
  console.log('🎵 Generating breathwork audio files...\n');
  
  const results = [];
  
  for (const audioFile of audioFiles) {
    const url = await generateAudioFile(audioFile.text, audioFile.filename);
    if (url) {
      results.push({
        ...audioFile,
        url: url
      });
    }
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Create the audio mapping
  const audioMapping = {
    instructions: {
      inhale: results.find(r => r.filename === 'inhale.mp3')?.url || '',
      hold: results.find(r => r.filename === 'hold.mp3')?.url || '',
      exhale: results.find(r => r.filename === 'exhale.mp3')?.url || '',
      holdEmpty: results.find(r => r.filename === 'hold-empty.mp3')?.url || ''
    },
    counting: {},
    session: {
      start: results.find(r => r.filename === 'session-start.mp3')?.url || '',
      complete: results.find(r => r.filename === 'session-complete.mp3')?.url || ''
    }
  };

  // Add counting numbers
  for (let i = 1; i <= 15; i++) {
    const countFile = results.find(r => r.filename === `count-${i}.mp3`);
    if (countFile) {
      audioMapping.counting[i.toString()] = countFile.url;
    }
  }

  // Ensure the directory exists
  const audioDir = path.join(process.cwd(), 'public', 'audio', 'breathwork');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Save the mapping
  const mappingPath = path.join(audioDir, 'audio-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(audioMapping, null, 2));
  
  console.log('\n🎉 Audio generation complete!');
  console.log(`📁 Mapping saved to: ${mappingPath}`);
  console.log(`📊 Generated ${results.length} audio files`);
  
  return audioMapping;
}

// Check if running in development
if (process.env.NODE_ENV !== 'production') {
  generateAllAudioFiles().catch(console.error);
} else {
  console.log('⚠️ Audio generation should be run in development mode');
} 