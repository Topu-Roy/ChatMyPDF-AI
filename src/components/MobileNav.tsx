import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { ArrowRight, Menu } from 'lucide-react'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server'
import { Toggle } from './ui/toggle'

type Props = {}

function MobileNav({ }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus-visible:ring-0 bg-slate-200' asChild>
                <Toggle aria-label="Toggle italic" className='focus-visible:ring-0'>
                    <Menu className='h-5 w-5 text-zinc-700 relative z-50' />
                </Toggle>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] mr-2 bg-white shadow-md grid gap-3 px-2 py-4">
                <DropdownMenuItem className='h-full w-full cursor-pointer'>
                    <RegisterLink href={'/api/auth/register'} className='flex items-center w-full font-semibold'>
                        <span className=' text-green-700'>Get started</span>
                        <ArrowRight className='ml-2 h-5 w-5 text-green-700' />
                    </RegisterLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='h-[2px] bg-black/10' />
                <DropdownMenuItem>
                    <LoginLink href={'/api/auth/login'} className='flex items-center w-full font-semibold'>
                        Sign in
                    </LoginLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='h-[2px] bg-black/10' />
                <DropdownMenuItem>
                    <Link href={'/pricing'} className='flex items-center w-full font-semibold'>
                        Pricing
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MobileNav