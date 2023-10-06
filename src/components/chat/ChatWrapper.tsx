'use client'

import Messages from './Messages'
import ChatInput from './ChatInput'
import { trpc } from '@/app/_trpc/client'
import { Loader2 } from 'lucide-react'

export default function ChatWrapper({ fileId }: { fileId: string }) {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileID: fileId }, {
        refetchInterval: (data) => (data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500)
    })

    if (true) {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 items-center justify-center'>
                <div className="flex flex-1 flex-col justify-between items-center mb-28">
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                        <h3 className='font-semibold text-xl'>
                            Loading...
                        </h3>
                        <p className='text-zinc-500 text-sm text-center'>
                            We&apos;re preparing your PDF.
                        </p>
                    </div>

                    <ChatInput isDisabled={true} />
                </div>
            </div>
        )
    }

    return (
        <div className='relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-col justify-between gap-2'>
            <div className="flex-1 justify-between flex flex-col mb-28">
                <Messages />
            </div>

            <ChatInput />
        </div>
    )
}
