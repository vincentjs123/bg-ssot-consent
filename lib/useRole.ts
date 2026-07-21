"use client";

import { useState, useEffect } from "react";
import { loadRole, UserRole } from "./role";

export function useRole(): UserRole | null {
  const [role, setRole] = useState<UserRole | null>(null);
  useEffect(() => {
    setRole(loadRole());
  }, []);
  return role;
}
