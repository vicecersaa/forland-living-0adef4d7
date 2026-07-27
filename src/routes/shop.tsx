import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { LayoutGrid, Rows3, Star, Search, X } from "lucide-react";

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

const categories = ["Semua", "Bed", "Kasur", "Perlengkapan"] as const;
const sorts = ["Unggulan", "Harga · Terendah", "Harga · Tertinggi", "Terbaru"] as const;
const CATEGORY_MAP: Record<(typeof categories)[number], string | null> = {
  Semua: null,
  Bed: "Beds",
  Kasur: "Mattresses",
  Perlengkapan: "Bedding",
};

const allMaterials = Array.from(
  new Set(products.flatMap((p) => p.materials))
).sort();

const priceMin = 0;
const priceMax = Math.ceil(Math.max(...products.map((p) => p.price)) / 500) * 500;

function ShopPage() {
  const { q: qParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Unggulan");
  const [maxPrice, setMaxPrice] = useState<number>(priceMax);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const query = (qParam ?? "").trim().toLowerCase();

  const toggleMaterial = (m: string) =>
    setSelectedMaterials((cur) =>
      cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]
    );

  const filtered = useMemo<Product[]>(() => {
    const cat = CATEGORY_MAP[category];
    let base = cat === null ? products : products.filter((p) => p.category === cat);
    base = base.filter((p) => p.price <= maxPrice);
    if (selectedMaterials.length) {
      base = base.filter((p) => selectedMaterials.some((m) => p.materials.includes(m)));
    }
    if (query) {
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.collection.toLowerCase().includes(query) ||
          p.materials.some((m) => m.toLowerCase().includes(query))
      );
    }
    const sorted = [...base];
    if (sort === "Harga · Terendah") sorted.sort((a, b) => a.price - b.price);
    if (sort === "Harga · Tertinggi") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [category, sort, maxPrice, selectedMaterials, query]);

  return (
    <>
      <header className="border-b hairline pt-24 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="eyebrow">— Katalog</div>
              <h1 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">
                {query ? "Hasil Pencarian" : "Semua Karya"}
              </h1>
              <p className="mt-5 max-w-xl text-foreground/70">
                {query
                  ? `Menampilkan karya yang cocok dengan “${qParam}”.`
                  : "Rangkaian karya yang ringkas dan penuh pertimbangan — bed, kasur, dan perlengkapan lembut yang menyempurnakan sebuah kamar."}
              </p>
            </div>
            <div className="hidden text-right font-serif text-xs tracking-[0.28em] uppercase text-muted-foreground md:block">
              <div className="tabular-nums text-foreground">{String(filtered.length).padStart(2, "0")}</div>
              <div className="mt-1">karya</div>
            </div>
          </div>
          {query && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border hairline px-3 py-1.5 text-xs text-foreground/80">
              <Search className="h-3 w-3" strokeWidth={1.4} />
              <span>“{qParam}”</span>
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

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* Sidebar filters */}
          <aside className="space-y-10">
            <div>
              <div className="eyebrow">— Saring</div>
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
              <h3 className="font-serif text-lg">Material</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {allMaterials.map((m) => (
                  <li key={m}>
                    <label className="flex items-center gap-3 cursor-pointer text-foreground/80 hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(m)}
                        onChange={() => toggleMaterial(m)}
                        className="h-3.5 w-3.5 accent-foreground"
                      />
                      {m}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {(selectedMaterials.length > 0 || maxPrice !== priceMax) && (
              <button
                onClick={() => {
                  setSelectedMaterials([]);
                  setMaxPrice(priceMax);
                }}
                className="eyebrow border-b hairline pb-0.5 text-muted-foreground hover:text-foreground"
              >
                Reset filter
              </button>
            )}
          </aside>

          {/* Main */}
          <section>
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
                  <ShopGridCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-10 divide-y hairline border-t border-b">
                {filtered.map((p) => (
                  <ShopListRow key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t hairline pt-10 text-sm text-muted-foreground">
          <span>Menampilkan {filtered.length} dari {products.length}</span>
          <Link to="/contact" className="text-foreground border-b hairline pb-0.5 hover:border-foreground">
            Konsultasi dengan penasihat atelier
          </Link>
        </div>
      </div>
    </>
  );
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Star className="h-3 w-3 fill-foreground text-foreground" />
      <span className="tabular-nums text-foreground/80">{rating.toFixed(1)}</span>
      <span>· {reviews} ulasan</span>
    </div>
  );
}

function PriceBlock({ product }: { product: Product }) {
  return (
    <div className="flex items-baseline gap-2 tabular-nums">
      <span className="text-sm">Rp{product.price.toLocaleString("id-ID")}</span>
      {product.originalPrice && (
        <span className="text-xs text-muted-foreground line-through">
          Rp{product.originalPrice.toLocaleString("id-ID")}
        </span>
      )}
    </div>
  );
}

function Badges({ product }: { product: Product }) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-1.5">
      {product.tag && (
        <span className="eyebrow bg-foreground px-2.5 py-1 text-background">
          {product.tag}
        </span>
      )}
      {discount !== null && (
        <span className="eyebrow bg-background/90 px-2.5 py-1 text-foreground backdrop-blur">
          − {discount}%
        </span>
      )}
    </div>
  );
}

function ShopGridCard({ product }: { product: Product }) {
  return (
    <Link to="/products/$id" params={{ id: product.id }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
        />
        <Badges product={product} />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.shortDescription}</p>
          <div className="mt-3">
            <Rating rating={product.rating} reviews={product.reviewCount} />
          </div>
        </div>
        <PriceBlock product={product} />
      </div>
    </Link>
  );
}

function ShopListRow({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group grid grid-cols-[160px_1fr_auto] items-center gap-8 py-6"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <div className="eyebrow text-muted-foreground">{product.collection}</div>
        <h3 className="mt-2 font-serif text-xl leading-tight">{product.name}</h3>
        <p className="mt-2 max-w-lg text-sm text-foreground/70">{product.shortDescription}</p>
        <div className="mt-3">
          <Rating rating={product.rating} reviews={product.reviewCount} />
        </div>
      </div>
      <PriceBlock product={product} />
    </Link>
  );
}