import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_DEFAULT_LIMIT } from '@/lib/constConfig/infinite-query'
import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
    fileId: string
}

function Messages({ fileId }: Props) {

    const { data, isLoading } = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_DEFAULT_LIMIT
    }, {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        keepPreviousData: true
    }
    )

    //* used flatMap to get all message in same level [][] => []
    const messages = data?.pages.flatMap((msg) => msg.messages)

    const loadingMessage = {
        id: 'loading-message',
        createdAt: new Date().toISOString(),
        isUserMessage: false,
        text: (
            //* Mock Ai is loading
            <span className='flex h-full justify-center items-center'>
                <Loader2 className='h-4 w-4 animate-spin' />
            </span>
        )
    }

    //* Insert the loading indicator if necessary
    //* Into the message array
    const messagesWithLoadingState = [
        ...(true ? [loadingMessage] : []),
        ...(data ? [messages] : []),
    ]

    return (
        <div className='flex flex-1 max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div className="">

            </div>
        </div>
    )
}

export default Messages