'use client'

import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from '@/app/_trpc/client'
import { httpBatchLink } from '@trpc/client'

function getBaseUrl() {
    if (typeof window !== 'undefined')
        return '';
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`;
    if (process.env.RENDER_INTERNAL_HOSTNAME)
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

function Providers({ children }: PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        })
    )


    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers;