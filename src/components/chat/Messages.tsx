import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_DEFAULT_LIMIT } from '@/lib/constConfig/infinite-query'
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

    return (
        <div>Messages</div>
    )
}

export default Messages