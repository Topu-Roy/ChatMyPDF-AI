'use client'

import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function MobileNav() {

    const [isOpen, setIsOpen] = useState(false)
    const toggleOpen = () => setIsOpen(prev => !prev)

    const pathName = usePathname();

    //* close the mobile menu if the url changes
    useEffect(() => {
        if (isOpen) toggleOpen();
    }, [pathName])

    return (
        <div className='sm:hidden'>
            <button onClick={toggleOpen} className='h-full w-full flex justify-center items-center'>
                {isOpen ? (
                    <X className='h-5 w-5 text-zinc-700 relative z-50' />
                ) : (
                    <Menu className='h-5 w-5 text-zinc-700 relative z-50' />
                )}
            </button>

            {isOpen ? (
                <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
                    <ul className='absolute bg-white border-b border-zinc-200 shadow-md grid w-full gap-3 px-10 pt-20 pb-4'>
                        <>
                            <li className="">
                                <Link href={'/api/auth/register'} className='flex items-center w-full font-semibold'>
                                    <span className=' text-green-700'>Get started</span>
                                    <ArrowRight className='ml-2 h-5 w-5 text-green-700' />
                                </Link>
                            </li>

                            <li className="my-3 h-px w-full bg-gray-300" />

                            <li className="">
                                <Link href={'/api/auth/login'} className='flex items-center w-full font-semibold'>
                                    Sign in
                                </Link>
                            </li>

                            <li className="my-3 h-px w-full bg-gray-300" />

                            <li className="">
                                <Link href={'/pricing'} className='flex items-center w-full font-semibold'>
                                    Pricing
                                </Link>
                            </li>
                        </>
                    </ul>
                </div>
            ) : null}

        </div>
    )
}