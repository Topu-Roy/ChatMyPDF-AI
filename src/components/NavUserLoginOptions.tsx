import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Gem } from 'lucide-react'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'
import Link from 'next/link'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import Image from 'next/image'
import { Icons } from './MyIcons'

type Props = {
    email: string | undefined
    name: string
    imageUrl: string
}

async function NavUserMenuIcon({ email, imageUrl, name }: Props) {

    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    className='rounded-full h-9 w-9'
                >
                    <Avatar>
                        {imageUrl ? (
                            <Image src={imageUrl} height={50} width={50} alt={name} />
                        ) : (
                            <AvatarFallback className='bg-slate-400/40'>
                                <span className='sr-only'>
                                    {name ? name : "Profile"}
                                </span>
                                <Icons.user className='h-4 w-4 text-zinc-900' />
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>

                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                        {name ? (
                            <p className='font-medium text-sm text-black'>
                                {name}
                            </p>
                        ) : null}
                        {email ? (
                            <p className='w-[200ox] truncate text-xs text-zinc-700'>
                                {email}
                            </p>
                        ) : null}

                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer' asChild>
                    <Link href={'/dashboard'}>
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer' asChild >
                    {subscriptionPlan.isSubscribed ? (
                        <Link href={'/dashboard/billing'}>
                            Manage subscription
                        </Link>
                    ) : (
                        <Link href={'/pricing'}>
                            <span>Upgrade Pro</span>
                            <Gem className='text-blue-600 h-4 w-4 ml-1.5' />
                        </Link>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer bg-rose-300' asChild>
                    <LogoutLink>
                        Log out
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavUserMenuIcon