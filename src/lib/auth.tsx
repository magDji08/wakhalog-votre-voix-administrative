import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "citizen" | "consultant" | "super_admin";

export const ROLE_LABEL: Record<Role, string> = {
  citizen: "Citoyen",
  consultant: "Consultant",
  super_admin: "Super Admin",
};

// Permission keys cover pages and sensitive actions.
export type Permission =
  | "page:dashboard"
  | "page:conversations"
  | "page:knowledge"
  | "page:intents"
  | "page:users"
  | "page:analytics"
  | "page:models"
  | "page:documents"
  | "page:settings"
  // Actions
  | "users:invite"
  | "users:manage"
  | "knowledge:edit"
  | "intents:edit"
  | "models:configure"
  | "settings:edit"
  | "conversations:view_all"
  | "documents:download_all";

const PERMISSIONS: Record<Role, Permission[]> = {
  citizen: [
    "page:dashboard",
    "page:documents",
    "page:settings",
  ],
  consultant: [
    "page:dashboard",
    "page:conversations",
    "page:knowledge",
    "page:intents",
    "page:analytics",
    "page:documents",
    "page:settings",
    "knowledge:edit",
    "intents:edit",
    "conversations:view_all",
    "documents:download_all",
  ],
  super_admin: [
    "page:dashboard",
    "page:conversations",
    "page:knowledge",
    "page:intents",
    "page:users",
    "page:analytics",
    "page:models",
    "page:documents",
    "page:settings",
    "users:invite",
    "users:manage",
    "knowledge:edit",
    "intents:edit",
    "models:configure",
    "settings:edit",
    "conversations:view_all",
    "documents:download_all",
  ],
};

export type Session = {
  phone: string;
  role: Role;
  name: string;
};

type AuthContextValue = {
  session: Session | null;
  hydrated: boolean;
  login: (s: Session) => void;
  logout: () => void;
  can: (perm: Permission) => boolean;
};

const AuthCtx = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "wakhalog_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      hydrated,
      login: (s) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        setSession(s);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
      can: (perm) => {
        if (!session) return false;
        return PERMISSIONS[session.role].includes(perm);
      },
    }),
    [session, hydrated],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function hasPermission(role: Role, perm: Permission) {
  return PERMISSIONS[role].includes(perm);
}
