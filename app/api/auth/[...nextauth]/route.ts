import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FailedLoginResponse, SuccessLoginResponse } from "@/app/interfaces";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const response = await fetch(
          "https://ecommerce.routemisr.com/api/v1/auth/signin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
          }
        );

        const payload = (await response.json()) as
          | SuccessLoginResponse
          | FailedLoginResponse;

        if (!response.ok || !("token" in payload) || !payload.token) {
          throw new Error(payload.message || "Invalid email or password");
        }

        return {
          id: payload.user.email,
          name: payload.user.name,
          email: payload.user.email,
          user: payload.user,
          token: payload.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as typeof session.user;
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
