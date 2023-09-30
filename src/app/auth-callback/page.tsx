'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) router.replace(origin ? `${origin}` : '/dashboard')
        },
        onError: ({ data }) => {
            if (data?.code === "UNAUTHORIZED") {
                router.replace('/sign-in')
            }
        },
        retry: true,
        retryDelay: 500
    })

    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold text-xl'>Setting up your account...</h3>
                <p className=''>You will be redirected automatically.</p>
            </div>
        </div>
    )
}
