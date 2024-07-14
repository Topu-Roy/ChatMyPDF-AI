"use client";

import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";

export default function ChatWrapper({ fileId }: { fileId: string }) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileID: fileId },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    },
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-full items-center justify-center divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-center text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>

          <ChatInput isDisabled={true} />
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative flex min-h-full items-center justify-center divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Processing your PDF...</h3>
            <p className="text-center text-sm text-zinc-500">
              Just a few seconds.
            </p>
          </div>

          <ChatInput isDisabled={true} />
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative flex min-h-full items-center justify-center divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-2">
            <XCircle className="h-8 w-8 text-red-700" />
            <h3 className="text-xl font-semibold">Too many pages...</h3>
            <p className="text-center text-sm text-zinc-500">
              Please upgrade your plan.
            </p>
            <Link
              href={"/dashboard"}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "mt-4 flex items-center justify-center gap-2",
                }),
              )}
            >
              <ChevronLeft className="h-4 w-4 text-zinc-500" />
              <span>Dashboard</span>
            </Link>
          </div>

          <ChatInput isDisabled={true} />
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}
