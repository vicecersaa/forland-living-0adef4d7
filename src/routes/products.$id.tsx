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
    <div className="mx-auto max-w-xl px-6 py-40 text-center">
      <h1 className="font-serif text-4xl">This piece is no longer listed.</h1>
      <Link to="/shop" className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase">
        Return to Shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

const sizes = ["Single", "Double", "Queen", "King"];
const colors = [
  { name: "Fog", swatch: "oklch(0.9 0.005 250)" },
  { name: "Concrete", swatch: "oklch(0.75 0.005 250)" },
  { name: "Graphite", swatch: "oklch(0.42 0.005 250)" },
  { name: "Ink", swatch: "oklch(0.22 0.002 250)" },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState("Queen");
  const [color, setColor] = useState("Fog");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pt-28 lg:px-12 lg:pt-32">
        <nav className="text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-3">/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
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
            <div className="mt-6 text-lg tabular-nums">${product.price.toLocaleString()}</div>

            <p className="mt-8 text-[0.98rem] leading-[1.85] text-foreground/80">
              {product.description}
            </p>

            <div className="mt-10">
              <div className="eyebrow mb-4">Size</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={
                      "border px-5 py-3 text-sm tracking-wide transition-colors " +
                      (size === s
                        ? "border-foreground bg-foreground text-background"
                        : "hairline hover:border-foreground")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="eyebrow mb-4">Finish · {color}</div>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    style={{ background: c.swatch }}
                    className={
                      "h-9 w-9 rounded-full border transition-all " +
                      (color === c.name ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hairline")
                    }
                  />
                ))}
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
                  add({ id: product.id, size, color, qty });
                  navigate({ to: "/cart" });
                }}
                className="flex-1 bg-foreground py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-90"
              >
                Add to Bag
              </button>
              <button aria-label="Save to wishlist" className="grid place-items-center border hairline px-4 hover:border-foreground">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            <button className="mt-3 w-full border hairline py-4 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground">
              Reserve — Pay Later
            </button>

            <dl className="mt-14 space-y-4 border-t hairline pt-8 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Material</dt>
                <dd className="text-right">{product.material}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Made in</dt>
                <dd className="text-right">Oslo, Norway</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Lead time</dt>
                <dd className="text-right">6 — 8 weeks</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Guarantee</dt>
                <dd className="text-right">25 years, structural</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-32 lg:px-12">
        <div className="mb-14 flex items-end justify-between">
          <h2 className="font-serif text-3xl md:text-4xl">Also considered</h2>
          <Link to="/shop" className="border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground">
            View All
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