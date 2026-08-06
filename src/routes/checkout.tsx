import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { ongkirData, findOngkir } from "@/data/ongkir";
import type { Product } from "@/lib/cart";

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

const WA_ADMIN = "6285174271344";

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

  const [shippingCost, setShippingCost] = useState(0);
  const [isCOD, setIsCOD] = useState(false);
  const [shippingLabel, setShippingLabel] = useState<string | null>(null);

  const [isFromLink, setIsFromLink] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingOrderNumber, setPendingOrderNumber] = useState<string | null>(null);
  const [showWAPopup, setShowWAPopup] = useState(false);

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

    
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const token = params.get("token");
    if (!orderId || !token) return;

    fetch(`${import.meta.env.VITE_API_URL}/orders/validate-token?order_id=${orderId}&token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          const order = data.data;
          setForm({
            name: order.shippingAddress.name,
            phone: order.shippingAddress.phone,
            province: order.shippingAddress.province,
            city: order.shippingAddress.city,
            district: order.shippingAddress.district,
            postalCode: order.shippingAddress.postalCode,
            address: order.shippingAddress.address,
            notes: order.notes || "",
          });
          setShippingCost(order.shippingCost);
          setIsCOD(order.isCOD);
          setShippingLabel(order.isCOD ? "COD" : `Rp ${order.shippingCost.toLocaleString("id-ID")}`);
          setIsFromLink(true);
          setPendingOrderId(orderId);
        }
      })
      .catch(() => setError("Link tidak valid atau sudah expired."));
  }, []);

  // Fix #4 — hapus tax
  const total = (subtotal - discount) + shippingCost;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setDiscount(json.data.discount);
      setCouponMessage("Voucher berhasil digunakan");
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err instanceof Error ? err.message : "Voucher tidak valid");
    } finally {
      setCouponLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Fix #3 — validasi stok sebelum proses
    if (!isFromLink) {
      const outOfStock = resolved.find(
  item => item.product.totalStock < item.qty
);
      if (outOfStock) {
        setError(`Stok ${outOfStock.product.name} tidak mencukupi. Silakan perbarui keranjang Anda.`);
        return;
      }
    }

    setLoading(true);

    try {
      if (isFromLink && pendingOrderId) {
        const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/${pendingOrderId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const paymentJson = await paymentRes.json();
        if (!paymentRes.ok) throw new Error(paymentJson.message ?? "Gagal membuat pembayaran");
        clear();
        window.location.href = paymentJson.data.redirectUrl;
        return;
      }

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
          shippingCost,
          notes: form.notes,
          coupon,
        }),
      });
      const checkoutJson = await checkoutRes.json();
      if (!checkoutRes.ok) {
        // Fix #3 — error handler stok dari backend
        const msg = checkoutJson.message ?? "Gagal membuat pesanan";
        if (msg.toLowerCase().includes("stock") || msg.toLowerCase().includes("stok")) {
          throw new Error(`Stok produk tidak mencukupi. Silakan perbarui keranjang Anda.`);
        }
        throw new Error(msg);
      }

      const orderId = checkoutJson.data._id;

      const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/${orderId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentJson.message ?? "Gagal membuat pembayaran");

      clear();
      window.location.href = paymentJson.data.redirectUrl;

    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  if (resolved.length === 0 && !isFromLink) {
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

  const waMessage = `Halo Forland Living! 👋\n\nSaya ingin bertanya tentang ongkos kirim ke kota saya yang belum tersedia.\n\n*No. Pesanan: ${pendingOrderNumber || "-"}*\nNama: ${form.name || "-"}\nNo. HP: ${form.phone || "-"}\nAlamat: ${form.address || "-"}, ${form.district || "-"}, ${form.province || "-"}\n\nProduk:\n${resolved.map(i => `- ${i.product.name} x${i.qty}`).join("\n")}\n\nMohon bantuannya, terima kasih!`;
  const waUrl = `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-24 pb-16 sm:px-6 lg:px-12 lg:pt-40">

      {showWAPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md border hairline bg-background p-10">
            <div className="eyebrow mb-6">Informasi Pengiriman</div>
            <h2 className="font-serif text-3xl leading-[1.1]">
              Kota Anda belum tersedia di layanan pengiriman kami.
            </h2>
            <div className="mt-8 border-t hairline pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hubungi admin kami melalui WhatsApp untuk mengetahui biaya pengiriman ke kota Anda. Admin akan membantu proses pemesanan Anda.
              </p>
            </div>
            {/* Fix #5 — redirect ke home setelah buka WA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => navigate({ to: "/" }), 500)}
              className="mt-10 block w-full bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90 transition-opacity"
            >
              Chat Admin via WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="max-w-2xl">
        <div className="eyebrow">Langkah 02 · Pembayaran</div>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">Pembayaran</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-24 overflow-hidden">
        <div className="space-y-14">

          <Section title="Informasi Penerima">
            <Field label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} required disabled={isFromLink} />
            <Field label="No. Telepon" name="phone" type="tel" value={form.phone} onChange={handleChange} required disabled={isFromLink} />
          </Section>

          <Section title="Alamat Pengiriman">
            <Field label="Alamat Lengkap" name="address" value={form.address} onChange={handleChange} required disabled={isFromLink} />
            <div className="grid gap-6 sm:grid-cols-2 relative">
              <Field label="Kecamatan" name="district" value={form.district} onChange={handleChange} required disabled={isFromLink} />
              {/* Fix #1 — ongkir update saat pilih kota */}
              <CitySelect
                value={form.city}
                onChange={(city) => {
                  setForm(prev => ({ ...prev, city }));
                  const result = findOngkir(city);
                  if (result) {
                    setShippingCost(result.cost);
                    setShippingLabel(`Rp ${result.cost.toLocaleString("id-ID")}`);
                  } else {
                    setShippingCost(0);
                    setShippingLabel(null);
                  }
                  setIsCOD(false);
                }}
                disabled={isFromLink}
                onNotFound={async () => {
                  try {
                    const pendingRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/pending-ongkir`, {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        shippingAddress: {
                          name: form.name,
                          phone: form.phone,
                          province: form.province,
                          city: form.city || "Belum dipilih",
                          district: form.district,
                          postalCode: form.postalCode,
                          address: form.address,
                        },
                        notes: form.notes,
                        items: resolved.map(i => ({
                          product: i.id,
                          variant: i.color,
                          size: i.size,
                          quantity: i.qty,
                        })),
                      }),
                    });
                    const pendingJson = await pendingRes.json();
                    if (pendingJson?.data?.orderNumber) {
                      setPendingOrderNumber(pendingJson.data.orderNumber);
                      setPendingOrderId(pendingJson.data._id);
                    }
                  } catch {
                    // silent fail
                  }
                  setShowWAPopup(true);
                }}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Provinsi" name="province" value={form.province} onChange={handleChange} required disabled={isFromLink} />
              <Field label="Kode Pos" name="postalCode" value={form.postalCode} onChange={handleChange} required disabled={isFromLink} />
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

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div
  className="
    border
    border-foreground/10
    bg-background
    p-8
    shadow-[0_20px_60px_rgba(0,0,0,0.04)]
  "
>
            <div className="eyebrow">Pesanan</div>

            

            <ul className="mt-6 space-y-4">
  {resolved.map((item) => (
    <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
      <div className="h-20 w-16 shrink-0 overflow-hidden bg-surface">
        <img
          src={item.product.thumbnail || item.product.images?.[0]}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 min-w-0 flex-col justify-between">
        <div className="min-w-0">
          <div className="font-serif text-sm leading-snug line-clamp-2">{item.product.name}</div>
          <div className="mt-1 text-[0.65rem] tracking-[0.14em] uppercase text-muted-foreground">
            {item.size && <span>{item.size}</span>}
            {item.size && item.color && <span> · </span>}
            {item.color && <span>{item.color}</span>}
            <span> · x{item.qty}</span>
          </div>
        </div>
        <div className="tabular-nums text-sm mt-1">
          Rp {(resolvePrice(item.product, item.color, item.size) * item.qty).toLocaleString("id-ID")}
        </div>
      </div>
    </li>
  ))}
</ul>

            <div className="mt-8 border-t hairline pt-6">
  <div className="eyebrow mb-4">Kode Voucher</div>
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
...
</div>

            <dl className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">Rp {subtotal.toLocaleString("id-ID")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pengiriman</dt>
                <dd className="tabular-nums">
                  {shippingLabel === null ? (
                    <span className="text-muted-foreground italic text-xs">-</span>
                  ) : shippingLabel === "COD" ? (
                    "COD (bayar di tempat)"
                  ) : (
                    shippingLabel
                  )}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Diskon Voucher</dt>
                  <dd className="font-medium tabular-nums">-Rp {discount.toLocaleString("id-ID")}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex justify-between border-t hairline pt-6 font-serif text-lg">
              <span>Total</span>
              <span className="tabular-nums">Rp {total.toLocaleString("id-ID")}</span>
            </div>

            

            <button
              type="submit"
              disabled={loading}
              className="mt-8 block w-full bg-foreground py-4 text-center text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Memproses..." : isFromLink ? "Lanjutkan Pembayaran" : "Buat Pesanan"}
            </button>

            <Link to="/cart" className="mt-3 block text-center text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground">
              Kembali ke Keranjang
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

// ========================
// City Select
// ========================
function CitySelect({
  value,
  onChange,
  disabled,
  onNotFound,
}: {
  value: string;
  onChange: (city: string) => void;
  disabled?: boolean;
  onNotFound: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selected = ongkirData.find(item => item.city === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 return (
  <div ref={ref} className="relative block w-full">
      <span className="eyebrow block">Kota</span>
      <button
  type="button"
  disabled={disabled}
  onClick={() => !disabled && setOpen(prev => !prev)}
  className="
    mt-3
    w-full
    border
    border-foreground/15
    bg-background
    px-5
    py-4
    text-left
    flex
    items-center
    justify-between
    transition-all
    hover:border-foreground/40
    disabled:opacity-40
    disabled:cursor-not-allowed
  "
>
  <span
    className={
      value
        ? "text-[0.95rem] text-foreground font-medium"
        : "text-[0.95rem] text-foreground/40"
    }
  >
    {selected ? selected.city : "Pilih kota tujuan"}
  </span>

  <span className="
    text-[0.65rem]
    uppercase
    tracking-[0.22em]
    text-foreground/40
  ">
    {open ? "Tutup" : "Pilih"}
  </span>
</button>
      {open && (
  <div className="absolute left-0 top-full z-40 mt-2 w-full max-h-64 overflow-y-auto border hairline bg-background shadow-lg">
          {ongkirData.map((item) => (
            <button
  key={item.city}
  type="button"
  onClick={() => {
    onChange(item.city);
    setOpen(false);
  }}
  className={`
    w-full
    px-4
    py-2.5
    text-left
    text-[0.78rem]
    uppercase
    tracking-[0.14em]
    transition-colors
    hover:bg-foreground/5
    ${
      value === item.city
        ? "bg-foreground/5 text-foreground font-medium"
        : "text-foreground/70"
    }
  `}
>
  {item.city}
</button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onNotFound();
            }}
            className="w-full border-t hairline px-4 py-3 text-left text-sm text-muted-foreground hover:bg-foreground/5 transition-colors"
          >
            Kota saya tidak ada di daftar
          </button>
        </div>
      )}
    </div>
  );
}

// ========================
// Reusable Components
// ========================
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
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <label className="group block">
      <span
        className="
          block
          text-[0.68rem]
          uppercase
          tracking-[0.18em]
          text-foreground/45
          transition-colors
          group-focus-within:text-foreground
        "
      >
        {label}
      </span>

      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
          mt-3
          w-full
          border-b
          border-foreground/15
          bg-foreground/[0.02]
          px-3
          py-3.5
          text-[0.95rem]
          text-foreground
          outline-none
          transition-all
          placeholder:text-foreground/25
          focus:border-foreground
          focus:bg-foreground/[0.04]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      />
    </label>
  );
}