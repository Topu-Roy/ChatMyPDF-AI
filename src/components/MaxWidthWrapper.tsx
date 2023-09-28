import { cn } from '@/lib/utils'
import React from 'react'

export default function MaxWidthWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
            {children}
        </div>
    )
}
