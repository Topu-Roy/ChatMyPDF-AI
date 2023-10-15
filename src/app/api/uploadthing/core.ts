import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/lib/constConfig/stripe";

const f = createUploadthing();

const middleware = async () => {
  //* Authentication checking
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  //* Subscriptions checking
  const subscription = await getUserSubscriptionPlan();

  return { subscription, userId: user.id };
};

type onUploadCompleteType = {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    name: string;
    key: string;
  };
};

const onUploadComplete = async ({ metadata, file }: onUploadCompleteType) => {
  //* add the file info to the database

  const createdFile = await db.file.create({
    data: {
      name: file.name,
      kindeId: metadata.userId,
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

    const pdfPageData = await loader.load();
    const amountOfPages = pdfPageData.length;

    //* Subscription based features
    const { isSubscribed } = metadata.subscription;

    const isProPlanExceededLimit =
      amountOfPages > PLANS.find((p) => p.name === "Pro")!.pagesPerPdf;
    const isFreePlanExceededLimit =
      amountOfPages > PLANS.find((p) => p.name === "Free")!.pagesPerPdf;

    if (
      (isSubscribed && isProPlanExceededLimit) ||
      (!isSubscribed && isFreePlanExceededLimit)
    ) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
        },
      });
    }

    //* Vectorized and index the pdf in PineconeDB
    const pineconeIndex = pinecone.Index("chatmypdf");

    //* Make embedding of the pdf with langchain
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPEN_AI_API_KEY,
    });

    //* Insert the embedding into pinecone
    await PineconeStore.fromDocuments(pdfPageData, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    //* after everything is done
    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (error) {
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
