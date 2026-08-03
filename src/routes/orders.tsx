import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Clock3, Package, Truck, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Pesanan Saya — Forland Living" },
      { name: "description", content: "Lacak pesanan kasur dan bed premium Anda di Forland Living." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type OrderItem = {
  name: string;
  thumbnail: string;
  variant: string;
  size: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type ShippingAddress = {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  address: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  notes: string;
  createdAt: string;
};

function statusMeta(s: OrderStatus) {
  switch (s) {
    case "pending":    return { label: "Menunggu",   icon: Clock3,       dot: "bg-amber-400"   };
    case "processing": return { label: "Diproses",   icon: Clock3,       dot: "bg-amber-500"   };
    case "shipped":    return { label: "Dikirim",    icon: Truck,        dot: "bg-blue-500"    };
    case "completed":  return { label: "Selesai",    icon: CheckCircle2, dot: "bg-emerald-600" };
    case "cancelled":  return { label: "Dibatalkan", icon: XCircle,      dot: "bg-red-500"     };
  }
}

function paymentMeta(s: PaymentStatus) {
  switch (s) {
    case "pending":  return { label: "Belum Dibayar", color: "text-amber-500"   };
    case "paid":     return { label: "Lunas",         color: "text-emerald-600" };
    case "failed":   return { label: "Gagal",         color: "text-red-500"     };
    case "refunded": return { label: "Direfund",      color: "text-blue-500"    };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function OrdersPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/auth", search: { redirect: "/orders", mode: "login" }, replace: true });
    }
  }, [ready, user, navigate]);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setSelected(json.data);
    } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Gagal memuat pesanan");
      const list: Order[] = json.data.items ?? [];
      setOrders(list);
      if (list.length > 0) {
        await fetchDetail(list[0]._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [user, fetchDetail]);

  // Fetch saat pertama load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refetch saat window difokus lagi (misal balik dari tab lain)
  useEffect(() => {
    const onFocus = () => {
      fetchOrders();
      if (selected) fetchDetail(selected._id);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchOrders, fetchDetail, selected]);

  if (!ready || (ready && !user)) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-16 text-center">
        <h1 className="font-serif text-3xl">Memuat pesanan Anda…</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-16 text-center text-sm text-muted-foreground">
        Memuat pesanan…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-16 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-12 lg:pt-40">
      <div className="max-w-2xl">
        <div className="eyebrow">Akun · Pesanan</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Pesanan Saya</h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.98rem] leading-[1.85] text-foreground/70">
            Halo, <span className="text-foreground">{selected?.shippingAddress?.name ?? user?.email}</span>. Berikut adalah pesanan Anda beserta status pengirimannya.
          </p>
          <button
            onClick={fetchOrders}
            className="shrink-0 border hairline px-4 py-2 text-[0.72rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Perbarui
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 border-t hairline pt-16 text-center">
          <p className="font-serif text-2xl text-foreground/70">Belum ada pesanan.</p>
          <Link
            to="/shop"
            search={{ q: undefined }}
            className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Jelajahi Koleksi
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.4fr] lg:gap-12">
          <aside className="border hairline">
            <div className="border-b hairline p-5">
              <div className="eyebrow">Riwayat</div>
              <div className="mt-1 text-sm text-muted-foreground tabular-nums">{orders.length} pesanan</div>
            </div>
            <ul>
              {orders.map((o) => {
                const active = selected?._id === o._id;
                const meta = statusMeta(o.status);
                return (
                  <li key={o._id}>
                    <button
                      type="button"
                      onClick={() => fetchDetail(o._id)}
                      className={
                        "flex w-full items-start gap-4 border-b hairline p-5 text-left transition-colors last:border-b-0 " +
                        (active ? "bg-surface" : "hover:bg-surface/60")
                      }
                    >
                      <span className={`mt-1.5 h-2 w-2 rounded-full ${meta.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="truncate font-serif text-base">{o.orderNumber}</div>
                          <div className="shrink-0 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">{meta.label}</div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items?.length ?? 0} item</div>
                        <div className="mt-2 text-sm tabular-nums">Rp{o.total.toLocaleString("id-ID")}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {selected && (
            <section className="border hairline p-6 sm:p-8">
              <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="eyebrow">Detail Pesanan</div>
                  <h2 className="mt-3 truncate font-serif text-2xl sm:text-3xl">{selected.orderNumber}</h2>
                  <div className="mt-2 text-sm text-muted-foreground">Dipesan {formatDate(selected.createdAt)}</div>
                </div>
                <StatusPill status={selected.status} />
              </header>

              <Timeline status={selected.status} />

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <InfoCard label="Alamat Pengiriman">
                  {[
                    selected.shippingAddress?.address,
                    selected.shippingAddress?.district,
                    selected.shippingAddress?.city,
                    selected.shippingAddress?.province,
                    selected.shippingAddress?.postalCode,
                  ].filter(Boolean).join(", ")}
                </InfoCard>
                <InfoCard label="Status Pembayaran">
                  <span className={paymentMeta(selected.paymentStatus).color}>
                    {paymentMeta(selected.paymentStatus).label}
                  </span>
                </InfoCard>
              </div>

              <div className="mt-10">
                <div className="eyebrow mb-4">Item ({selected.items?.length ?? 0})</div>
                <ul className="border-t hairline">
                  {(selected.items ?? []).map((it, idx) => (
                    <li key={idx} className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b hairline py-4 sm:grid-cols-[96px_1fr_auto] sm:gap-6">
                      <div className="aspect-square bg-surface">
                        <img src={it.thumbnail} alt={it.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-serif text-base sm:text-lg">{it.name}</div>
                        <div className="mt-1 text-[0.72rem] tracking-[0.16em] uppercase text-muted-foreground">
                          {it.size && <span>{it.size}</span>}
                          {it.size && it.variant && <span> · </span>}
                          {it.variant && <span>{it.variant}</span>}
                          <span> · ×{it.quantity}</span>
                        </div>
                      </div>
                      <div className="tabular-nums text-sm">Rp{it.subtotal.toLocaleString("id-ID")}</div>
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums">Rp{selected.subtotal.toLocaleString("id-ID")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pengiriman</dt>
                    <dd>{selected.shippingCost === 0 ? "Gratis" : `Rp${selected.shippingCost.toLocaleString("id-ID")}`}</dd>
                  </div>
                  {selected.discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Diskon</dt>
                      <dd className="tabular-nums text-emerald-600">-Rp{selected.discount.toLocaleString("id-ID")}</dd>
                    </div>
                  )}
                  <div className="mt-3 flex justify-between border-t hairline pt-3 text-base">
                    <span>Total</span>
                    <span className="tabular-nums">Rp{selected.total.toLocaleString("id-ID")}</span>
                  </div>
                </dl>
              </div>

              {selected.notes && (
                <div className="mt-6 border-t hairline pt-6 text-sm text-muted-foreground">
                  <span className="eyebrow block mb-1">Catatan</span>
                  {selected.notes}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  search={{ q: undefined }}
                  className="border hairline px-6 py-3 text-[0.72rem] tracking-[0.24em] uppercase hover:border-foreground"
                >
                  Belanja Lagi
                </Link>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = statusMeta(status);
  const Icon = meta.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-2 border hairline px-3 py-1.5 text-[0.7rem] tracking-[0.2em] uppercase">
      <Icon className="h-3.5 w-3.5" /> {meta.label}
    </span>
  );
}

function Timeline({ status }: { status: OrderStatus }) {
  const steps: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "ordered",    label: "Dipesan",  icon: Package      },
    { key: "processing", label: "Diproses", icon: Clock3       },
    { key: "shipped",    label: "Dikirim",  icon: Truck        },
    { key: "completed",  label: "Selesai",  icon: CheckCircle2 },
  ];

  const idxByStatus: Record<string, number> = {
    pending: 0, processing: 1, shipped: 2, completed: 3, cancelled: 1,
  };
  const active = idxByStatus[status] ?? 0;

  return (
    <ol className="mt-8 grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const done = i <= active;
        const Icon = s.icon;
        return (
          <li key={s.key} className="relative flex flex-col items-start">
            <div className="flex w-full items-center gap-2">
              <div className={"grid h-8 w-8 shrink-0 place-items-center rounded-full border " + (done ? "bg-foreground text-background border-foreground" : "hairline text-muted-foreground")}>
                <Icon className="h-4 w-4" />
              </div>
              {i < steps.length - 1 && <div className={"h-px flex-1 " + (i < active ? "bg-foreground" : "bg-foreground/15")} />}
            </div>
            <div className={"mt-2 text-[0.68rem] tracking-[0.2em] uppercase " + (done ? "text-foreground" : "text-muted-foreground")}>{s.label}</div>
          </li>
        );
      })}
    </ol>
  );
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border hairline p-5">
      <div className="eyebrow">{label}</div>
      <div className="mt-2 text-sm text-foreground/85">{children}</div>
    </div>
  );
}