export type UserRole = "administrator" | "data-administrator" | "viewer";

const KEY = "bg_selected_role";

export function saveRole(role: UserRole): void {
  if (typeof window !== "undefined") localStorage.setItem(KEY, role);
}

export function loadRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEY) as UserRole) || null;
}

export function clearRole(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function canEdit(role: UserRole | null): boolean {
  return role === "administrator" || role === "data-administrator";
}

export function isAdmin(role: UserRole | null): boolean {
  return role === "administrator";
}

export function canManage(role: UserRole | null): boolean {
  return role === "administrator" || role === "data-administrator";
}
