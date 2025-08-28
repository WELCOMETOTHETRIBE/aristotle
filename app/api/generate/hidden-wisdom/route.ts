import { generateWithCache, HiddenWisdomSchema } from "@/lib/ai";
import { hiddenWisdomPrompt } from "@/lib/prompts";
import { formatISO } from "date-fns";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const style = url.searchParams.get("style") || "stoic";
  const locale = url.searchParams.get("locale") || "en";
  const dateBucket = formatISO(new Date(), { representation: "date" });

  const payload = await generateWithCache(
    "hidden_wisdom",
    { style, locale, dateBucket },
    HiddenWisdomSchema,
    hiddenWisdomPrompt({ style, locale, dateBucket })
  );
  return Response.json(payload);
} 