import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1400ms] ease-out group-hover:opacity-100"
          />
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="eyebrow">{product.category?.name}</div>
          <h3 className="mt-2 font-serif text-xl leading-tight">{product.name}</h3>
        </div>
        <div className="pt-1 text-sm tabular-nums">
          Rp{product.minPrice.toLocaleString("id-ID")}
        </div>
      </div>
    </Link>
  );
}