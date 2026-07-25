import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pembayaran — Forland Living" },
      { name: "description", content: "Selesaikan pesanan kasur dan bed premium Forland Living Anda." },
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
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shipping + tax;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    clear();
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  if (placed) {
    return (
      <div className="mx-auto grid min-h-[80vh] max-w-2xl place-items-center px-6 py-12 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border hairline">
            <Check className="h-5 w-5" />
          </div>
          <div className="eyebrow mt-8">Pesanan Dikonfirmasi</div>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">Terima kasih.</h1>
          <p className="mt-6 text-[0.98rem] leading-[1.85] text-foreground/70">
            Konfirmasi telah dikirim ke email Anda. Atelier kami akan segera menghubungi terkait detail pengiriman.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h1 className="font-serif text-4xl">Keranjang Anda kosong.</h1>
        <p className="mt-4 text-foreground/70">Tambahkan karya terlebih dulu sebelum melanjutkan ke pembayaran.</p>
        <button
          onClick={() => navigate({ to: "/shop" })}
          className="mt-8 border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
        >
          Jelajahi Koleksi
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-16 lg:px-12 lg:pt-40">
      <div className="max-w-2xl">
        <div className="eyebrow">Langkah 02 · Pembayaran</div>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">Pembayaran</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <div className="space-y-14">
          <Section title="Kontak">
            <Field label="Email" name="email" type="email" required />
            <Field label="No. Telepon" name="phone" type="tel" />
          </Section>

          <Section title="Pengiriman">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Nama Depan" name="firstName" required />
              <Field label="Nama Belakang" name="lastName" required />
            </div>
            <Field label="Alamat" name="address" required />
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Kota" name="city" required />
              <Field label="Kode Pos" name="postal" required />
              <Field label="Negara" name="country" required />
            </div>
          </Section>

          <Section title="Metode Pembayaran">
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
                    {m === "card" ? "Kartu Kredit / Debit" : "Transfer Bank"}
                  </span>
                </label>
              ))}
            </div>
            {method === "card" && (
              <div className="mt-6 space-y-6">
                <Field label="Nomor Kartu" name="card" placeholder="1234 5678 9012 3456" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Masa Berlaku" name="expiry" placeholder="MM / YY" />
                  <Field label="CVC" name="cvc" placeholder="123" />
                </div>
              </div>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border hairline p-8">
            <div className="eyebrow">Pesanan</div>
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
                  <div className="tabular-nums">Rp{(item.product.price * item.qty).toLocaleString("id-ID")}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">Rp{subtotal.toLocaleString("id-ID")}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Pengiriman</dt><dd>Gratis</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Estimasi PPN</dt><dd className="tabular-nums">Rp{tax.toLocaleString("id-ID")}</dd></div>
            </dl>
            <div className="mt-6 flex justify-between border-t hairline pt-6">
              <span>Total</span>
              <span className="tabular-nums">Rp{total.toLocaleString("id-ID")}</span>
            </div>
            <button
              type="submit"
              className="mt-8 block w-full bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90"
            >
              Buat Pesanan
            </button>
            <Link
              to="/cart"
              className="mt-3 block text-center text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground"
            >
              ← Kembali ke Keranjang
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