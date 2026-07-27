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
      aria-live="polite"
      aria-label="Preferensi cookie"
      className="fade-up fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md"
    >
      <div className="relative border hairline bg-background/95 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
        <button
          type="button"
          onClick={() => decide("essential")}
          aria-label="Tutup"
          className="absolute right-3 top-3 opacity-60 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" strokeWidth={1.4} />
        </button>
        <div className="eyebrow">— Privasi</div>
        <h3 className="mt-2 font-serif text-xl leading-tight">
          Kami menghargai ketenangan Anda.
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/70">
          Situs ini menggunakan cookie untuk menjaga pengalaman menjelajah tetap
          halus, mengingat preferensi Anda, dan memahami cara karya kami dilihat.
          Lihat{" "}
          <Link to="/about" className="border-b hairline pb-0.5 text-foreground hover:border-foreground">
            kebijakan privasi
          </Link>
          .
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="inline-flex h-10 items-center justify-center bg-foreground px-5 text-[0.7rem] tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-90"
          >
            Terima semua
          </button>
          <button
            type="button"
            onClick={() => decide("essential")}
            className="inline-flex h-10 items-center justify-center border hairline px-5 text-[0.7rem] tracking-[0.24em] uppercase text-foreground/80 transition-colors hover:text-foreground"
          >
            Hanya esensial
          </button>
        </div>
      </div>
    </div>
  );
}