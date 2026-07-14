import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { LayoutGrid, Rows3, Star } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Forland Living" },
      { name: "description", content: "Beds, mattresses, and bedding, quietly considered. Explore the full Forland Living catalogue." },
      { property: "og:title", content: "Shop — Forland Living" },
      { property: "og:description", content: "Beds, mattresses, and bedding, quietly considered." },
    ],
  }),
  component: ShopPage,
});

const categories = ["All", "Beds", "Mattresses", "Bedding"] as const;
const sorts = ["Featured", "Price · Low", "Price · High", "Newest"] as const;

const allMaterials = Array.from(
  new Set(products.flatMap((p) => p.materials))
).sort();

const priceMin = 0;
const priceMax = Math.ceil(Math.max(...products.map((p) => p.price)) / 500) * 500;

function ShopPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [maxPrice, setMaxPrice] = useState<number>(priceMax);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggleMaterial = (m: string) =>
    setSelectedMaterials((cur) =>
      cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]
    );

  const filtered = useMemo<Product[]>(() => {
    let base = category === "All" ? products : products.filter((p) => p.category === category);
    base = base.filter((p) => p.price <= maxPrice);
    if (selectedMaterials.length) {
      base = base.filter((p) => selectedMaterials.some((m) => p.materials.includes(m)));
    }
    const sorted = [...base];
    if (sort === "Price · Low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "Price · High") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [category, sort, maxPrice, selectedMaterials]);

  return (
    <>
      <header className="border-b hairline pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="eyebrow">The Catalogue</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">All Objects</h1>
          <p className="mt-6 max-w-xl text-foreground/70">
            A small, considered range — beds, mattresses, and the soft things that finish a room.
          </p>
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
              <div className="eyebrow">— Filter</div>
              <p className="mt-3 text-xs text-muted-foreground">
                Showing {filtered.length} of {products.length}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg">Price</h3>
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
                <span>${priceMin.toLocaleString()}</span>
                <span>Up to ${maxPrice.toLocaleString()}</span>
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
                Clear filters
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
              <div className="py-24 text-center text-sm text-muted-foreground">
                No objects match these filters.
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

        <div className="mt-24 flex flex-col items-center justify-center gap-4 border-t hairline pt-10 text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {products.length}</span>
          <Link to="/contact" className="text-foreground border-b hairline pb-0.5 hover:border-foreground">
            Speak with an atelier advisor
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
      <span>· {reviews} reviews</span>
    </div>
  );
}

function PriceBlock({ product }: { product: Product }) {
  return (
    <div className="flex items-baseline gap-2 tabular-nums">
      <span className="text-sm">${product.price.toLocaleString()}</span>
      {product.originalPrice && (
        <span className="text-xs text-muted-foreground line-through">
          ${product.originalPrice.toLocaleString()}
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