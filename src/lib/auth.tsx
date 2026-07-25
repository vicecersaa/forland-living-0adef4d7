import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthCtx = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "forland.auth.v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch {}
  }, [user, ready]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      async login(email, password) {
        await new Promise((r) => setTimeout(r, 550));
        if (!email || password.length < 6) {
          throw new Error("Email atau kata sandi tidak valid.");
        }
        const u: AuthUser = { email, name: email.split("@")[0].replace(/\W+/g, " ") || "Tamu" };
        setUser(u);
        return u;
      },
      async register(name, email, password) {
        await new Promise((r) => setTimeout(r, 600));
        if (!name || !email || password.length < 6) {
          throw new Error("Lengkapi seluruh isian untuk membuat akun.");
        }
        const u: AuthUser = { name, email };
        setUser(u);
        return u;
      },
      logout() {
        setUser(null);
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}