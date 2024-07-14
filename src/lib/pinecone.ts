import { env } from "@/env";
import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: "asia-southeast1-gcp-free",
});
