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

            const user = await res.json();
            // NestJS ควรตอบกลับมาเป็น { accessToken, refreshToken, ... }
            return user;
          } catch {
            return null;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
