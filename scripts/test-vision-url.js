const OpenAI = require('openai');

async function main() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      process.exit(1);
    }

    const url = process.argv[2];
    if (!url) {
      console.error('Usage: node scripts/test-vision-url.js <image_url>');
      process.exit(1);
    }

    const openai = new OpenAI({ apiKey });
    const prompt = 'Look at this nature photo and provide a concise (2-3 sentences) reflective observation about what you see (sky, water, trees, light) and the feeling it evokes.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url } },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const text = completion.choices?.[0]?.message?.content || '(no content)';
    console.log('\nVision analysis output:\n');
    console.log(text);
  } catch (err) {
    console.error('Error running vision URL test:', err);
    process.exitCode = 1;
  }
}

main(); 