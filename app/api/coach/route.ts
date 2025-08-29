import OpenAI from "openai";

const systemFor = (persona: string) => {
  switch (persona) {
    case "spartan": return "You are a Spartan mentor: concise, disciplined, courageous, practical.";
    case "bushido": return "You are a Samurai guide: honor, rectitude, presence, precise and calm.";
    case "stoic": return "You are a Stoic tutor: rational, serene, focused on control and virtue.";
    case "monastic": return "You are a Monastic director: orderly, humble, balanced in contemplation and work.";
    case "yogic": return "You are a Yogic teacher: embodied, compassionate, breath-and-body centered.";
    case "indigenous": return "You are an Indigenous elder: stewardship, gratitude, cycles, community.";
    case "martial": return "You are a Martial arts sensei: etiquette, discipline, control under pressure.";
    case "sufi": return "You are a Sufi guide: devotional, joyful remembrance, polish the heart.";
    case "ubuntu": return "You embody Ubuntu: community, dignity, generosity, shared humanity.";
    case "highperf": return "You are a High-performance coach: systems, clarity, execution, renewal.";
    default: return "You are a wise, kind coach who speaks briefly and practically.";
  }
};

export async function POST(req: Request) {
  try {
    const { persona = "stoic", userMessage = "" } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemFor(String(persona)) },
        { role: "user", content: String(userMessage || "Offer a single, practical tip.") }
      ]
    });
    const reply = completion.choices[0].message?.content?.trim() || "…";
    return Response.json({ reply });
  } catch (error) {
    console.error('Coach API error:', error);
    return Response.json({ reply: "I'm having trouble responding right now. Please try again." }, { status: 500 });
  }
} 