import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product, Variant, Size } from "@/lib/cart";
import { SmartImage } from "@/components/SmartImage";

function resolvePrice(product: Product, variantName: string, sizeName: string): number {
  if (!product.variants?.length) {
    return product.price ?? 0;
  }

  const variant = product.variants.find(
    (v) => v.name === variantName
  );

  if (!variant) return 0;

  if (!variant.sizes?.length) {
    return product.price ?? 0;
  }

  const size = variant.sizes.find(
    (s) => s.name === sizeName
  );

  return size?.price ?? 0;
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

  const rawImages = product.images?.length ? product.images : [];
  const variantImage = activeVariant?.image ?? null;
  const imagesWithThumbnail = variantImage
  ? [variantImage, ...rawImages.filter((img) => img !== variantImage)]
  : product.thumbnail
  ? [product.thumbnail, ...rawImages.filter((img) => img !== product.thumbnail)]
  : rawImages;

  const mediaItems: { type: "image" | "video"; src: string }[] = [
    ...imagesWithThumbnail.map((src) => ({ type: "image" as const, src })),
    ...(product.video ? [{ type: "video" as const, src: product.video }] : []),
  ];

  const currentPrice = resolvePrice(product, selectedVariant, selectedSize);

  useEffect(() => {
    setSelectedSize(activeVariant?.sizes?.[0]?.name ?? "");
  }, [selectedVariant]);

  useEffect(() => {
  setActiveImage(0);
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

  const descriptionLines = product.description?.split("\n").filter(Boolean) ?? [];

const specLines = descriptionLines.filter((line) => {
  const idx = line.indexOf(":");
  return idx > 0 && idx < 45;
});

const paragraphLines = descriptionLines.filter((line) => {
  const idx = line.indexOf(":");
  return !(idx > 0 && idx < 45);
});

const visibleSpecs = expanded ? specLines : specLines.slice(0, 4);
const visibleParagraphs = expanded ? paragraphLines : paragraphLines.slice(0, 2);

const hasMore = specLines.length > 4 || paragraphLines.length > 2;

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pt-24 lg:px-12 lg:pt-32">
        {/* Breadcrumb */}
        <nav className="text-[0.72rem] tracking-[0.24em] uppercase text-foreground/50 flex items-center flex-wrap gap-y-1">
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">Beranda</Link>
          <span className="mx-3 shrink-0 text-foreground/30">/</span>
          <Link to="/shop" search={{ q: undefined }} className="hover:text-foreground transition-colors shrink-0">Katalog</Link>
          <span className="mx-3 shrink-0 text-foreground/30">/</span>
          {/* FIX #1: Breadcrumb terakhir lebih visible */}
          <span className="text-foreground/80 truncate min-w-0 font-medium">{product.name}</span>
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
                      <SmartImage src={item.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
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
                  <SmartImage
                    src={mediaItems[activeImage]?.src ?? ""}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
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
                        <SmartImage src={item.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:sticky lg:top-32 lg:self-start min-w-0">

            {/* FIX #1: Category eyebrow lebih visible */}
            <div className="eyebrow text-foreground/60 tracking-[0.2em]">{product.category?.name}</div>

            {/* FIX #5: Nama produk scale lebih kecil — dari text-3xl/5xl jadi text-2xl/[2.6rem] */}
            <h1 className="mt-3 font-serif text-2xl leading-[1.1] md:text-[2.6rem] break-words">{product.name}</h1>

            {/* FIX #2: Harga lebih bold dan sedikit lebih besar */}
            <div className="mt-5 text-2xl tabular-nums tracking-tight">
              Rp {currentPrice.toLocaleString("id-ID")}
            </div>

            {/* Product Specifications */}
{/* Product Specifications */}
<div className="mt-8 space-y-6">

  {visibleSpecs.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {visibleSpecs.map((line, i) => {
        const colonIdx = line.indexOf(":");

        return (
          <div
            key={i}
            className="
              rounded-sm
              border border-foreground/10
              bg-foreground/[0.025]
              px-5 py-4
              transition-all
              hover:border-foreground/25
              hover:bg-foreground/[0.04]
            "
          >
            <div
              className="
                text-[0.65rem]
                uppercase
                tracking-[0.18em]
                text-foreground/45
                mb-2
              "
            >
              {line.slice(0, colonIdx).trim()}
            </div>

            <div
              className="
                text-[0.9rem]
                leading-relaxed
                font-medium
                text-foreground
              "
            >
              {line.slice(colonIdx + 1).trim()}
            </div>
          </div>
        );
      })}
    </div>
  )}

  {visibleParagraphs.length > 0 && (
    <div className="space-y-2 pt-2">
      {visibleParagraphs.map((line, i) => (
        <p
          key={i}
          className="
            text-[0.92rem]
            leading-[1.9]
            text-foreground/70
          "
        >
          {line}
        </p>
      ))}
    </div>
  )}

  {hasMore && (
    <button
      onClick={() => setExpanded(!expanded)}
      className="
        mt-4
        text-[0.75rem]
        tracking-[0.18em]
        uppercase
        text-foreground/50
        border-b border-foreground/20
        pb-0.5
        hover:text-foreground
        hover:border-foreground
        transition-colors
      "
    >
      {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
    </button>
  )}

</div>

            {/* FIX #4: Varian — visual lebih premium */}
            {variants.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="eyebrow text-foreground/60">Varian</div>
                  <div className="text-[0.78rem] text-foreground/50 truncate max-w-[60%] text-right">{selectedVariant}</div>
                </div>
                <div className={variants.some((v: Variant) => v.image) ? "grid grid-cols-3 gap-2 sm:grid-cols-4" : "flex flex-wrap gap-2"}>
                  {variants.map((v: Variant) => {
                    const active = selectedVariant === v.name;
                    return v.image ? (
  <button
    key={v.name}
    onClick={() => setSelectedVariant(v.name)}
    className={
      "flex items-center gap-2 px-2 py-2 transition-all duration-200 text-left w-full " +
      (active
        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background bg-foreground/[0.02]"
        : "ring-1 ring-foreground/12 hover:ring-foreground/30 hover:bg-foreground/[0.02]")
    }
  >
    <div className="relative h-8 w-8 shrink-0 overflow-hidden bg-surface">
      <SmartImage
        src={v.image}
        alt={v.name}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="min-w-0 flex-1 overflow-hidden">
  <div className={"text-[0.72rem] font-medium tracking-wide line-clamp-2 leading-snug break-words " + (active ? "text-foreground" : "text-foreground/60")}>
        {v.name}
      </div>
      {v.sku && (
        <div className="mt-0.5 truncate text-[0.62rem] text-foreground/30">{v.sku}</div>
      )}
    </div>
    {active && (
      <div className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
    )}
  </button>
) : (
  <button
    key={v.name}
    onClick={() => setSelectedVariant(v.name)}
    className={
      "relative text-left transition-all duration-150 overflow-hidden " +
      (active
        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
        : "ring-1 ring-foreground/15 hover:ring-foreground/40")
    }
  >
    <div className="px-2.5 py-2">
      <div className={"truncate text-[0.72rem] font-medium tracking-wide " + (active ? "text-foreground" : "text-foreground/60")}>
        {v.name}
      </div>
    </div>
  </button>
);
                  })}
                </div>
              </div>
            )}

            {/* FIX #4: Ukuran — lebih premium, pakai pill gaya editorial */}
            {sizes.length > 0 && (
              <div className="mt-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="eyebrow text-foreground/60">Ukuran</div>
                  <div className="text-[0.78rem] text-foreground/50">{selectedSize}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s: Size) => {
                    const active = selectedSize === s.name;
                    return (
                      <button
                        key={s.name}
                        onClick={() => setSelectedSize(s.name)}
                        className={
                          "relative px-5 py-2.5 text-[0.82rem] font-medium tracking-wide transition-all duration-150 " +
                          (active
                            ? "bg-foreground text-background"
                            : "border border-foreground/15 text-foreground/70 hover:border-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]")
                        }
                      >
                        {s.name}
                        {active && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-background/40 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="mt-10 flex items-stretch gap-3">
              <div className="flex items-center border border-foreground/20">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Kurangi" className="px-4 py-4 hover:bg-foreground/5 transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Tambah" className="px-4 py-4 hover:bg-foreground/5 transition-colors">
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
                Tambah Keranjang
              </button>
            </div>

            {/* Meta info */}
            <dl className="mt-10 space-y-3 border-t border-foreground/10 pt-7 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-foreground/40 text-[0.8rem] uppercase tracking-[0.08em]">Kategori</dt>
                <dd className="text-right text-foreground/80 text-[0.88rem]">{product.category?.name}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-foreground/40 text-[0.8rem] uppercase tracking-[0.08em]">Dibuat di</dt>
                <dd className="text-right text-foreground/80 text-[0.88rem]">Indonesia, Bogor</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-foreground/40 text-[0.8rem] uppercase tracking-[0.08em]">Waktu produksi</dt>
                <dd className="text-right text-foreground/80 text-[0.88rem]">6 — 8 minggu</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
  <section className="border-t hairline">
    <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12">

      <div className="mb-16 flex items-end justify-between">
        <div>
          <div className="eyebrow">
            — Explore
          </div>

          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            Koleksi Lain
          </h2>
        </div>

        <Link
          to="/shop"
          search={{ q: undefined }}
          className="
            hidden
            border-b
            hairline
            pb-1
            text-[0.75rem]
            uppercase
            tracking-[0.25em]
            transition-colors
            hover:border-foreground
            sm:block
          "
        >
          Lihat Semua
        </Link>
      </div>


      <div className="
        grid
        gap-x-8
        gap-y-14
        sm:grid-cols-2
        lg:grid-cols-3
      ">
        {related.map((p) => (
          <Link
            key={p._id}
            to="/products/$slug"
            params={{ slug: p.slug }}
            className="group"
          >

            <div className="
              relative
              aspect-[5/5]
              overflow-hidden
              bg-surface
            ">
              <SmartImage
                src={p.thumbnail}
                alt={p.name}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-[1400ms]
                  group-hover:scale-[1.04]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  transition-colors
                  duration-500
                  group-hover:bg-black/5
                "
              />
            </div>


            <div className="mt-6">

              <div className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-foreground/40
              ">
                {p.category.name}
              </div>


              <h3 className="
                mt-3
                font-serif
                text-2xl
                leading-tight
                transition-colors
                group-hover:text-foreground/70
              ">
                {p.name}
              </h3>


              <div className="
                mt-3
                text-sm
                tabular-nums
                text-foreground/70
              ">
                Rp {currentPrice.toLocaleString("id-ID")}
              </div>

            </div>

          </Link>
        ))}
      </div>

    </div>
  </section>
)}
    </>
  );
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * PANDUAN FORMAT DESKRIPSI PRODUK (untuk dashboard admin)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Deskripsi produk dibaca baris per baris (dipisahkan newline "\n").
 * Baris yang mengandung ":" di posisi < 45 karakter pertama akan ditampilkan
 * sebagai baris tabel dua kolom (label : nilai).
 * Baris tanpa ":" akan ditampilkan sebagai paragraf biasa.
 *
 * CONTOH FORMAT IDEAL:
 * ──────────────────────────────────────────────────────────────────
 * Material Rangka: Kayu Mahoni Solid Grade A
 * Material Pelapis: Fabric Linen Premium Anti-Noda
 * Kaki: Stainless Steel Hitam Doff
 * Feel: Medium Firm
 * Sistem Kasur: Rebounded Foam + Soft Foam Layer
 * Fitur: Sorong / Trundle Bed
 * Garansi Rangka: 5 Tahun
 * Garansi Busa: 2 Tahun
 *
 * Kasur Richmond dirancang untuk kamar yang membutuhkan
 * fleksibilitas. Sistem sorong memungkinkan satu unit berfungsi
 * sebagai dua tempat tidur terpisah — ideal untuk kamar anak
 * atau ruang tamu serbaguna.
 * ──────────────────────────────────────────────────────────────────
 *
 * TIPS:
 * - Tulis spesifikasi teknis dulu (baris tabel), baru narasi di bawah
 * - Label singkat, max ~40 karakter sebelum titik dua
 * - Nilai di kanan boleh panjang, akan wrap otomatis
 * - Pisahkan blok tabel dan paragraf dengan baris kosong jika perlu
 * - Hindari simbol aneh atau markdown (bold, *, #) — tidak akan render
 */