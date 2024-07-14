import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";

function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="sm:hidden" asChild>
        <Button className="bg-slate-200 hover:bg-slate-300 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
          <Menu className="relative z-50 h-5 w-5 text-zinc-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 grid w-[200px] gap-3 bg-white px-2 py-4 shadow-md">
        <DropdownMenuItem className="h-full w-full cursor-pointer">
          <RegisterLink
            href={"/api/auth/register"}
            className="flex w-full items-center font-semibold"
          >
            <span className="text-green-700">Get started</span>
            <ArrowRight className="ml-2 h-5 w-5 text-green-700" />
          </RegisterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="h-[2px] bg-black/10" />
        <DropdownMenuItem>
          <LoginLink
            href={"/api/auth/login"}
            className="flex w-full items-center font-semibold"
          >
            Sign in
          </LoginLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="h-[2px] bg-black/10" />
        <DropdownMenuItem>
          <Link
            href={"/pricing"}
            className="flex w-full items-center font-semibold"
          >
            Pricing
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileNav;
