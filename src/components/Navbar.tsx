import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";
import NavUserMenuIcon from "./NavUserLoginOptions";

export default function Navbar() {

    const { getUser } = getKindeServerSession()
    const user = getUser();

    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper className="h-full">
                <div className="flex h-full items-center justify-between border-b border-zinc-200">
                    <Link href={"/"} className="flex z-40 font-bold text-xl">
                        <span>ChatMyPDF.</span>
                    </Link>

                    {/* Todo: Mobile Navigation */}

                    <div className="hidden items-center space-x-4 sm:flex">
                        {!user ? (
                            <>
                                <Link
                                    href={"/pricing"}
                                    className={cn(
                                        buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                        }),
                                        "text-base font-medium"
                                    )}
                                >
                                    <span>Pricing</span>
                                </Link>
                                <LoginLink
                                    className={cn(
                                        buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                        }),
                                        "text-base font-medium"
                                    )}
                                >
                                    Log in
                                </LoginLink>
                                <RegisterLink
                                    className={cn(
                                        buttonVariants({
                                            size: "sm",
                                        }),
                                        "text-center py-5"
                                    )}
                                >
                                    Start for free
                                </RegisterLink>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={'/dashboard'}
                                    className={cn(
                                        buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                        }),
                                        "text-base font-medium"
                                    )}
                                >
                                    Dashboard
                                </Link>
                                <NavUserMenuIcon
                                    email={user.email ?? undefined}
                                    imageUrl={user.picture ?? ''}
                                    name={user.family_name && user.given_name ? `${user.given_name} ${user.family_name}` : 'account'}
                                />
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}
