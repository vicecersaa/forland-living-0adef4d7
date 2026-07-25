import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Forland Living` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Forland Living` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-12 text-center">
      <h1 className="font-serif text-4xl">Karya ini sudah tidak tersedia.</h1>
      <Link to="/shop" className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase">
        Kembali ke Katalog
      </Link>
    </div>
  ),
  component: ProductPage,
});

const sizes = [
  { label: "90 x 200", sub: "Single" },
  { label: "100 x 200", sub: "Super Single" },
  { label: "120 x 200", sub: "Small Double" },
  { label: "160 x 200", sub: "Queen" },
  { label: "180 x 200", sub: "King" },
  { label: "200 x 200", sub: "Super King" },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const variants = [
    { id: "fullset-cream", name: "Fullset Cream", sub: "Kasur + Divan + Sandaran", img: product.image },
    { id: "kasur-only", name: "Kasur Only", sub: "Tanpa divan", img: product.hoverImage ?? product.image },
    { id: "paket-hemat", name: "Paket Hemat", sub: "Kasur + Bantal + Sprei", img: product.image },
    { id: "paket-lengkap", name: "Paket Lengkap", sub: "Semua tersedia", img: product.hoverImage ?? product.image },
  ];
  const [variant, setVariant] = useState(variants[0].id);
  const [size, setSize] = useState(sizes[3].label);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pt-24 lg:px-12 lg:pt-32">
        <nav className="text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Beranda</Link>
          <span className="mx-3">/</span>
          <Link to="/shop" className="hover:text-foreground">Katalog</Link>
          <span className="mx-3">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-surface">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.hoverImage && (
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-surface">
                  <img src={product.hoverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="aspect-square bg-surface">
                  <img src={product.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="eyebrow">{product.collection}</div>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            <div className="mt-6 text-lg tabular-nums">Rp{product.price.toLocaleString("id-ID")}</div>

            <p className="mt-8 text-[0.98rem] leading-[1.85] text-foreground/80">
              {product.description}
            </p>

            <div className="mt-10">
              <div className="mb-4 flex items-baseline justify-between">
                <div className="eyebrow">Varian</div>
                <div className="text-xs text-muted-foreground">
                  {variants.find((v) => v.id === variant)?.name}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {variants.map((v) => {
                  const active = variant === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariant(v.id)}
                      className={
                        "group flex flex-col overflow-hidden border text-left transition-all " +
                        (active ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]" : "hairline hover:border-foreground/60")
                      }
                    >
                      <div className="aspect-square w-full bg-surface">
                        <img src={v.img} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="px-2 py-2">
                        <div className="truncate text-[0.72rem] font-medium tracking-wide">{v.name}</div>
                        <div className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">{v.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-baseline justify-between">
                <div className="eyebrow">Ukuran</div>
                <div className="text-xs text-muted-foreground">{size} cm</div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                {sizes.map((s) => {
                  const active = size === s.label;
                  return (
                    <button
                      key={s.label}
                      onClick={() => setSize(s.label)}
                      className={
                        "flex flex-col items-center border px-2 py-3 transition-colors " +
                        (active
                          ? "border-foreground bg-foreground text-background"
                          : "hairline hover:border-foreground")
                      }
                    >
                      <span className="text-sm font-medium tabular-nums">{s.label}</span>
                      <span className={"mt-0.5 text-[0.65rem] tracking-wide " + (active ? "text-background/70" : "text-muted-foreground")}>
                        {s.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex items-stretch gap-3">
              <div className="flex items-center border hairline">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" className="px-4 py-4">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity" className="px-4 py-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  add({ id: product.id, size, color: variants.find((v) => v.id === variant)?.name ?? "", qty });
                  navigate({ to: "/cart" });
                }}
                className="flex-1 bg-foreground py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-90"
              >
                Tambah ke Keranjang
              </button>
            </div>
            <button className="mt-3 w-full border hairline py-4 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground">
              Reservasi — Bayar Nanti
            </button>

            <dl className="mt-10 space-y-4 border-t hairline pt-8 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Material</dt>
                <dd className="text-right">{product.material}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Dibuat di</dt>
                <dd className="text-right">Oslo, Norwegia</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Waktu produksi</dt>
                <dd className="text-right">6 — 8 minggu</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Garansi</dt>
                <dd className="text-right">25 tahun struktural</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="mb-14 flex items-end justify-between">
          <h2 className="font-serif text-3xl md:text-4xl">Pertimbangan Lain</h2>
          <Link to="/shop" className="border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground">
            Lihat Semua
          </Link>
        </div>
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}