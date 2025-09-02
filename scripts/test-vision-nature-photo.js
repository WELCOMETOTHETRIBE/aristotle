const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const sharp = require('sharp');

async function getLatestImage(dir) {
  const entries = await fs.promises.readdir(dir);
  const files = await Promise.all(
    entries.map(async (name) => {
      const full = path.join(dir, name);
      const stat = await fs.promises.stat(full);
      return stat.isFile() ? { name, full, mtime: stat.mtimeMs } : null;
    })
  );
  const images = files
    .filter(Boolean)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
    .sort((a, b) => b.mtime - a.mtime);
  return images[0] || null;
}

async function toDataUrlResized(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isPng = ext === '.png';
  const isWebp = ext === '.webp';
  const mime = isPng ? 'image/png' : isWebp ? 'image/webp' : 'image/jpeg';

  const pipeline = sharp(filePath).rotate().resize({ width: 1024, withoutEnlargement: true });
  let outBuf;
  if (isPng) outBuf = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  else if (isWebp) outBuf = await pipeline.webp({ quality: 80 }).toBuffer();
  else outBuf = await pipeline.jpeg({ quality: 80 }).toBuffer();

  const b64 = outBuf.toString('base64');
  return `data:${mime};base64,${b64}`;
}

async function main() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      process.exit(1);
    }

    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'nature-photos');
    const latest = await getLatestImage(uploadsDir);
    if (!latest) {
      console.log('No images found in uploads directory:', uploadsDir);
      process.exit(0);
    }

    console.log('Using local image:', latest.full);
    const dataUrl = await toDataUrlResized(latest.full);

    const openai = new OpenAI({ apiKey });
    const prompt = 'Look at this nature photo and provide a concise (2-3 sentences) reflective observation about what you see (sky, water, trees, light) and the feeling it evokes.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
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
    console.error('Error running vision test:', err);
    process.exitCode = 1;
  }
}

main(); 