import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";
import NavUserMenuIcon from "./NavUserLoginOptions";
import MobileNav from "./MobileNav";

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper className="h-full">
        <div className="flex h-full items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="z-40 flex text-xl font-bold">
            <p>
              PDF<span className="text-blue-600">Chatter</span>.
            </p>
          </Link>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                {/* Desktop */}
                <Link
                  href={"/pricing"}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "hidden text-base font-medium sm:flex",
                  )}
                >
                  <span>Pricing</span>
                </Link>

                {/* Mobile */}
                <LoginLink
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "z-50 text-base font-medium",
                  )}
                >
                  Log in
                </LoginLink>

                {/* Hamburger Menu */}
                <MobileNav />

                {/* Desktop */}
                <RegisterLink
                  className={cn(
                    buttonVariants({
                      size: "sm",
                    }),
                    "hidden py-5 text-center sm:flex",
                  )}
                >
                  Start for free
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href={"/dashboard"}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "text-base font-medium",
                  )}
                >
                  Dashboard
                </Link>
                <NavUserMenuIcon
                  email={user?.email ?? undefined}
                  imageUrl={user?.picture ?? ""}
                  name={
                    user?.family_name && user?.given_name
                      ? `${user?.given_name} ${user?.family_name}`
                      : "account"
                  }
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
