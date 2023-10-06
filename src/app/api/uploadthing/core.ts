import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // add the file to the database

      await db.file.create({
        data: {
          name: file.name,
          kindeUserId: metadata.userId,
          uploadStatus: "PROCESSING",
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          key: file.key,
        },
      });

      //* Index the file into vector databases
      try {
        const res = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );
        //* Make blob object
        const blob = await res.blob();

        //* Load the file in memory
        const loader = new PDFLoader(blob);

        const pageLevelData = await loader.load();
        const amountOfPages = pageLevelData.length;

        //* Vectorized and index the pdf in PineconeDB
        const pineconeIndex = pinecone.Index("chat-my-pdf");
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: "",
        });
      } catch (error) {}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
