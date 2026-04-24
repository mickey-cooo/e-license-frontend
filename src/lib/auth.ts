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
    async session({ session, token, user }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
    // เอา accessToken ที่ได้จาก NestJS มาเก็บไว้ใน JWT ของ NextAuth
    async jwt({ token, user, account, profile }) {
      if (user) {
        // user object มาจาก authorize() ใน auth.config.ts
        // ซึ่ง NestJS จะตอบกลับมาเป็น { accessToken, refreshToken, ... }
        token.id = user.id;
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
        }
      }
      return token;
    },
  },
  ...authConfig,
});
