import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { LayoutGrid, Rows3, Search, X } from "lucide-react";

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

const sorts = ["Unggulan", "Harga · Terendah", "Harga · Tertinggi", "Terbaru"] as const;

function ShopPage() {
  const { q: qParam } = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = Route.useNavigate();
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Unggulan");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const query = (qParam ?? "").trim().toLowerCase();

  const categories = useMemo(() => {
    return [
      "Semua",
      ...Array.from(new Set(products.map((p) => p.category.name))),
    ];
  }, [products]);

  const priceMin = 0;

  const priceMax = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.max(...products.map((p) => p.minPrice));
  }, [products]);

  useEffect(() => {
    setMaxPrice(priceMax);
  }, [priceMax]);

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
      base = base.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (maxPrice > 0 && maxPrice < priceMax) {
      base = base.filter((p) => p.minPrice <= maxPrice);
    }

    if (sort === "Harga · Terendah") {
      base.sort((a, b) => a.minPrice - b.minPrice);
    }

    if (sort === "Harga · Tertinggi") {
      base.sort((a, b) => b.minPrice - a.minPrice);
    }

    return base;
  }, [products, category, query, sort, maxPrice, priceMax]);

  return (
    <>
      <header className="border-b hairline pt-24 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="eyebrow">— Katalog</div>
              <h1 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">
                {query ? "Hasil Pencarian" : "Produk Kami"}
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
        {/* Category tabs */}
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

        {/* Mobile filter toggle */}
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
          {/* Sidebar filters — desktop selalu tampil, mobile toggle */}
          <aside className={`space-y-10 ${filterOpen ? "block" : "hidden"} lg:block`}>
            <div>
              <div className="eyebrow">— Produk</div>
              <p className="mt-3 text-xs text-muted-foreground">
                Menampilkan {filtered.length} dari {products.length}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg">Harga</h3>
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-4 w-full accent-foreground"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>Rp{priceMin.toLocaleString("id-ID")}</span>
                <span>Hingga Rp{maxPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg">Kategori</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {categories.map((c) => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-3 text-foreground/80 hover:text-foreground">
                      <input
                        type="radio"
                        name="category"
                        checked={category === c}
                        onChange={() => setCategory(c)}
                        className="h-3.5 w-3.5 accent-foreground"
                      />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {maxPrice !== priceMax && (
              <button
                onClick={() => setMaxPrice(priceMax)}
                className="eyebrow border-b hairline pb-0.5 text-muted-foreground hover:text-foreground"
              >
                Reset filter
              </button>
            )}
          </aside>

          {/* Main */}
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
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="min-w-0 flex-1 break-words font-serif text-lg leading-snug">
          {product.name}
        </h3>
        <div className="shrink-0 text-sm tabular-nums">
          Rp{product.minPrice.toLocaleString("id-ID")}
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
      <img
        src={product.thumbnail}
        alt={product.name}
        className="aspect-square w-full object-cover"
      />

      <div className="min-w-0">
        <h3 className="break-words font-serif text-lg sm:text-xl">{product.name}</h3>
      </div>

      <div className="shrink-0 text-sm tabular-nums">
        Rp{product.minPrice.toLocaleString("id-ID")}
      </div>
    </Link>
  );
}