import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang Belanja — Forland Living" },
      { name: "description", content: "Tinjau kembali kasur dan bed premium di keranjang Anda sebelum melanjutkan ke pembayaran." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function resolvePrice(product: Product, color: string, size: string): number {
  if (!product.variants?.length) {
    return product.price ?? 0;
  }

  const variant = product.variants.find(
    (v) => v.name === color
  );

  if (!variant) return 0;

  if (!variant.sizes?.length) {
    return product.price ?? 0;
  }

  const selectedSize = variant.sizes.find(
    (s) => s.name === size
  );

  return selectedSize?.price ?? 0;
}

function resolveThumbnail(product: Product, color: string): string {
  if (product.variants?.length) {
    const variant = product.variants.find(
      (v) => v.name === color
    );

    if (variant?.image) {  // ganti thumbnail → image
      return variant.image;  // ganti thumbnail → image
    }
  }

  return product.thumbnail || product.images?.[0] || "";
}

function CartPage() {
  const { resolved, subtotal, update, remove, loading } = useCart();
  const total = subtotal;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-12 sm:px-6 lg:px-12 lg:pt-40 lg:pb-16">
      <div className="max-w-2xl">
        <div className="eyebrow">Langkah 01 · Keranjang</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Keranjang Anda</h1>
        <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
          Sejenak untuk mempertimbangkan sebelum pembayaran. Setiap produk dibuat sesuai pesanan batch kecil.
        </p>
      </div>

      {loading ? (
        <div className="mt-24 text-center text-sm text-muted-foreground">Memuat keranjang…</div>
      ) : resolved.length === 0 ? (
        <div className="mt-12 border-t hairline pt-24 text-center">
          <p className="font-serif text-2xl text-foreground/70">Keranjang Anda masih kosong.</p>
          <Link
            to="/shop"
            search={{ q: undefined }}
            className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Jelajahi Koleksi
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <ul className="border-t hairline">
            {resolved.map((item, i) => (
              <li
  key={`${item.id}-${item.size}-${item.color}`}
  className="flex gap-4 border-b hairline py-5 sm:py-6"
>
  <Link to="/products/$slug" params={{ slug: item.product.slug }} className="relative aspect-square h-24 w-24 shrink-0 bg-surface overflow-hidden sm:h-28 sm:w-28">
    <img
  src={resolveThumbnail(item.product, item.color)}
  alt={item.product.name}
  className="h-full w-full object-contain"
/>
  </Link>

  <div className="flex flex-1 min-w-0 flex-col justify-between">
    <div className="min-w-0">
      <div className="eyebrow text-[0.62rem]">{item.product.category?.name}</div>
      <Link
        to="/products/$slug"
        params={{ slug: item.product.slug }}
        className="mt-1 block font-serif text-base leading-tight hover:opacity-70 sm:text-lg"
      >
        {item.product.name}
      </Link>
      <div className="mt-1 text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
        {item.size && <span>{item.size}</span>}
        {item.size && item.color && <span> · </span>}
        {item.color && <span>{item.color}</span>}
      </div>
      <div className="mt-2 text-sm tabular-nums font-medium">
        Rp {(resolvePrice(item.product, item.color, item.size) * item.qty).toLocaleString("id-ID")}
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center border border-foreground/15 h-9">
        <button
          onClick={() => update(i, item.qty - 1)}
          aria-label="Decrease"
          className="h-full px-3 text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-8 text-center text-sm tabular-nums font-medium">
          {item.qty}
        </span>
        <button
          onClick={() => update(i, item.qty + 1)}
          aria-label="Increase"
          className="h-full px-3 text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <button
        onClick={() => remove(i)}
        className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.16em] uppercase text-foreground/40 hover:text-foreground transition-colors"
      >
        <X className="h-3 w-3" />
        Hapus
      </button>
    </div>
  </div>
</li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="
  border
  border-foreground/10
  bg-background
  p-6
  shadow-[0_20px_60px_rgba(0,0,0,0.04)]
  sm:p-8
">
              <div className="eyebrow">Ringkasan</div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">Rp{subtotal.toLocaleString("id-ID")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pengiriman white-glove</dt>
                  <dd>Gratis</dd>
                </div>
              </dl>
              <div className="mt-6 flex justify-between border-t hairline pt-6 text-base">
                <span>Total</span>
                <span className="tabular-nums">Rp{total.toLocaleString("id-ID")}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-8 block bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90"
              >
                Lanjut ke Pembayaran
              </Link>
              <Link
                to="/shop"
                search={{ q: undefined }}
                className="mt-3 block border hairline py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
              >
                Lanjut Berbelanja
              </Link>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Karya made-to-order dikirim dalam 6–8 minggu. Setiap pesanan disertai catatan personal dari atelier kami.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}