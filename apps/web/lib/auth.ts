import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function parseJwt(token: string) {
  try {
    // Next.js Edge supports standard atob
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

const nextAuth: NextAuthResult = NextAuth({
  // adapter: DrizzleAdapter
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) return null;

          return {
            id: json.data.user.id,
            name: json.data.user.name,
            email: json.data.user.email,
            accessToken: json.data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        let backendToken = user.accessToken as string;

        if (account?.provider === "google") {
          try {
            const res = await fetch(`${API_URL}/api/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name || "Google User",
              }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
              token.id = json.data.user.id;
              backendToken = json.data.token;
            }
          } catch (error) {
            console.error("Google backend auth error:", error);
          }
        } else if (user) {
          token.id = user.id;
        }

        const decoded = parseJwt(backendToken);
        token.accessToken = backendToken;

        token.expiresAt = decoded?.exp
          ? decoded.exp * 1000
          : Date.now() + 1000 * 60 * 60;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.expiresAt = token.expiresAt as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;
