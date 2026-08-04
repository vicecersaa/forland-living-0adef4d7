import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

const KEY = "forland-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Preferensi Cookie"
      className="fixed inset-0 z-[60] flex items-center justify-center px-5 py-8"
    >
      {/* Dark Premium Blur */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/20 backdrop-blur-lg transition-all duration-700"
      />

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-white/10 bg-zinc-950/70 backdrop-blur-3xl shadow-[0_35px_120px_rgba(0,0,0,.65)] animate-in fade-in zoom-in-95 duration-500">

        {/* subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none" />

        {/* Close */}
        <button
          type="button"
          onClick={() => decide("essential")}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-white/50 transition hover:text-white"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="relative p-7 sm:p-8">

          <div className="text-[10px] uppercase tracking-[0.35em] text-white/45">
            Privacy
          </div>

          <h3 className="mt-3 font-serif text-3xl leading-tight text-white">
            Kami menghargai
            <br />
            ketenangan Anda.
          </h3>

          <p className="mt-5 text-sm leading-7 text-white/65">
            Situs ini menggunakan cookie untuk menjaga pengalaman menjelajah
            tetap nyaman, mengingat preferensi Anda, serta membantu kami
            memahami bagaimana karya Forland Living dinikmati.
          </p>

          <p className="mt-3 text-sm leading-7 text-white/65">
            Silakan membaca{" "}
            <Link
              to="/about"
              className="border-b border-white/30 text-white transition hover:border-white"
            >
              Kebijakan Privasi
            </Link>{" "}
            kami untuk informasi lebih lanjut.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => decide("accepted")}
              className="flex-1 bg-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.30em] text-black transition-all duration-300 hover:scale-[1.02] hover:bg-white"
            >
              Terima Semua
            </button>

            <button
              type="button"
              onClick={() => decide("essential")}
              className="flex-1 border border-white/15 bg-white/5 px-6 py-3 text-[11px] uppercase tracking-[0.30em] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Hanya Esensial
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}