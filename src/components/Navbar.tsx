import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";

export default function Navbar() {
    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper className="h-full">
                <div className="flex h-full items-center justify-between border-b border-zinc-200">
                    <Link href={"/"} className="flex z-40 font-bold text-xl">
                        <span>ChatMyPDF.</span>
                    </Link>

                    {/* Todo: Mobile Navigation */}

                    <div className="hidden items-center space-x-4 sm:flex">
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
                                        variant: "ghost",
                                        size: "sm",
                                    }),
                                    "text-base font-medium"
                                )}
                            >
                                Sign up
                            </RegisterLink>
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}
