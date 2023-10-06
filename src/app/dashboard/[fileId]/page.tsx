import ChatWrapper from '@/components/chat/ChatWrapper'
import PDFRenderer from '@/components/PDFRenderer'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type PropsType = {
    params: {
        fileId: string
    }
}

export default async function page({ params }: PropsType) {
    // Get the file id from folder param
    const fileId = params.fileId

    // Check if the user is authenticated
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) {
        redirect(`auth-callback?origin=dashboard/${fileId}`)
    }

    // Get the file
    const file = await db.file.findFirst({
        where: {
            kindeUserId: user.id,
            id: fileId,
        }
    })

    if (!file) notFound()

    return (
        <div className='flex flex-1 justify-between flex-col h-[calc(100vh-3.5rem)]'>
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                {/* Left */}
                <div className="flex-1 lg:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        <PDFRenderer url={file.url} />
                    </div>
                </div>

                {/* Right */}
                <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    <ChatWrapper fileId={fileId} />
                </div>
            </div>
        </div>
    )
}
