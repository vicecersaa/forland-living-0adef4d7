import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Package, Truck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { products } from "@/lib/products";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Pesanan Saya — Forland Living" },
      { name: "description", content: "Lacak pesanan kasur dan bed premium Anda di Forland Living, lihat status pengiriman, dan riwayat pembelian." },
      { property: "og:title", content: "Pesanan Saya — Forland Living" },
      { property: "og:description", content: "Riwayat dan status pesanan Forland Living Anda." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type Status = "Diproses" | "Dikirim" | "Selesai";
type OrderItem = { productId: string; qty: number; size: string; variant: string };
type Order = {
  id: string;
  date: string;
  status: Status;
  eta: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
};

const mockOrders: Order[] = [
  {
    id: "FL-2411-0821",
    date: "12 November 2026",
    status: "Dikirim",
    eta: "Tiba 18 November",
    address: "Kemang Timur No. 24, Jakarta Selatan",
    items: [
      { productId: products[0]?.id ?? "aera-bed", qty: 1, size: "180 x 200", variant: "Fullset Cream" },
      { productId: products[2]?.id ?? "linen-set", qty: 2, size: "Queen", variant: "Natural" },
    ],
    subtotal: 24800000,
    shipping: 0,
  },
  {
    id: "FL-2410-0492",
    date: "28 Oktober 2026",
    status: "Selesai",
    eta: "Diterima 04 November",
    address: "Menteng Dalam No. 11, Jakarta Pusat",
    items: [
      { productId: products[1]?.id ?? "oslo-mattress", qty: 1, size: "160 x 200", variant: "Kasur Only" },
    ],
    subtotal: 14500000,
    shipping: 0,
  },
  {
    id: "FL-2409-0311",
    date: "05 Oktober 2026",
    status: "Diproses",
    eta: "Estimasi kirim 6–8 minggu",
    address: "Dago Pakar Blok C, Bandung",
    items: [
      { productId: products[3]?.id ?? "wool-throw", qty: 1, size: "200 x 200", variant: "Paket Lengkap" },
    ],
    subtotal: 32000000,
    shipping: 0,
  },
];

function statusMeta(s: Status) {
  if (s === "Diproses") return { icon: Clock3, dot: "bg-amber-500" };
  if (s === "Dikirim") return { icon: Truck, dot: "bg-blue-500" };
  return { icon: CheckCircle2, dot: "bg-emerald-600" };
}

function OrdersPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(mockOrders[0].id);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { redirect: "/orders", mode: "login" }, replace: true });
  }, [ready, user, navigate]);

  const detail = useMemo(() => mockOrders.find((o) => o.id === selected) ?? mockOrders[0], [selected]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-16 text-center">
        <div className="eyebrow">Akun</div>
        <h1 className="mt-4 font-serif text-3xl">Memuat pesanan Anda…</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-12 lg:pt-40">
      <div className="max-w-2xl">
        <div className="eyebrow">Akun · Pesanan</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Pesanan Saya</h1>
        <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
          Halo, <span className="text-foreground">{user.name}</span>. Berikut adalah pesanan Anda beserta status pengirimannya. Setiap pesanan dirawat oleh tim atelier kami.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.4fr] lg:gap-12">
        <aside className="border hairline">
          <div className="border-b hairline p-5">
            <div className="eyebrow">Riwayat</div>
            <div className="mt-1 text-sm text-muted-foreground tabular-nums">{mockOrders.length} pesanan</div>
          </div>
          <ul>
            {mockOrders.map((o) => {
              const active = o.id === selected;
              const meta = statusMeta(o.status);
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(o.id)}
                    className={
                      "flex w-full items-start gap-4 border-b hairline p-5 text-left transition-colors last:border-b-0 " +
                      (active ? "bg-surface" : "hover:bg-surface/60")
                    }
                  >
                    <span className={`mt-1.5 h-2 w-2 rounded-full ${meta.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="truncate font-serif text-base">{o.id}</div>
                        <div className="shrink-0 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">{o.status}</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{o.date} · {o.items.length} item</div>
                      <div className="mt-2 text-sm tabular-nums">Rp{o.subtotal.toLocaleString("id-ID")}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="border hairline p-6 sm:p-8">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="eyebrow">Detail Pesanan</div>
              <h2 className="mt-3 truncate font-serif text-2xl sm:text-3xl">{detail.id}</h2>
              <div className="mt-2 text-sm text-muted-foreground">Dipesan {detail.date}</div>
            </div>
            <StatusPill status={detail.status} />
          </header>

          <Timeline status={detail.status} />

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <InfoCard label="Alamat Pengiriman">{detail.address}</InfoCard>
            <InfoCard label="Estimasi">{detail.eta}</InfoCard>
          </div>

          <div className="mt-10">
            <div className="eyebrow mb-4">Item ({detail.items.length})</div>
            <ul className="border-t hairline">
              {detail.items.map((it, idx) => {
                const p = products.find((x) => x.id === it.productId) ?? products[0];
                return (
                  <li key={idx} className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b hairline py-4 sm:grid-cols-[96px_1fr_auto] sm:gap-6">
                    <div className="aspect-square bg-surface">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link to="/products/$id" params={{ id: p.id }} className="truncate font-serif text-base hover:opacity-70 sm:text-lg">
                        {p.name}
                      </Link>
                      <div className="mt-1 text-[0.72rem] tracking-[0.16em] uppercase text-muted-foreground">
                        {it.size} · {it.variant} · ×{it.qty}
                      </div>
                    </div>
                    <div className="tabular-nums text-sm">Rp{(p.price * it.qty).toLocaleString("id-ID")}</div>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">Rp{detail.subtotal.toLocaleString("id-ID")}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Pengiriman</dt><dd>{detail.shipping === 0 ? "Gratis" : `Rp${detail.shipping.toLocaleString("id-ID")}`}</dd></div>
              <div className="mt-3 flex justify-between border-t hairline pt-3 text-base">
                <span>Total</span>
                <span className="tabular-nums">Rp{(detail.subtotal + detail.shipping).toLocaleString("id-ID")}</span>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="bg-foreground px-6 py-3 text-[0.72rem] tracking-[0.24em] uppercase text-background hover:opacity-90">
              Hubungi Atelier
            </button>
            <Link to="/shop" className="border hairline px-6 py-3 text-[0.72rem] tracking-[0.24em] uppercase hover:border-foreground">
              Belanja Lagi
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const meta = statusMeta(status);
  const Icon = meta.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-2 border hairline px-3 py-1.5 text-[0.7rem] tracking-[0.2em] uppercase">
      <Icon className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

function Timeline({ status }: { status: Status }) {
  const steps: { key: Status | "Dipesan"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "Dipesan", label: "Dipesan", icon: Package },
    { key: "Diproses", label: "Diproses", icon: Clock3 },
    { key: "Dikirim", label: "Dikirim", icon: Truck },
    { key: "Selesai", label: "Selesai", icon: CheckCircle2 },
  ];
  const idxByStatus: Record<Status, number> = { Diproses: 1, Dikirim: 2, Selesai: 3 };
  const active = idxByStatus[status];

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