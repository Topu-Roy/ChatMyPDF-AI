"use client";

import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export default function DashboardComponent({
  isSubscribed,
}: {
  isSubscribed: boolean;
}) {
  // This state is for showing loading status
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  // Toast message by Shadcn-ui
  const { toast } = useToast();

  // To reload the page after any changes
  const utils = trpc.useContext();

  // TRPC Calls
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      void utils.getUserFiles.invalidate();
      toast({
        title: "Delete file",
        description: "We've deleted the file from the database",
      });
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  const sortedFiles = files?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="mx-auto max-w-7xl px-2 md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="mb-3 text-5xl font-black text-gray-900">My Files</h2>
        <UploadButton isSubscribed={isSubscribed} />
      </div>

      {/* Show user files */}
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {sortedFiles?.map((file) => (
            <li
              key={file.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white transition hover:shadow-lg"
            >
              <Link
                href={`/dashboard/${file.id}`}
                className="flex flex-col gap-2"
              >
                <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <div className="flex-1 truncate">{file.name}</div>
                </div>
              </Link>

              <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(file.createdAt), "dd MMM, yyyy")}
                </div>

                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-4 w-4 truncate" />
                  <p>
                    {file.lastMessageSentByUser
                      ? file.lastMessageSentByUser.length > 10
                        ? `${file.lastMessageSentByUser.slice(0, 10)}...`
                        : file.lastMessageSentByUser
                      : "no message"}
                  </p>
                </div>

                <Button
                  onClick={() => deleteFile({ id: file.id })}
                  size={"sm"}
                  variant={"destructive"}
                  className="w-full transition-all duration-200 hover:scale-105"
                >
                  {currentlyDeletingFile === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
          <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
          <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
          <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">Looks empty here...</h3>
          <p>Upload your first PDF</p>
        </div>
      )}
    </main>
  );
}
