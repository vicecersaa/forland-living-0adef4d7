import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "./products";

export type CartItem = {
  id: string;
  size: string;
  color: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: CartItem) => void;
  update: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  resolved: Array<CartItem & { product: Product }>;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "forland.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => {
    const resolved = items
      .map((it) => {
        const product = getProduct(it.id);
        return product ? { ...it, product } : null;
      })
      .filter((x): x is CartItem & { product: Product } => !!x);
    const subtotal = resolved.reduce((s, i) => s + i.product.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      resolved,
      count,
      subtotal,
      add: (item) =>
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size && p.color === item.color);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
            return next;
          }
          return [...prev, item];
        }),
      update: (index, qty) =>
        setItems((prev) => prev.map((p, i) => (i === index ? { ...p, qty: Math.max(1, qty) } : p))),
      remove: (index) => setItems((prev) => prev.filter((_, i) => i !== index)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}