import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const origin = searchParams.get('origin')
    return (
        <div>AuthCallback</div>
    )
}
