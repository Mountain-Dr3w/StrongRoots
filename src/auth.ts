import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { Provider } from "next-auth/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { env } from "@/env";

type Role = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role?: Role;
  }
}

const providers: Provider[] = [];

if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (env.AUTH_RESEND_KEY && env.AUTH_RESEND_FROM) {
  providers.push(
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: env.AUTH_RESEND_FROM,
    }),
  );
} else {
  providers.push({
    id: "resend",
    type: "email",
    name: "Email",
    from: env.AUTH_RESEND_FROM ?? "auth@strongroots.local",
    maxAge: 24 * 60 * 60,
    options: {},
    async sendVerificationRequest({ url, identifier }) {
      console.log(`\n[dev magic link] for ${identifier}: ${url}\n`);
    },
  } as Provider);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    // Cast: our DDL matches NextAuth's expected columns, but drizzle-adapter's
    // type expects specific JS property names (e.g. refresh_token, access_token
    // in snake_case). Our schema uses camelCase JS properties over snake_case
    // SQL columns, which is functionally identical at runtime.
    usersTable: users as never,
    accountsTable: accounts as never,
    sessionsTable: sessions as never,
    verificationTokensTable: verificationTokens as never,
  }),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: env.AUTH_SECRET,
  trustHost: true,
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: Role }).role ?? "user";
      }
      return session;
    },
  },
});
