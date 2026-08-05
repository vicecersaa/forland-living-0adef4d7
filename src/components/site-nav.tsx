import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Menu, Search, ShoppingBag, X,
  LogOut, LogIn, Package, ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { SearchOverlay } from "./search-overlay";

const links = [
  { to: "/shop",    label: "Belanja"  },
  { to: "/shop",    label: "Koleksi"  },
  { to: "/journal", label: "Jurnal"   },
  { to: "/about",   label: "Tentang"  },
  { to: "/contact", label: "Kontak"   },
] as const;

export function SiteNav() {
  const [scrolled,   setScrolled]   = useState(false);
  const [open,       setOpen]       = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname   = useRouterState({ select: (s) => s.location.pathname });
  const onHome     = pathname === "/";
  const showSearch = pathname.startsWith("/shop") || pathname.startsWith("/products");

  const { count }        = useCart();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try { await logout(); } catch (err) { console.error(err); }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || !onHome || open;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ease-out",
          solid
            ? "border-b border-border/60 bg-background/90 text-foreground backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-white",
        ].join(" ")}
      >
        <div className="relative mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:h-[72px] sm:px-8 lg:px-12">

          {/* ── KIRI: hamburger+logo (mobile) | logo+navlinks (desktop) ── */}
          <div className="flex items-center gap-2 lg:gap-8">

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative -ml-1.5 inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-foreground/5 lg:hidden"
            >
              <span className={["absolute transition-all duration-200", open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"].join(" ")}>
                <X    className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>
              <span className={["absolute transition-all duration-200", open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"].join(" ")}>
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>
            </button>

            {/* Logo — selalu ada, posisi berbeda per breakpoint */}
            <Link
              to="/"
              className="font-serif text-[1.1rem] leading-none tracking-[0.3em] lg:text-[1.4rem] lg:tracking-[0.34em]"
            >
              FORLAND
            </Link>

            {/* Nav links — desktop only, langsung setelah logo */}
            <nav className="hidden items-center gap-7 lg:flex">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-[0.75rem] font-medium tracking-[0.2em] uppercase opacity-75 transition-opacity duration-300 hover:opacity-100"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── KANAN: icons ── */}
          <div className="flex items-center gap-0.5">

            {/* Search */}
            {showSearch && (
              <NavIconBtn label="Cari produk" onClick={() => setSearchOpen(true)}>
                <Search className="h-[18px] w-[18px]" strokeWidth={1.3} />
              </NavIconBtn>
            )}

            {/* Desktop auth */}
            <div className="hidden items-center gap-0.5 lg:flex">
              {user ? (
                <>
                  <Divider />
                  <NavIconBtn label="Garansi" asChild>
                    <Link to="/warranty">
                      <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.3} />
                    </Link>
                  </NavIconBtn>
                  <NavIconBtn label="Pesanan saya" asChild>
                    <Link to="/orders">
                      <Package className="h-[18px] w-[18px]" strokeWidth={1.3} />
                    </Link>
                  </NavIconBtn>
                  <NavIconBtn label="Keluar" onClick={handleLogout}>
                    <LogOut className="h-[17px] w-[17px]" strokeWidth={1.3} />
                  </NavIconBtn>
                </>
              ) : (
                <>
                  <Divider />
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-1.5 rounded-md border border-current px-2.5 py-1.5 text-[0.7rem] font-medium tracking-[0.18em] uppercase opacity-80 transition-opacity hover:opacity-100"
                  >
                    <LogIn className="h-3.5 w-3.5" strokeWidth={1.3} />
                    Masuk
                  </Link>
                </>
              )}
            </div>

            <Divider className="hidden lg:block" />

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Keranjang belanja"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-foreground/5"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.3} />
              {count > 0 && (
                <span className="absolute right-1 top-1 text-[8px] font-semibold leading-none tracking-normal">
                  {String(count).padStart(2, "0")}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={[
            "absolute inset-x-0 top-full overflow-hidden border-t border-border/40 bg-background text-foreground transition-all duration-300 ease-in-out lg:hidden",
            open ? "max-h-screen opacity-100" : "pointer-events-none max-h-0 opacity-0",
          ].join(" ")}
        >
          <nav className="flex flex-col divide-y divide-border/40">

            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}

            {showSearch && (
              <button
                type="button"
                onClick={() => { setSearchOpen(true); setOpen(false); }}
                className="flex items-center gap-3 px-6 py-4 text-left text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
              >
                <Search className="h-[15px] w-[15px]" strokeWidth={1.5} />
                Cari
              </button>
            )}

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                >
                  <Package className="h-[15px] w-[15px]" strokeWidth={1.5} />
                  Pesanan
                </Link>
                <Link
                  to="/warranty"
                  className="flex items-center gap-3 px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                >
                  <ShieldCheck className="h-[15px] w-[15px]" strokeWidth={1.5} />
                  Garansi
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-left text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
                >
                  <LogOut className="h-[15px] w-[15px]" strokeWidth={1.5} />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-3 px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
              >
                <LogIn className="h-[15px] w-[15px]" strokeWidth={1.5} />
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <span className={`mx-1.5 inline-block h-4 w-px bg-current opacity-30 ${className}`} />
  );
}

function NavIconBtn({
  children,
  label,
  onClick,
  asChild,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  asChild?: boolean;
}) {
  const cls = "inline-flex h-9 w-9 items-center justify-center rounded-md opacity-75 transition-opacity hover:opacity-100";

  if (asChild) {
    return <span title={label} className={cls}>{children}</span>;
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}