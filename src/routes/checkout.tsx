import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Forland Living" },
      { name: "description", content: "Complete your Forland Living order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { resolved, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [method, setMethod] = useState<"card" | "transfer">("card");

  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    clear();
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  if (placed) {
    return (
      <div className="mx-auto grid min-h-[80vh] max-w-2xl place-items-center px-6 py-40 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border hairline">
            <Check className="h-5 w-5" />
          </div>
          <div className="eyebrow mt-8">Order Confirmed</div>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">Thank you.</h1>
          <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
            A confirmation has been sent to your inbox. Our atelier will be in touch shortly with delivery details.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-serif text-4xl">Your bag is empty.</h1>
        <p className="mt-4 text-foreground/70">Add a piece before proceeding to checkout.</p>
        <button
          onClick={() => navigate({ to: "/shop" })}
          className="mt-8 border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
        >
          Explore the Collection
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-28 pb-32 lg:px-12 lg:pt-40">
      <div className="max-w-2xl">
        <div className="eyebrow">Step 02 · Checkout</div>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">Checkout</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-16 grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <div className="space-y-14">
          <Section title="Contact">
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
          </Section>

          <Section title="Delivery">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
            </div>
            <Field label="Address" name="address" required />
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="City" name="city" required />
              <Field label="Postal code" name="postal" required />
              <Field label="Country" name="country" required />
            </div>
          </Section>

          <Section title="Payment">
            <div className="grid gap-2">
              {(["card", "transfer"] as const).map((m) => (
                <label
                  key={m}
                  className={
                    "flex cursor-pointer items-center gap-4 border p-5 transition-colors " +
                    (method === m ? "border-foreground" : "hairline hover:border-foreground/50")
                  }
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    className="accent-foreground"
                  />
                  <span className="text-[0.82rem] tracking-[0.2em] uppercase">
                    {m === "card" ? "Credit or Debit Card" : "Bank Transfer"}
                  </span>
                </label>
              ))}
            </div>
            {method === "card" && (
              <div className="mt-6 space-y-6">
                <Field label="Card number" name="card" placeholder="1234 5678 9012 3456" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Expiry" name="expiry" placeholder="MM / YY" />
                  <Field label="CVC" name="cvc" placeholder="123" />
                </div>
              </div>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border hairline p-8">
            <div className="eyebrow">Order</div>
            <ul className="mt-6 space-y-5">
              {resolved.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="h-20 w-16 flex-shrink-0 bg-surface">
                    <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between text-sm">
                    <div>
                      <div className="font-serif text-base leading-tight">{item.product.name}</div>
                      <div className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground">
                        {item.size} · {item.color} · ×{item.qty}
                      </div>
                    </div>
                  </div>
                  <div className="tabular-nums">${(item.product.price * item.qty).toLocaleString()}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">${subtotal.toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>Complimentary</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Estimated tax</dt><dd className="tabular-nums">${tax.toLocaleString()}</dd></div>
            </dl>
            <div className="mt-6 flex justify-between border-t hairline pt-6">
              <span>Total</span>
              <span className="tabular-nums">${total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              className="mt-8 block w-full bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90"
            >
              Place Order
            </button>
            <Link
              to="/cart"
              className="mt-3 block text-center text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground"
            >
              ← Return to Bag
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border-b hairline bg-transparent py-3 text-[0.95rem] outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}