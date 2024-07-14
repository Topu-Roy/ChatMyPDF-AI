import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
export default function middleware(req: unknown) {
  return withAuth(req);
}
export const config = {
  matcher: ["/dashboard", "/auth-callback"]
};