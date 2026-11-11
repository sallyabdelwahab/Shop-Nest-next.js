'use server'

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

/** Read the Route Academy API token stored in the NextAuth JWT. */
export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("__Secure-next-auth.session-token")?.value ??
    cookieStore.get("next-auth.session-token")?.value;

  if (!sessionCookie || !process.env.NEXTAUTH_SECRET) return null;

  try {
    const decoded = await decode({
      token: sessionCookie,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // The API token is stored as accessToken by the NextAuth jwt callback.
    return typeof decoded?.accessToken === "string" ? decoded.accessToken : null;
  } catch (error) {
    console.error("Unable to decode the NextAuth session token:", error);
    return null;
  }
}
