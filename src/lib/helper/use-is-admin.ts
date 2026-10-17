"use client";

import { useSession } from "next-auth/react";

// UI hint only: the backend rejects admin calls from other roles with 403.
export function useRole() {
  const { data, status } = useSession();
  const role = data?.user?.role;
  return {
    ready: status !== "loading",
    authenticated: status === "authenticated",
    userId: data?.user?.id,
    isAdmin: role === "admin" || role === "super_admin",
  };
}
