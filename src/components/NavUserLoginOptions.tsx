import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { UserIcon } from 'lucide-react'

type Props = {
    email: string | undefined
    name: string
    imageUrl: string
}

function NavUserMenuIcon({ email, imageUrl, name }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Avatar>
                        {imageUrl ? (
                            <AvatarImage src={imageUrl} />
                        ) : (
                            <AvatarFallback>
                                <span className='sr-only'>
                                    {name ? name : "Profile"}
                                </span>
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent></DropdownMenuContent>
        </DropdownMenu>
    )
}

{/* <LogoutLink
                                        className={cn(
                                            buttonVariants({
                                                size: "sm",
                                            }),
                                            "text-center py-5"
                                        )}
                                    >
                                        Log out
                                    </LogoutLink> */}

export default NavUserMenuIcon