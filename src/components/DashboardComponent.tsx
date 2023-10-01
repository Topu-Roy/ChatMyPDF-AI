"use client";

import React from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Ghost } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function DashboardComponent() {
    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    return (
        <main className="mx-auto max-w-7xl px-2 md:p-10">
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h2 className="mb-3 font-black text-5xl text-gray-900">My Files</h2>

                <UploadButton />
            </div>

            {/* Show user files */}
            {files && files.length !== 0 ? (
                <div>files</div>
            ) : isLoading ? (
                <div className="flex items-center justify-center gap-4 flex-col w-full">
                    <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
                    <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
                    <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
                    <Skeleton className="h-[10vh] w-[100%] bg-slate-400/20" />
                </div>
            ) : (
                <div className="mt-16 flex justify-center items-center flex-col gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="text-xl font-semibold">Looks empty here...</h3>
                    <p>Upload your first PDF</p>
                </div>
            )}
        </main>
    );
}
