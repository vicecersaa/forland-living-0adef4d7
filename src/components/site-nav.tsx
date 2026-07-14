import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, User, Heart, ShoppingBag, X } from "lucide-react";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Beds", search: { category: "Beds" } },
  { to: "/shop", label: "Mattresses", search: { category: "Mattresses" } },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

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
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-6 px-6 sm:h-20 lg:px-12">
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
          className="justify-self-center font-serif text-[1.35rem] leading-none tracking-[0.32em] sm:text-2xl"
        >
          FORLAND
        </Link>

        <div className="flex items-center gap-1 justify-self-end sm:gap-2">
          <IconBtn label="Search"><Search className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Account" className="hidden sm:inline-flex"><User className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Wishlist" className="hidden sm:inline-flex"><Heart className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Cart">
            <span className="relative">
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="absolute -right-2 -top-1 rounded-full bg-current px-1 text-[9px] leading-[14px] text-background">0</span>
            </span>
          </IconBtn>
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