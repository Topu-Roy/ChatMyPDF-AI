import React from 'react'
import UploadButton from './UploadButton'

export default function DashboardComponent() {
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h2 className='mb-3 font-black text-5xl text-gray-900'>
                    My Files
                </h2>

                <UploadButton />
            </div>
        </main>
    )
}
