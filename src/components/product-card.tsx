import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { Heart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1400ms] ease-out group-hover:opacity-100"
          />
        )}
        {product.tag && (
          <span className="eyebrow absolute left-4 top-4 bg-background/80 px-2 py-1 backdrop-blur">
            {product.tag}
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center bg-background/80 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="eyebrow">{product.collection}</div>
          <h3 className="mt-2 font-serif text-xl leading-tight">{product.name}</h3>
        </div>
        <div className="pt-1 text-sm tabular-nums">${product.price.toLocaleString()}</div>
      </div>
    </Link>
  );
}