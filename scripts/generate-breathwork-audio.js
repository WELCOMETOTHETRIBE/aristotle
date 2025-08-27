const fs = require('fs');
const path = require('path');

// Audio files to generate
const audioFiles = [
  // Breathing instructions
  { text: 'Breathe in deeply', filename: 'inhale-start.mp3' },
  { text: 'Hold your breath', filename: 'hold-start.mp3' },
  { text: 'Release your breath slowly', filename: 'exhale-start.mp3' },
  { text: 'Hold empty', filename: 'hold-empty-start.mp3' },
  
  // Counting numbers
  { text: '1', filename: 'count-1.mp3' },
  { text: '2', filename: 'count-2.mp3' },
  { text: '3', filename: 'count-3.mp3' },
  { text: '4', filename: 'count-4.mp3' },
  { text: '5', filename: 'count-5.mp3' },
  { text: '6', filename: 'count-6.mp3' },
  { text: '7', filename: 'count-7.mp3' },
  { text: '8', filename: 'count-8.mp3' },
  { text: '9', filename: 'count-9.mp3' },
  { text: '10', filename: 'count-10.mp3' },
  { text: '11', filename: 'count-11.mp3' },
  { text: '12', filename: 'count-12.mp3' },
  { text: '13', filename: 'count-13.mp3' },
  { text: '14', filename: 'count-14.mp3' },
  { text: '15', filename: 'count-15.mp3' },
  
  // Session messages
  { text: 'Session complete. Well done.', filename: 'session-complete.mp3' },
  { text: 'Begin your breathwork session', filename: 'session-start.mp3' },
];

async function generateAudioFile(text, filename) {
  try {
    console.log(`Generating: ${filename} - "${text}"`);
    
    const response = await fetch('http://localhost:3001/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: 'nova',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Generated: ${filename}`);
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
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save the mapping to a JSON file
  const audioMapping = {
    instructions: {
      inhale: results.find(r => r.filename === 'inhale-start.mp3')?.url,
      hold: results.find(r => r.filename === 'hold-start.mp3')?.url,
      exhale: results.find(r => r.filename === 'exhale-start.mp3')?.url,
      holdEmpty: results.find(r => r.filename === 'hold-empty-start.mp3')?.url,
    },
    counting: Object.fromEntries(
      results
        .filter(r => r.filename.startsWith('count-'))
        .map(r => [r.filename.replace('count-', '').replace('.mp3', ''), r.url])
    ),
    session: {
      start: results.find(r => r.filename === 'session-start.mp3')?.url,
      complete: results.find(r => r.filename === 'session-complete.mp3')?.url,
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'public/audio/breathwork/audio-mapping.json'),
    JSON.stringify(audioMapping, null, 2)
  );
  
  console.log('\n📁 Audio mapping saved to: public/audio/breathwork/audio-mapping.json');
  console.log(`\n✅ Generated ${results.length}/${audioFiles.length} audio files successfully!`);
  
  return audioMapping;
}

// Run the script
generateAllAudioFiles().catch(console.error); 