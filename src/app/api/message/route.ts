import { db } from "@/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validator/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { type NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();
  if (!body) return NextResponse.json("Body is required", { status: 401 });

  // * Check if the user is authenticated
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  // * Validate the body
  const { fileId, message } = SendMessageValidator.parse(body);

  // * Get the file from the DB
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      kindeId: user.id,
    },
  });

  if (!file) NextResponse.json({ error: "Not Found" }, { status: 404 });

  await db.file.update({
    where: {
      id: fileId,
    },
    data: {
      lastMessageSentByUser: message,
    },
  });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      kindeId: user.id,
      fileId: fileId,
    },
  });

  //* Vectorized the messages
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
  });

  const pineconeIndex = pinecone.Index("chatmypdf");
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file?.id,
  });

  //* Getting the similarities between the pdf and messages vector
  const result = await vectorStore.similaritySearch(message, 4);

  //* Getting history and formatting them
  const prevMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPreviousMessages = prevMessage.map((msg) => ({
    role: msg.isUserMessage ? "user" : "assistant",
    content: msg.text,
  }));

  //* Prompt and get the response stream from OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the context below or previous conversation (if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the context below or previous conversation (if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPreviousMessages
            .map((message) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })
            .join("")
          }
    
    \n----------------\n
    
    CONTEXT:
    ${result.map((r) => r.pageContent).join("\n\n")}
    
    USER INPUT: ${message}`,
      },
    ],
  });

  //* Streaming the response to the client
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          kindeId: user.id,
          fileId,
          text: completion,
          isUserMessage: false,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
