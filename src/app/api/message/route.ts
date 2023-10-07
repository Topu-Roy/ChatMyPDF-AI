import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validator/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // * Get the body
  const body = req.json();
  if (!body) return NextResponse.json("Body is required", { status: 401 });

  // * Check if the user is authenticated
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  // * Validate the body
  const { fileId, message } = SendMessageValidator.parse(body);

  // * Get the file from the DB
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      kindeUserId: user.id,
    },
  });

  if (!file) NextResponse.json({ error: "Not Found" }, { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user.id,
      fileId: fileId,
    },
  });

  //* Vectorize the messages
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
  });

  const pineconeIndex = pinecone.Index("chatmypdf");
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file?.id,
  });

  const result = await vectorStore.similaritySearch(message, 4);

  const prevMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });
}
