"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadRole, UserRole } from "./role";

/**
 * Redirects to /dashboard if the current user's role is not in the allowed list.
 * Call at the top of any protected page component.
 */
export function useRoleGuard(allowed: UserRole[]): void {
  const router = useRouter();
  useEffect(() => {
    const role = loadRole();
    if (!role || !allowed.includes(role)) {
      router.replace("/dashboard");
    }
  }, []);
}
