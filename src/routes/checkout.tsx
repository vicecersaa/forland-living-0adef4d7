import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

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
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/checkout", mode: "login" } });
    }
  }, [user, ready, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    address: "",
    notes: "",
  });

  const discountedSubtotal = subtotal - discount;

const tax = Math.round(discountedSubtotal * 0.11);

const total = discountedSubtotal + tax;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function applyCoupon() {

  if (!coupon.trim()) return;

  setCouponLoading(true);
  setCouponMessage("");

  try {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/validate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: coupon,
        subtotal,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    setDiscount(json.data.discount);
    setCouponMessage("Voucher berhasil digunakan");

  } catch (err) {

    setDiscount(0);

    setCouponMessage(
      err instanceof Error
        ? err.message
        : "Voucher tidak valid"
    );

  } finally {

    setCouponLoading(false);

  }

}

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Buat order
      const checkoutRes = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

  shippingAddress: {

    name: form.name,
    phone: form.phone,
    province: form.province,
    city: form.city,
    district: form.district,
    postalCode: form.postalCode,
    address: form.address,

  },

  notes: form.notes,

  coupon,

}),
      });

      const checkoutJson = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutJson.message ?? "Gagal membuat pesanan");
      }

      const orderId = checkoutJson.data._id;

      // Step 2: Buat payment token
      const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/${orderId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const paymentJson = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentJson.message ?? "Gagal membuat pembayaran");
      }

      // Step 3: Redirect ke halaman payment Midtrans
      const { redirectUrl } = paymentJson.data;
      clear();
      window.location.href = redirectUrl;

    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h1 className="font-serif text-4xl">Keranjang Anda kosong.</h1>
        <p className="mt-4 text-foreground/70">Tambahkan karya terlebih dulu sebelum melanjutkan ke pembayaran.</p>
        <button
          onClick={() => navigate({ to: "/shop", search: { q: undefined } })}
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

          <Section title="Informasi Penerima">
            <Field label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} required />
            <Field label="No. Telepon" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </Section>

          <Section title="Alamat Pengiriman">
            <Field label="Alamat Lengkap" name="address" value={form.address} onChange={handleChange} required />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Kecamatan" name="district" value={form.district} onChange={handleChange} required />
              <Field label="Kota" name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Provinsi" name="province" value={form.province} onChange={handleChange} required />
              <Field label="Kode Pos" name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </div>
          </Section>

          <Section title="Catatan">
            <label className="block">
              <span className="eyebrow block">Catatan Pesanan (opsional)</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full border-b hairline bg-transparent py-3 text-[0.95rem] outline-none transition-colors focus:border-foreground resize-none"
              />
            </label>
          </Section>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border hairline p-8">
            <div className="eyebrow">Pesanan</div>
            <div className="mt-8 border-t hairline pt-6">

  <div className="eyebrow mb-4">
    Kode Voucher
  </div>

  <div className="flex gap-3">

    <input
      value={coupon}
      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
      placeholder="Masukkan kode voucher"
      className="flex-1 border hairline bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
    />

    <button
      type="button"
      onClick={applyCoupon}
      disabled={couponLoading}
      className="min-w-[120px] bg-foreground px-5 py-3 text-xs uppercase tracking-[0.2em] text-background transition hover:opacity-90 disabled:opacity-50"
    >
      {couponLoading ? "..." : "Gunakan"}
    </button>

  </div>

  {couponMessage && (

    <div
      className={`mt-4 rounded-md border p-4 ${
        discount > 0
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-red-300 bg-red-50 text-red-700"
      }`}
    >

      <div className="font-medium">

        {discount > 0
          ? "✓ Voucher berhasil digunakan"
          : couponMessage}

      </div>

      {discount > 0 && (

        <div className="mt-1 text-sm">

          Potongan sebesar{" "}

          <strong>

            Rp{discount.toLocaleString("id-ID")}

          </strong>{" "}

          telah diterapkan.

        </div>

      )}

    </div>

  )}

</div>
            <ul className="mt-6 space-y-5">
              {resolved.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="h-20 w-16 flex-shrink-0 bg-surface">
                    <img
                      src={item.product.thumbnail || item.product.images?.[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between text-sm">
                    <div>
                      <div className="font-serif text-base leading-tight">{item.product.name}</div>
                      <div className="mt-1 text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground">
                        {item.size && <span>{item.size}</span>}
                        {item.size && item.color && <span> · </span>}
                        {item.color && <span>{item.color}</span>}
                        <span> · ×{item.qty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tabular-nums text-sm">
                    Rp{(item.product.minPrice * item.qty).toLocaleString("id-ID")}
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">Rp{subtotal.toLocaleString("id-ID")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pengiriman</dt>
                <dd>Gratis</dd>
              </div>
              <div className="flex justify-between text-green-600">

  <dt>Diskon Voucher</dt>

  <dd className="font-medium tabular-nums">

    -Rp{discount.toLocaleString("id-ID")}

  </dd>

</div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estimasi PPN 11%</dt>
                <dd className="tabular-nums">Rp{tax.toLocaleString("id-ID")}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-between border-t hairline pt-6">
              <span>Total</span>
              <span className="tabular-nums">Rp{total.toLocaleString("id-ID")}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-8 block w-full bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border-b hairline bg-transparent py-3 text-[0.95rem] outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}