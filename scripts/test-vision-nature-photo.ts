import OpenAI from 'openai';
import { prisma as sharedPrisma } from '@/lib/db';

async function main() {
  try {
    if (!sharedPrisma) {
      console.error('Database not configured (prisma is null). Ensure DATABASE_URL is set.');
      process.exit(1);
    }

    const prisma = sharedPrisma as any;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      process.exit(1);
    }

    const openai = new OpenAI({ apiKey });

    const latest = await prisma.communityPost.findFirst({
      where: { type: 'nature_photo' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, imagePath: true, createdAt: true },
    });

    if (!latest) {
      console.log('No nature_photo community posts found.');
      return;
    }

    if (!latest.imagePath) {
      console.log(`Latest nature_photo post (${latest.id}) has no imagePath.`);
      return;
    }

    console.log('Using image:', latest.imagePath);

    const prompt = 'Look at this nature photo and provide a concise (2-3 sentences) reflective observation about what you see, focusing on elements of nature (e.g., sky, water, trees) and the feeling it evokes.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: latest.imagePath } },
          ],
        } as any,
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