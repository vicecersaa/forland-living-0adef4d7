import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X, Package } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/shop", label: "Belanja" },
  { to: "/shop", label: "Bed" },
  { to: "/shop", label: "Kasur" },
  { to: "/journal", label: "Jurnal" },
  { to: "/about", label: "Tentang" },
  { to: "/contact", label: "Kontak" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const showSearch = pathname.startsWith("/shop") || pathname.startsWith("/products");
  const { count } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !onHome || open;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-700 ease-out",
        solid
          ? "border-b hairline bg-background/85 text-foreground backdrop-blur-md"
          : "border-b border-transparent bg-transparent text-background",
      ].join(" ")}
    >
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:h-20 sm:gap-6 sm:px-6 lg:px-12">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden -ml-2 p-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-8 text-[0.78rem] font-medium tracking-[0.18em] uppercase lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="opacity-80 transition-opacity duration-500 hover:opacity-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="justify-self-center font-serif text-[1.05rem] leading-none tracking-[0.28em] sm:text-2xl sm:tracking-[0.32em]"
        >
          FORLAND
        </Link>

        <div className="flex items-center gap-1 justify-self-end sm:gap-2">
          {showSearch && (
            <IconBtn label="Cari" className="inline-flex"><Search className="h-[18px] w-[18px]" /></IconBtn>
          )}
          {user ? (
            <Link
              to="/orders"
              aria-label="Pesanan Saya"
              className="inline-flex items-center gap-2 border border-current/40 px-3 py-2 text-[0.68rem] tracking-[0.22em] uppercase opacity-90 transition-opacity duration-500 hover:opacity-100 sm:px-4"
            >
              <Package className="h-[15px] w-[15px]" />
              <span className="hidden sm:inline">Pesanan Saya</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center border border-current/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase opacity-90 transition-opacity duration-500 hover:opacity-100 sm:inline-flex"
            >
              Masuk
            </Link>
          )}
          <Link
            to="/cart"
            aria-label="Keranjang"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center opacity-80 transition-opacity duration-500 hover:opacity-100 sm:mr-0"
          >
            <span className="relative">
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="absolute -right-2 -top-1 rounded-full bg-current px-1 text-[9px] leading-[14px] text-background">
                {count}
              </span>
            </span>
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t hairline bg-background text-foreground lg:hidden">
          <nav className="mx-auto flex max-w-[1600px] flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="border-b hairline py-4 text-sm tracking-[0.18em] uppercase last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={user ? "/orders" : "/auth"}
              className="border-b hairline py-4 text-sm tracking-[0.18em] uppercase last:border-b-0"
            >
              {user ? "Pesanan Saya" : "Masuk / Daftar"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function IconBtn({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center opacity-80 transition-opacity duration-500 hover:opacity-100 ${className}`}
    >
      {children}
    </button>
  );
}