import { env } from "@/env";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
});
