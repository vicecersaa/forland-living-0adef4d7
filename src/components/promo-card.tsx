import { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface PromoCoupon {
  code: string;
  discount: number;
  label?: string;
}

export function PromoCard() {
  const [visible, setVisible] = useState(false);
  const [promo, setPromo] = useState<PromoCoupon>({
    code: "FORLAND10",
    discount: 10,
    label: "Untuk semua produk pilihan",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const INTERVAL_DAYS = 3;
    const last = localStorage.getItem("forland-promo-shown");

    if (last) {
      const diffDays = (Date.now() - parseInt(last)) / (1000 * 60 * 60 * 24);
      if (diffDays < INTERVAL_DAYS) return;
    }

    // Uncomment kalau backend sudah siap:
    // fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/popup`)
    //   .then((r) => r.json())
    //   .then((json) => { if (json?.data) setPromo(json.data); })
    //   .catch(() => {});

    setTimeout(() => setVisible(true), 900);
  }, []);

  const dismiss = () => {
    localStorage.setItem("forland-promo-shown", Date.now().toString());
    setVisible(false);
  };

  const copyCode = () => {
  navigator.clipboard.writeText(promo.code).then(() => {
    toast.success("Kode berhasil disalin!", {
      description: `${promo.code} siap dipakai di checkout.`,
      duration: 2500,
    });
  });
};

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      <div aria-hidden onClick={dismiss} className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      <div className="relative w-full max-w-[400px] bg-white shadow-[0_48px_120px_rgba(0,0,0,0.35)]">
        <div className="h-[3px] w-full bg-foreground" />

        <button type="button" onClick={dismiss} aria-label="Tutup" className="absolute right-5 top-5 text-foreground/50 transition hover:text-foreground">
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="px-10 pb-10 pt-8">

          <div className="text-[0.6rem] uppercase tracking-[0.35em] text-foreground/60">
            Penawaran Spesial
          </div>

          <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.15] text-foreground">
            Selamat datang<br />di Forland Living.
          </h3>

          <div className="mt-6 h-px w-8 bg-foreground/30" />

          <div className="mt-6 border border-dashed border-foreground/25 bg-[#F7F6F4] py-8 text-center">
            <div className="font-serif text-[4.5rem] leading-none font-medium text-foreground">
              {promo.discount}%
            </div>
            {/* label — dinamis dari backend */}
            <div className="mt-2 text-[0.7rem] uppercase tracking-[0.25em] text-foreground/70">
              {promo.label}
            </div>

            {/* code — dinamis dari backend */}
            <div className="mt-6 inline-flex items-center gap-4 border border-foreground/20 bg-white px-6 py-3">
              <span className="font-mono text-base font-semibold tracking-[0.2em] text-foreground">
                {promo.code}
              </span>
              <button
  type="button"
  onClick={copyCode}
  aria-label="Salin kode"
  className="transition-colors"
>
  <Copy className="h-4 w-4 text-foreground/60 hover:text-foreground" strokeWidth={1.5} />
</button>
            </div>
          </div>

          <Link
            to="/shop"
            search={{ q: undefined }}
            onClick={dismiss}
            className="mt-6 block w-full bg-foreground py-4 text-center text-[0.7rem] uppercase tracking-[0.3em] text-white transition hover:opacity-85"
          >
            Pakai Sekarang
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full text-center text-[0.6rem] uppercase tracking-[0.25em] text-foreground/50 transition hover:text-foreground/80"
          >
            Lewati
          </button>

        </div>
      </div>
    </div>
  );
}