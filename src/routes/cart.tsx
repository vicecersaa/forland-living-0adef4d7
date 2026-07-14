import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Forland Living" },
      { name: "description", content: "Review the pieces in your bag before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { resolved, subtotal, update, remove } = useCart();
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-28 pb-32 lg:px-12 lg:pt-40">
      <div className="max-w-2xl">
        <div className="eyebrow">Step 01 · Bag</div>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">Your Bag</h1>
        <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
          A moment to consider before checkout. Every piece is made to order in small batches.
        </p>
      </div>

      {resolved.length === 0 ? (
        <div className="mt-24 border-t hairline pt-24 text-center">
          <p className="font-serif text-2xl text-foreground/70">Your bag is empty.</p>
          <Link
            to="/shop"
            className="mt-8 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <ul className="border-t hairline">
            {resolved.map((item, i) => (
              <li key={`${item.id}-${item.size}-${item.color}`} className="grid grid-cols-[120px_1fr_auto] gap-6 border-b hairline py-8 sm:grid-cols-[160px_1fr_auto] sm:gap-8">
                <Link to="/products/$id" params={{ id: item.id }} className="block aspect-[4/5] bg-surface">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="eyebrow">{item.product.collection}</div>
                    <Link to="/products/$id" params={{ id: item.id }} className="mt-2 block font-serif text-xl leading-tight hover:opacity-70 sm:text-2xl">
                      {item.product.name}
                    </Link>
                    <div className="mt-2 text-[0.78rem] tracking-[0.16em] uppercase text-muted-foreground">
                      {item.size} · {item.color}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
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
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right tabular-nums">
                  ${(item.product.price * item.qty).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border hairline p-8">
              <div className="eyebrow">Summary</div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${subtotal.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">White-glove delivery</dt><dd>Complimentary</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Taxes</dt><dd>Calculated at checkout</dd></div>
              </dl>
              <div className="mt-6 flex justify-between border-t hairline pt-6 text-base">
                <span>Total</span>
                <span className="tabular-nums">${total.toLocaleString()}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-8 block bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="mt-3 block border hairline py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
              >
                Continue Browsing
              </Link>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Made-to-order pieces ship within 6–8 weeks. Each order is accompanied by a personal note from the workshop.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}