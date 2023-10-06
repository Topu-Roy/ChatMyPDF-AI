'use client'

import Messages from './Messages'
import ChatInput from './ChatInput'
import { trpc } from '@/app/_trpc/client'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import { ChatContext, ChatContextProvider } from './ChatContext'

export default function ChatWrapper({ fileId }: { fileId: string }) {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileID: fileId }, {
        refetchInterval: (data) => (data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500)
    })

    if (isLoading) {
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

    if (data?.status === 'PROCESSING') {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 items-center justify-center'>
                <div className="flex flex-1 flex-col justify-between items-center mb-28">
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                        <h3 className='font-semibold text-xl'>
                            Processing your PDF...
                        </h3>
                        <p className='text-zinc-500 text-sm text-center'>
                            Just a few seconds.
                        </p>
                    </div>

                    <ChatInput isDisabled={true} />
                </div>
            </div>
        )
    }

    if (data?.status === 'FAILED') {
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 items-center justify-center'>
                <div className="flex flex-1 flex-col justify-between items-center mb-28">
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <XCircle className='h-8 w-8 text-red-700' />
                        <h3 className='font-semibold text-xl'>
                            Too many pages...
                        </h3>
                        <p className='text-zinc-500 text-sm text-center'>
                            Please upgrade your plan.
                        </p>
                        <Link href={'/dashboard'} className={cn(buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                            className: 'mt-4 flex justify-center items-center gap-2'
                        }))}>
                            <ChevronLeft className='h-4 w-4 text-zinc-500' />
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    <ChatInput isDisabled={true} />
                </div>
            </div>
        )
    }

    return (
        <ChatContextProvider fileId={fileId}>
            <div className='relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-col justify-between gap-2'>
                <div className="flex-1 justify-between flex flex-col mb-28">
                    <Messages />
                </div>

                <ChatInput />
            </div>
        </ChatContextProvider>
    )
}
