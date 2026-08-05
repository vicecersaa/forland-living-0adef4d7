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
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z" />
      </svg>
    ),
  },
  {
    name: "Threads",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5c-3.7 0-6 2.1-6 5.5 0 3.8 2.7 6.5 6.4 6.5 3 0 5-1.7 5-4.1 0-2.2-1.7-3.8-4.1-3.8-2 0-3.3 1.1-3.3 2.6 0 1.2 1 2 2.3 2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
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