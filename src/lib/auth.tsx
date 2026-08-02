import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

type AuthCtx = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api<{
          data: AuthUser;
        }>("/auth/me", {
          credentials: "include",
        });

        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,

      async login(email, password) {
        await api<{
          data: {
            user: AuthUser;
          };
        }>("/auth/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const me = await api<{
          data: AuthUser;
        }>("/auth/me", {
          credentials: "include",
        });

        setUser(me.data);

        return me.data;
      },

      async register(name, email, password) {
        await api<{
          data: {
            user: AuthUser;
          };
        }>("/auth/register", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const me = await api<{
          data: AuthUser;
        }>("/auth/me", {
          credentials: "include",
        });

        setUser(me.data);

        return me.data;
      },

      async logout() {
        try {
          await api("/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } finally {
          setUser(null);
        }
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);

  if (!c) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return c;
}