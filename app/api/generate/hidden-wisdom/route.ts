import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, HiddenWisdomSchema } from "@/lib/ai";
import { hiddenWisdomPrompt } from "@/lib/prompts";
import { formatISO } from "date-fns";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style") || "stoic";
    const locale = searchParams.get("locale") || "en";
    const dateBucket = searchParams.get("dateBucket") || formatISO(new Date(), { representation: "date" });

    const payload = await generateWithCache(
      "hidden_wisdom",
      { style, locale, dateBucket },
      HiddenWisdomSchema,
      hiddenWisdomPrompt({ style, locale, dateBucket })
    );
    
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error generating hidden wisdom:', error);
    
    // Fallback wisdom
    const fallbackWisdom = {
      insight: "Every challenge contains the seed of growth. Embrace difficulties as teachers.",
      micro_experiment: "Today, when you encounter a problem, ask yourself: 'What can I learn from this?'",
      reflection: "How did viewing challenges as opportunities change your experience today?"
    };
    
    return NextResponse.json(fallbackWisdom);
  }
} 