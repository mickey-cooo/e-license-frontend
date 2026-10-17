import NextAuth from "next-auth";
import authConfig from "@/lib/actions/auth.config";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day (NextAuth ใช้หน่วยวินาที ไม่ใช่มิลลิวินาที)
  },
  callbacks: {
    // ส่ง accessToken ไปให้ Client (useSession / getSession) ใช้ได้
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as string | undefined;
      return session;
    },
    // เอา accessToken ที่ได้จาก NestJS มาเก็บไว้ใน JWT ของ NextAuth
    async jwt({ token, user }) {
      if (user) {
        // user comes from authorize() in auth.config.ts
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
  },
  ...authConfig,
});
