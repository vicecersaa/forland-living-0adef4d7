import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";

import { LayoutGrid, Rows3, Search, X } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Belanja Kasur & Bed Premium — Forland Living" },
      { name: "description", content: "Jelajahi katalog lengkap kasur, bed, dan perlengkapan tidur premium Forland Living. Quiet luxury untuk kamar tidur Anda." },
      { property: "og:title", content: "Belanja Kasur & Bed Premium — Forland Living" },
      { property: "og:description", content: "Katalog kasur, bed, dan perlengkapan tidur premium Forland Living." },
    ],
  }),
  component: ShopPage,
});

function resolvePrice(product: Product): number {
  if (!product.variants?.length) {
    return product.price ?? product.minPrice;
  }

  const variant = product.variants[0];
  if (!variant) return product.minPrice;

  if (!variant.sizes?.length) {
    return variant.price ?? product.minPrice;
  }

  return variant.sizes[0]?.price ?? product.minPrice;
}

const sorts = ["Unggulan", "Harga · Terendah", "Harga · Tertinggi", "Terbaru"] as const;

function ShopPage() {
  const { q: qParam } = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = Route.useNavigate();
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Unggulan");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const query = (qParam ?? "").trim().toLowerCase();
 const [priceFilter, setPriceFilter] = useState("Semua");

  const categories = useMemo(() => {
    return [
      "Semua",
      ...Array.from(new Set(products.map((p) => p.category.name))),
    ];
  }, [products]);

 



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const json = await res.json();
        setProducts(json.data.items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let base = [...products];

    if (category !== "Semua") {
      base = base.filter((p) => p.category.name === category);
    }

    if (query) {
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.name.toLowerCase().includes(query) ||
          p.category.slug?.toLowerCase().includes(query)
      );
    }

    if (priceFilter === "<5jt") {
  base = base.filter((p) => resolvePrice(p) < 5000000);
}

if (priceFilter === "5jt-10jt") {
  base = base.filter((p) => {
    const price = resolvePrice(p);
    return price >= 5000000 && price <= 10000000;
  });
}

if (priceFilter === "10jt-20jt") {
  base = base.filter((p) => {
    const price = resolvePrice(p);
    return price >= 10000000 && price <= 20000000;
  });
}

if (priceFilter === ">20jt") {
  base = base.filter((p) => resolvePrice(p) > 20000000);
}

   return base;

}, [products, category, query, sort, priceFilter]);

  return (
    <>
      <header className="border-b hairline pt-24 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="eyebrow">— Katalog</div>
              <h1 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">
                Produk Kami
              </h1>
              <p className="mt-5 max-w-xl text-foreground/70">
                {query
                  ? `Menampilkan karya yang cocok dengan "${qParam}".`
                  : "Eksplorasi koleksi bed, kasur, dan perlengkapan tidur dengan desain timeless dan material pilihan untuk menciptakan pengalaman istirahat yang istimewa."}
              </p>
            </div>
            <div className="hidden text-right font-serif text-xs tracking-[0.28em] uppercase text-muted-foreground md:block">
              <div className="tabular-nums text-foreground">{String(filtered.length).padStart(2, "0")}</div>
              <div className="mt-1">Produk</div>
            </div>
          </div>
          {query && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border hairline px-3 py-1.5 text-xs text-foreground/80">
              <Search className="h-3 w-3" strokeWidth={1.4} />
              <span>"{qParam}"</span>
              <button
                aria-label="Hapus pencarian"
                onClick={() => navigate({ search: { q: undefined } as never })}
                className="opacity-60 hover:opacity-100"
              >
                <X className="h-3 w-3" strokeWidth={1.4} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-b hairline pb-6 text-[0.78rem] tracking-[0.2em] uppercase">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "pb-1 transition-colors " +
                (category === c
                  ? "border-b border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="border hairline px-4 py-2 text-[0.78rem] tracking-[0.2em] uppercase"
          >
            {filterOpen ? "Tutup Filter" : "Filter"}
          </button>
          <span className="text-xs text-muted-foreground">
            {filtered.length} produk
          </span>
        </div>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside
  className={`
    space-y-10
    lg:sticky
    lg:top-28
    lg:self-start
    ${filterOpen ? "block" : "hidden"}
    lg:block
  `}
>
  {/* Intro */}
  <div>
    <div className="eyebrow">— Koleksi</div>

    <h2 className="mt-3 font-serif text-2xl">
      Pencarian
    </h2>

    <p className="mt-3 text-sm leading-7 text-foreground/55">
      Menampilkan {filtered.length} dari {products.length} koleksi.
    </p>
  </div>


  {/* Category */}
  <div className="border-t border-foreground/10 pt-8">
    <div className="mb-5 text-[0.7rem] uppercase tracking-[0.22em] text-foreground/45">
      Kategori
    </div>

    <div className="space-y-1">
      {categories.map((c) => {
        const count =
          c === "Semua"
            ? products.length
            : products.filter(
                (p) => p.category.name === c
              ).length;

        return (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`
              flex w-full items-center justify-between
              border-b border-foreground/5
              py-3
              text-sm
              transition-colors
              ${
                category === c
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground"
              }
            `}
          >
            <span>{c}</span>

            <span className="text-xs tabular-nums text-foreground/35">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  </div>


  

  {/* Help Card */}
  <div className="border border-foreground/10 p-6">
    <div className="font-serif text-xl">
      Need Assistance?
    </div>

    <p className="mt-3 text-sm leading-7 text-foreground/55">
      Tim kami siap membantu memilih produk
      yang sesuai dengan kebutuhan ruang Anda.
    </p>

    <Link
      to="/contact"
      className="
        mt-5
        inline-block
        text-[0.7rem]
        uppercase
        tracking-[0.22em]
        border-b
        border-foreground/30
        pb-1
      "
    >
      Hubungi Kami →
    </Link>
  </div>

</aside>

          <section className="min-w-0">
            <div className="flex items-center justify-between border-b hairline pb-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={
                    "grid h-8 w-8 place-items-center border hairline transition-colors " +
                    (view === "grid" ? "border-foreground text-foreground" : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={
                    "grid h-8 w-8 place-items-center border hairline transition-colors " +
                    (view === "list" ? "border-foreground text-foreground" : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <Rows3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <label className="flex items-center gap-3 text-[0.78rem] tracking-[0.2em] uppercase text-muted-foreground">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                  className="border hairline bg-transparent px-4 py-2 text-foreground focus:outline-none"
                >
                  {sorts.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="py-14 text-center text-sm text-muted-foreground">
                Tidak ada karya yang cocok dengan filter ini.
              </div>
            ) : view === "grid" ? (
              <div className="mt-10 grid gap-x-10 gap-y-16 sm:grid-cols-2">
                {filtered.map((p) => (
                  <ShopGridCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-10 divide-y hairline border-t border-b">
                {filtered.map((p) => (
                  <ShopListRow key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t hairline pt-10 text-sm text-muted-foreground">
          <span>Menampilkan {filtered.length} dari {products.length}</span>
        </div>
      </div>
    </>
  );
}

function ShopGridCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group block min-w-0"
    >
      <div className="relative aspect-[5/5] overflow-hidden bg-surface">
        <SmartImage
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
        />
        <div
  className="
    absolute inset-0
    bg-black/0
    transition-all
    duration-500
    group-hover:bg-black/5
  "
/>
      </div>
      <div className="mt-7 space-y-2">
  <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/45">
    {product.category.name}
  </div>

  <h3 className="font-serif text-2xl leading-tight transition-colors duration-300 group-hover:text-foreground/80">
    {product.name}
  </h3>

  <div className="pt-2 text-lg font-medium tracking-tight tabular-nums">
    Rp {resolvePrice(product).toLocaleString("id-ID")}
  </div>
</div>
    </Link>
  );
}

function ShopListRow({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="grid grid-cols-[80px_1fr_auto] items-center gap-6 py-6 sm:grid-cols-[160px_1fr_auto] sm:gap-8"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <SmartImage
          src={product.thumbnail}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 space-y-2">
  <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">
    {product.category.name}
  </div>

  <h3 className="font-serif text-2xl leading-tight">
    {product.name}
  </h3>

  <div className="text-sm font-medium">
    Rp {resolvePrice(product).toLocaleString("id-ID")}
  </div>
</div>
    </Link>
  );
}