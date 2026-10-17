import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import { loginSchema } from "@/schema/login.schema";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          try {
            const res = await fetch(
              `${process.env.API_URL}/api/v1/user/sign-in`,
              {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
              },
            );

            if (!res.ok) return null;

            // NestJS replies { accessToken, user: { uuid } }
            const data = await res.json();
            // the role is a UI hint only; the backend enforces it on every call
            const payload = JSON.parse(
              Buffer.from(data.accessToken.split(".")[1], "base64url").toString(),
            );
            return {
              id: data.user?.uuid,
              accessToken: data.accessToken,
              role: payload.role as string | undefined,
            };
          } catch {
            return null;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
