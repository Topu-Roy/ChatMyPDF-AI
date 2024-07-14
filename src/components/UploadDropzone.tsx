"use client";

import { Cloud, File, Loader2 } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

export default function UploadDropzone({
  isSubscribed,
}: {
  isSubscribed: boolean;
}) {
  const [isUploading, setIsUploading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const { toast } = useToast();
  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader",
  );

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startFakedUploadProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return prevProgress;
        }

        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        // Start the progress bar
        const progressInterval = startFakedUploadProgress();

        // Upload the file to uploadthing
        const res = await startUpload(acceptedFiles);

        if (!res || res[0]?.key) {
          setUploadProgress(0);
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Only PDF files can be uploaded",
          });
        }

        if (res) {
          const key = res[0]?.key;

          if (!key) {
            setUploadProgress(0);
            return toast({
              title: "Something went wrong",
              description: "File not saved on the database",
              variant: "destructive",
            });
          }

          // Clear interval after the upload
          clearInterval(progressInterval);
          setUploadProgress(100);

          // Try to get the upload progress
          // by checking if the file is on the db
          startPolling({ key });
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border-[2px] border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone_file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or Drag
                  &apos;n&apos; drop
                </p>
                <p>PDF only (max {isSubscribed ? "16MB" : "4MB"})</p>
              </div>

              {acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline-[1.5px] outline-zinc-200">
                  <div className="grid place-items-center px-3 py-2">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="truncate px-3 py-2">
                    <p className="truncate text-sm">{acceptedFiles[0].name}</p>
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div
                  className={cn(
                    "mx-auto mt-4 w-full max-w-xs",
                    uploadProgress === 0 ? "hidden" : "",
                  )}
                >
                  <Progress
                    successColor={uploadProgress === 100 ? "bg-green-500" : ""}
                    value={uploadProgress}
                    className="h-2 bg-zinc-300"
                  />
                </div>
              ) : null}

              {uploadProgress === 100 ? (
                <div className="flex flex-col items-center justify-center gap-2 pt-4 text-center text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Redirecting...</p>
                </div>
              ) : null}

              <input
                {...getInputProps()}
                className="hidden"
                type="file"
                id="dropzone_file"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
