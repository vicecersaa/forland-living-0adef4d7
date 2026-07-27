import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.collection.toLowerCase().includes(term) ||
          p.materials.some((m) => m.toLowerCase().includes(term))
      )
      .slice(0, 6);
  }, [q]);

  const suggestions = ["Aera", "Belgian Linen", "Kasur", "Bed", "Oak"];

  const submit = () => {
    const term = q.trim();
    if (!term) return;
    navigate({ to: "/shop", search: { q: term } as never });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label="Tutup pencarian"
        onClick={onClose}
        className="fade-in-slow absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="fade-up relative mx-auto max-w-3xl px-4 pt-24 sm:pt-32">
        <div className="border hairline bg-background shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3 border-b hairline px-5 py-4 sm:px-6">
            <Search className="h-4 w-4 opacity-70" strokeWidth={1.4} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Cari kasur, bed, koleksi, atau material…"
              className="flex-1 bg-transparent text-base tracking-[-0.005em] placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>

          {q.trim() === "" ? (
            <div className="px-5 py-6 sm:px-6">
              <div className="eyebrow">— Pencarian populer</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border hairline px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Tidak ada karya cocok untuk “{q}”.
            </div>
          ) : (
            <ul className="max-h-[60vh] divide-y hairline overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/products/$id"
                    params={{ id: p.id }}
                    onClick={onClose}
                    className="group flex items-center gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden bg-surface">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="eyebrow text-muted-foreground">
                        {p.collection}
                      </div>
                      <div className="truncate font-serif text-base">
                        {p.name}
                      </div>
                    </div>
                    <div className="hidden text-sm tabular-nums text-foreground/80 sm:block">
                      Rp{p.price.toLocaleString("id-ID")}
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100"
                      strokeWidth={1.4}
                    />
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={submit}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-[0.7rem] tracking-[0.24em] uppercase text-foreground/70 hover:text-foreground sm:px-6"
                >
                  Lihat semua hasil untuk “{q}”
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}