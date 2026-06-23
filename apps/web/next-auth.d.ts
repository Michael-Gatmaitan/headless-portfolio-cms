import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    expiresAt: number;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
  }
}
