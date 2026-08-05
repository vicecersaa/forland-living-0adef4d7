import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string; slug: string };
  description: string;
  images: string[];
  thumbnail: string;
  video: string;
  price: number | null;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  variants: Variant[];
  isActive: boolean;
}

export interface Variant {
  name: string;
  sku: string;
  thumbnail?: string;
  sizes: Size[];
}

export interface Size {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export type CartItem = {
  id: string;
  slug: string;
  size: string;
  color: string;
  qty: number;
};

type ResolvedItem = CartItem & { product: Product };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: CartItem) => Promise<void>;
  update: (index: number, qty: number) => Promise<void>;
  remove: (index: number) => Promise<void>;
  clear: () => void;
  resolved: ResolvedItem[];
  loading: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "forland.cart.v3";

function resolvePrice(product: Product, color: string, size: string): number {
  // produk tanpa variant
  if (!product.variants?.length) {
    return product.price ?? 0;
  }

  // cari variant yang dipilih
  const variant = product.variants.find((v) => v.name === color);

  if (!variant) return 0;

  // variant tanpa size
  if (!variant.sizes?.length) {
    return product.price ?? 0;
  }

  // cari size yang dipilih
  const selectedSize = variant.sizes.find(
    (s) => s.name === size
  );

  return selectedSize?.price ?? 0;
}

async function isLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function syncAddToBackend(item: CartItem) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) return;

  await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product: item.id,
      variant: item.color,
      size: item.size,
      quantity: item.qty,
    }),
  }).catch(() => {});
}

async function syncUpdateToBackend(productId: string, quantity: number) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) return;

  await fetch(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  }).catch(() => {});
}

async function syncRemoveToBackend(productId: string) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) return;

  await fetch(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  }).catch(() => {});
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);

  // Load cart — dari backend kalau login, localStorage kalau tidak
  useEffect(() => {
    const init = async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            credentials: "include",
          });
          const json = await res.json();
          const serverItems: CartItem[] = (json.data.items ?? []).map((item: any) => ({
            id: item.product._id,
            slug: item.product.slug,
            size: item.size,
            color: item.variant,
            qty: item.quantity,
          }));
          setItems(serverItems);
        } catch {}
      } else {
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) setItems(JSON.parse(raw));
        } catch {}
      }
      setReady(true);
    };
    init();
  }, []);

  // Simpan ke localStorage hanya kalau tidak login
  useEffect(() => {
    if (!ready) return;
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
      }
    });
  }, [items, ready]);

  // Fetch product data yang belum ada di cache
  useEffect(() => {
    const missing = items.filter((i) => !productCache[i.id]);
    const uniqueMissing = [...new Map(missing.map((i) => [i.id, i])).values()];
    if (!uniqueMissing.length) return;

    setLoading(true);
    Promise.all(
      uniqueMissing.map((item) =>
        fetch(`${import.meta.env.VITE_API_URL}/products/${item.slug}`)
          .then((r) => r.json())
          .then((json) => json.data as Product | undefined)
          .catch(() => undefined)
      )
    ).then((results) => {
      const next: Record<string, Product> = {};
      results.forEach((p) => { if (p) next[p._id] = p; });
      setProductCache((prev) => ({ ...prev, ...next }));
      setLoading(false);
    });
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const resolved: ResolvedItem[] = items
      .map((it) => {
        const product = productCache[it.id];
        return product ? { ...it, product } : null;
      })
      .filter((x): x is ResolvedItem => !!x);

    const subtotal = resolved.reduce(
      (s, i) => s + resolvePrice(i.product, i.color, i.size) * i.qty,
      0
    );

    const count = items.reduce((s, i) => s + i.qty, 0);

    return {
      items,
      resolved,
      count,
      subtotal,
      loading,

      add: async (item) => {
        setItems((prev) => {
          const idx = prev.findIndex(
            (p) => p.id === item.id && p.size === item.size && p.color === item.color
          );
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
            return next;
          }
          return [...prev, item];
        });
        await syncAddToBackend(item);
      },

      update: async (index, qty) => {
        const item = items[index];
        setItems((prev) =>
          prev.map((p, i) => (i === index ? { ...p, qty: Math.max(1, qty) } : p))
        );
        if (item) await syncUpdateToBackend(item.id, Math.max(1, qty));
      },

      remove: async (index) => {
        const item = items[index];
        setItems((prev) => prev.filter((_, i) => i !== index));
        if (item) await syncRemoveToBackend(item.id);
      },

      clear: () => setItems([]),
    };
  }, [items, productCache, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}