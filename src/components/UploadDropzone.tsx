'use client'

import { Cloud, File } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

export default function UploadDropzone() {

    const [isUploading, setIsUploading] = useState(true)
    const [uploadProgress, setUploadProgress] = useState(0)

    const startFakedUploadProgress = () => {
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 90) {
                    clearInterval(interval)
                    return prevProgress
                }

                return prevProgress + 5
            })
        }, 500)

        return interval;
    }

    return (
        <Dropzone
            multiple={false}
            onDrop={async (acceptedFiles) => {
                setIsUploading(true);

                const progressInterval = startFakedUploadProgress()

                // Pretend api request
                await new Promise((resolve) => setTimeout(resolve, 2000))

                // Clear interval after the upload
                clearInterval(progressInterval)
                setUploadProgress(100)
            }}
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className="border-[2px] h-64 m-4 border-dashed border-gray-300 rounded-lg"
                >
                    <div className="flex justify-center items-center h-full w-full">
                        <label
                            htmlFor="dropzone_file"
                            className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
                        >
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">Click to upload</span> or Drag 'n' drop PDF
                                </p>
                            </div>

                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline-[1.5px] outline-zinc-200 divide-x divide-zinc-200">
                                    <div className="px-3 py-2 grid place-items-center">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="px-3 py-2 truncate">
                                        <p className=" text-sm truncate">
                                            {acceptedFiles[0].name}
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {isUploading ? (
                                <div className={
                                    cn("w-full mt-4 max-w-xs mx-auto", uploadProgress === 0 ? "hidden" : '')
                                }>
                                    <Progress
                                        value={uploadProgress}
                                        className="h-2 bg-zinc-300"
                                    />
                                </div>
                            ) : null}

                        </label>
                        <input id="dropzone_file" {...getInputProps()} />
                    </div>
                </div>
            )}
        </Dropzone >
    );
}
