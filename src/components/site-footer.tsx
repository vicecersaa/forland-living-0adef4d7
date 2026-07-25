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

export function SiteFooter() {
  return (
    <footer className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-10 lg:px-12">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="font-serif text-2xl tracking-[0.32em]">FORLAND</div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Forland Living menciptakan kasur dan bed premium untuk cara hidup yang lebih lambat dan tenang. Quiet luxury, kenyamanan abadi, dikerjakan dengan seksama.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-6">{col.title}</div>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-foreground/80 hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t hairline pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Forland Living. Seluruh hak cipta dilindungi.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privasi</a>
            <a href="#" className="hover:text-foreground">Ketentuan</a>
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}