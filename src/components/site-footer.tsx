import { Link } from "@tanstack/react-router";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Belanja",
    links: [
      { label: "Semua Produk", to: "/shop" },
      { label: "Bed", to: "/shop" },
      { label: "Kasur", to: "/shop" },
      { label: "Perlengkapan Tidur", to: "/shop" },
    ],
  },
  {
    title: "Rumah Forland",
    links: [
      { label: "Cerita Kami", to: "/about" },
      { label: "Pengerjaan", to: "/about" },
      { label: "Jurnal", to: "/journal" },
      { label: "Kontak", to: "/contact" },
    ],
  },
  {
    title: "Layanan",
    links: [
      { label: "Pengiriman", to: "/contact" },
      { label: "Pengembalian", to: "/contact" },
      { label: "Panduan Perawatan", to: "/journal" },
      { label: "Tanya Jawab", to: "/contact" },
    ],
  },
];

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/forland.living",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@forlandliving?_r=1&_t=ZS-98eNWF6WicZ",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
  {
    name: "Shopee",
    href: "https://www.instagram.com/forland.living?igsh=MXMwbWV2cXJ2MzBxdA==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a4 4 0 0 0-4 4H5a1 1 0 0 0-1 1l-1 13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1L20 7a1 1 0 0 0-1-1h-3a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2zm0 8a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-10 lg:px-12">

        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">

          <div className="max-w-sm">
            <div className="font-serif text-2xl tracking-[0.32em]">
              FORLAND
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Forland Living menciptakan kasur dan bed premium untuk cara hidup
              yang lebih lambat dan tenang. Quiet luxury, kenyamanan abadi,
              dikerjakan dengan seksama.
            </p>

            <div className="mt-8 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E7E8E6]
                    text-foreground/70
                    transition-all
                    duration-300
                    hover:bg-foreground
                    hover:text-background
                  "
                >
                  <span className="h-5 w-5">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>


          {columns.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-6">
                {col.title}
              </div>

              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>


        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t hairline pt-8 text-xs text-muted-foreground md:flex-row md:items-center">

          <div>
            © {new Date().getFullYear()} Forland Living. Seluruh hak cipta dilindungi.
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Privasi
            </a>

            <a href="#" className="hover:text-foreground">
              Ketentuan
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}