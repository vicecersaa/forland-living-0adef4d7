import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

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
const sorts = ["Curated", "Price · Low", "Price · High", "Newest"] as const;

function ShopPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Curated");

  const filtered = useMemo<Product[]>(() => {
    const base = category === "All" ? products : products.filter((p) => p.category === category);
    const sorted = [...base];
    if (sort === "Price · Low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "Price · High") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [category, sort]);

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
        <div className="flex flex-wrap items-center justify-between gap-6 border-b hairline pb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[0.78rem] tracking-[0.2em] uppercase">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  "pb-1 transition-colors " +
                  (category === c ? "border-b border-foreground text-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-[0.78rem] tracking-[0.2em] uppercase text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
              className="border-b hairline bg-transparent py-1 text-foreground focus:outline-none"
            >
              {sorts.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
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