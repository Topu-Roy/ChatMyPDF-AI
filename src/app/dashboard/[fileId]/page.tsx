import React from "react";
import ChatWrapper from "@/components/chat/ChatWrapper";
import PDFRenderer from "@/components/PDFRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function page({ params }: { params: { fileId: string } }) {
  // Get the file id from folder param
  const fileId = params.fileId;

  // Check if the user is authenticated
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect(`auth-callback?origin=dashboard/${fileId}`);
  if (!user.id) redirect(`auth-callback?origin=dashboard/${fileId}`);

  // Get the file
  const file = await db.file.findFirst({
    where: {
      kindeId: user.id,
      id: fileId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        {/* Left */}
        <div className="flex-1 lg:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>

        {/* Right */}
        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}
