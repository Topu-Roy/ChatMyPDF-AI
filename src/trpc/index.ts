import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  authCallback: publicProcedure.query(() => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // TODO : Check if the user is in the DB

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
