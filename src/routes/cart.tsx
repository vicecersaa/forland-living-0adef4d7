import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";

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

function CartPage() {
  const { resolved, subtotal, update, remove, loading } = useCart();
  const total = subtotal;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-12 sm:px-6 lg:px-12 lg:pt-40 lg:pb-16">
      <div className="max-w-2xl">
        <div className="eyebrow">Langkah 01 · Keranjang</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">Keranjang Anda</h1>
        <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
          Sejenak untuk mempertimbangkan sebelum pembayaran. Setiap karya dibuat sesuai pesanan dalam batch kecil.
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
                className="grid grid-cols-[96px_1fr] gap-4 border-b hairline py-6 sm:grid-cols-[140px_1fr] sm:gap-6 lg:grid-cols-[160px_1fr_auto] lg:gap-8 lg:py-8"
              >
                <Link to="/products/$slug" params={{ slug: item.product.slug }} className="block aspect-[4/5] bg-surface">
                  <img
                    src={item.product.thumbnail || item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-col justify-between">
                  <div className="min-w-0">
                    <div className="eyebrow">{item.product.category?.name}</div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.product.slug }}
                      className="mt-2 block truncate font-serif text-lg leading-tight hover:opacity-70 sm:text-2xl"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-2 text-[0.78rem] tracking-[0.16em] uppercase text-muted-foreground">
                      {item.size && <span>{item.size}</span>}
                      {item.size && item.color && <span> · </span>}
                      {item.color && <span>{item.color}</span>}
                    </div>
                    <div className="mt-3 text-right tabular-nums lg:hidden">
                      Rp{(item.product.minPrice * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center border hairline">
                      <button onClick={() => update(i, item.qty - 1)} aria-label="Decrease" className="px-3 py-2">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <button onClick={() => update(i, item.qty + 1)} aria-label="Increase" className="px-3 py-2">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(i)}
                      className="inline-flex items-center gap-1 text-[0.72rem] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" /> Hapus
                    </button>
                  </div>
                </div>

                <div className="hidden text-right tabular-nums lg:block">
                  Rp{(item.product.minPrice * item.qty).toLocaleString("id-ID")}
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border hairline p-6 sm:p-8">
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
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pajak</dt>
                  <dd>Dihitung saat pembayaran</dd>
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