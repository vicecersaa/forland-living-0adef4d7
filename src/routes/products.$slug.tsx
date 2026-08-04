import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product, Variant, Size } from "@/lib/cart";

function resolvePrice(product: Product, variantName: string, sizeName: string): number {
  if (!product.variants?.length) return product.price ?? product.minPrice;
  const variant = product.variants.find((v) => v.name === variantName);
  if (!variant) return product.minPrice;
  if (!variant.sizes?.length) return product.minPrice;
  const size = variant.sizes.find((s) => s.name === sizeName);
  return size?.price ?? product.minPrice;
}

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${params.slug}`);
    const json = await res.json();
    if (!json.data) throw notFound();
    return { product: json.data as Product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Forland Living` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Forland Living` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.thumbnail },
        ]
      : [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-12 text-center">
      <h1 className="font-serif text-4xl">Karya ini sudah tidak tersedia.</h1>
      <Link to="/shop" search={{ q: undefined }} className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase">
        Kembali ke Katalog
      </Link>
    </div>
  ),
  component: ProductPage,
});





function ProductPage() {
  const { product } = Route.useLoaderData();
  const variants = product.variants ?? [];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.name ?? "");
  const activeVariant = variants.find((v: Variant) => v.name === selectedVariant);
  const sizes = activeVariant?.sizes ?? [];

  const [expanded, setExpanded] = useState(false);


  const [selectedSize, setSelectedSize] = useState(sizes[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const { add } = useCart();
  const navigate = useNavigate();

  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const mediaItems: { type: "image" | "video"; src: string }[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(product.video ? [{ type: "video" as const, src: product.video }] : []),
  ];
  const currentPrice = resolvePrice(product, selectedVariant, selectedSize);

  useEffect(() => {
    setSelectedSize(activeVariant?.sizes?.[0]?.name ?? "");
  }, [selectedVariant]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products?limit=4`)
      .then((r) => r.json())
      .then((json) => {
        const items: Product[] = json.data?.items ?? [];
        setRelated(items.filter((p) => p._id !== product._id).slice(0, 3));
      })
      .catch(() => {});
  }, [product._id]);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pt-24 lg:px-12 lg:pt-32">
        <nav className="text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground flex items-center flex-wrap gap-y-1">
  <Link to="/" className="hover:text-foreground shrink-0">Beranda</Link>
  <span className="mx-3 shrink-0">/</span>
  <Link to="/shop" search={{ q: undefined }} className="hover:text-foreground shrink-0">Katalog</Link>
  <span className="mx-3 shrink-0">/</span>
  <span className="text-foreground truncate min-w-0">{product.name}</span>
</nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">

          {/* Gallery */}
          <div className="flex gap-3 min-w-0">

            {/* Thumbnail strip — desktop */}
            {mediaItems.length > 1 && (
              <div className="hidden lg:flex flex-col gap-1.5 shrink-0 w-[52px]">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={
                      "relative aspect-square w-full overflow-hidden border-[1.5px] transition-all " +
                      (activeImage === i
                        ? "border-foreground opacity-100 ring-1 ring-foreground"
                        : "border-foreground/20 opacity-50 hover:opacity-80")
                    }
                  >
                    {item.type === "video" ? (
                    <div className="relative h-full w-full">
                    <video
                      src={item.src + "#t=0.5"}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/20">
                      <svg className="h-4 w-4 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                      <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" style={{ imageRendering: "auto" }} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main media */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="relative aspect-[5/5] overflow-hidden bg-surface">
                {mediaItems[activeImage]?.type === "video" ? (
                  <video
                    src={mediaItems[activeImage].src}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaItems[activeImage]?.src ?? ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    style={{ imageRendering: "auto" }}
                  />
                )}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + mediaItems.length) % mediaItems.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center bg-background/80 backdrop-blur hover:bg-background"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % mediaItems.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center bg-background/80 backdrop-blur hover:bg-background"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile thumbnail strip */}
              {mediaItems.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
                  {mediaItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={
                        "relative aspect-square w-12 shrink-0 overflow-hidden border-[1.5px] transition-all " +
                        (activeImage === i
                          ? "border-foreground opacity-100 ring-1 ring-foreground"
                          : "border-foreground/20 opacity-50 hover:opacity-80")
                      }
                    >
                      {item.type === "video" ? (
                        <div className="h-full w-full bg-foreground/10 grid place-items-center">
                          <svg className="h-3 w-3 text-foreground/60" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" style={{ imageRendering: "auto" }}/>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-32 lg:self-start min-w-0">
            <div className="eyebrow">{product.category?.name}</div>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl break-words">{product.name}</h1>
            <div className="mt-6 text-lg tabular-nums">
              Rp{currentPrice.toLocaleString("id-ID")}
            </div>
           <div className="mt-8">
  <dl className="divide-y hairline border-t border-b hairline">
    {product.description?.split("\n").filter(Boolean).slice(0, expanded ? undefined : 6).map((line, i) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0 && colonIdx < 45) {
        return (
          <div key={i} className="flex justify-between gap-6 py-3">
            <dt className="text-[0.82rem] text-muted-foreground shrink-0">{line.slice(0, colonIdx).trim()}</dt>
            <dd className="text-[0.82rem] text-right">{line.slice(colonIdx + 1).trim()}</dd>
          </div>
        );
      }
      return <p key={i} className="py-2 text-[0.98rem] leading-[1.85] text-foreground/80">{line}</p>;
    })}
  </dl>
  {(product.description?.split("\n").filter(Boolean).length ?? 0) > 6 && (
    <button
      onClick={() => setExpanded(!expanded)}
      className="mt-3 text-[0.78rem] tracking-[0.2em] uppercase border-b hairline pb-0.5 hover:border-foreground transition-colors"
    >
      {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
    </button>
  )}
</div>

            {variants.length > 0 && (
  <div className="mt-10">
    <div className="mb-4 flex items-baseline justify-between">
      <div className="eyebrow">Varian</div>
      <div className="text-xs text-muted-foreground truncate max-w-[60%] text-right">{selectedVariant}</div>
    </div>
    <div className={variants.some(v => v.thumbnail) ? "grid grid-cols-2 gap-2 sm:grid-cols-4" : "flex flex-wrap gap-2"}>
      {variants.map((v: Variant) => {
        const active = selectedVariant === v.name;
        return v.thumbnail ? (
          // Ada thumbnail — card style
          <button
            key={v.name}
            onClick={() => setSelectedVariant(v.name)}
            className={
              "group flex flex-col overflow-hidden border text-left transition-all " +
              (active
                ? "border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]"
                : "hairline hover:border-foreground/60")
            }
          >
            <div className="aspect-square w-full bg-surface">
              <img src={v.thumbnail} alt={v.name} className="h-full w-full object-cover" loading="lazy" style={{ imageRendering: "auto" }} />
            </div>
            <div className="px-2 py-2">
              <div className="truncate text-[0.72rem] font-medium tracking-wide">{v.name}</div>
              {v.sku && (
                <div className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">{v.sku}</div>
              )}
            </div>
          </button>
        ) : (
          // Tidak ada thumbnail — pill style
          <button
            key={v.name}
            onClick={() => setSelectedVariant(v.name)}
            className={
              "border px-5 py-3 text-left transition-all text-sm " +
              (active
                ? "border-foreground bg-foreground text-background"
                : "hairline hover:border-foreground text-foreground")
            }
          >
            <div className="font-medium">{v.name}</div>
            {v.sku && (
              <div className={"mt-0.5 text-[0.65rem] tracking-wide " + (active ? "text-background/70" : "text-muted-foreground")}>
                {v.sku}
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
)}

            {sizes.length > 0 && (
              <div className="mt-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="eyebrow">Ukuran</div>
                  <div className="text-xs text-muted-foreground">{selectedSize}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s: Size) => {
                    const active = selectedSize === s.name;
                    return (
                      <button
                        key={s.name}
                        onClick={() => setSelectedSize(s.name)}
                        className={
                          "flex flex-col items-center border px-2 py-3 transition-colors " +
                          (active
                            ? "border-foreground bg-foreground text-background"
                            : "hairline hover:border-foreground")
                        }
                      >
                        <span className="text-sm font-medium tabular-nums">{s.name}</span>
                        <span className={"mt-0.5 text-[0.65rem] tracking-wide " + (active ? "text-background/70" : "text-muted-foreground")}>
                          {s.sku}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-stretch gap-3">
              <div className="flex items-center border hairline">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Kurangi" className="px-4 py-4">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Tambah" className="px-4 py-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  add({ id: product._id, slug: product.slug, size: selectedSize, color: selectedVariant, qty });
                  navigate({ to: "/cart" });
                }}
                className="flex-1 bg-foreground py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-90"
              >
                Tambah ke Keranjang
              </button>
            </div>
            

            <dl className="mt-10 space-y-4 border-t hairline pt-8 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Kategori</dt>
                <dd className="text-right">{product.category?.name}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Dibuat di</dt>
                <dd className="text-right">Indonesia, Bogor</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Waktu produksi</dt>
                <dd className="text-right">6 — 8 minggu</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
          <div className="mb-14 flex items-end justify-between">
            <h2 className="font-serif text-3xl md:text-4xl">Pertimbangan Lain</h2>
            <Link to="/shop" search={{ q: undefined }} className="border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground">
              Lihat Semua
            </Link>
          </div>
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}