import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X, Package, LogIn, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { SearchOverlay } from "./search-overlay";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const showSearch = pathname.startsWith("/shop") || pathname.startsWith("/products");
  const { count } = useCart();
  const { user, logout } = useAuth();

  async function handleLogout() {
  try {
    await logout();
  } catch (err) {
    console.error(err);
  }
}

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
    <>
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
            <IconBtn label="Cari" className="inline-flex" onClick={() => setSearchOpen(true)}>
              <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </IconBtn>
          )}
          {user ? (
            <>
              <Link
                to="/orders"
                aria-label="Pesanan Saya"
                className="group inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-[0.7rem] tracking-[0.2em] uppercase opacity-85 transition-opacity duration-500 hover:opacity-100 sm:gap-2.5 sm:px-3.5"
              >
                <Package className="h-4 w-4 shrink-0" strokeWidth={1.4} />
                <span className="hidden sm:inline leading-none">Pesanan</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Keluar"
                title="Keluar"
                className="inline-flex h-10 w-10 items-center justify-center opacity-70 transition-opacity duration-500 hover:opacity-100"
              >
                <LogOut className="h-[17px] w-[17px]" strokeWidth={1.4} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              aria-label="Masuk"
              className="hidden items-center gap-2.5 rounded-full px-3.5 py-2 text-[0.7rem] tracking-[0.2em] uppercase opacity-85 transition-opacity duration-500 hover:opacity-100 sm:inline-flex"
            >
              <LogIn className="h-4 w-4 shrink-0" strokeWidth={1.4} />
              <span className="leading-none">Masuk</span>
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
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 py-4 text-left text-sm tracking-[0.18em] uppercase text-muted-foreground"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.4} /> Keluar
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconBtn({
  children,
  label,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center opacity-80 transition-opacity duration-500 hover:opacity-100 ${className}`}
    >
      {children}
    </button>
  );
}