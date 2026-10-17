import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        accessToken?: string;
        role?: string;
    }

    interface Session extends DefaultSession {
        accessToken: string;
        refreshToken: string;
        user: {
          id?: string;
          role?: string;
          name?: string
        } & DefaultSession['user']
    }

    interface JWT {
        accessToken: string;
        refreshToken: string;
    }

    declare module "next-auth/jwt" {
        interface JWT {
            accessToken: string;
            refreshToken: string;
            role?: string;
        }
    }
}