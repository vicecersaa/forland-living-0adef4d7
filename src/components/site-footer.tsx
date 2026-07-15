import { Link } from "@tanstack/react-router";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "Beds", to: "/shop" },
      { label: "Mattresses", to: "/shop" },
      { label: "Bedding", to: "/shop" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Craftsmanship", to: "/about" },
      { label: "Journal", to: "/journal" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Shipping & Delivery", to: "/contact" },
      { label: "Returns", to: "/contact" },
      { label: "Care Guide", to: "/journal" },
      { label: "FAQ", to: "/contact" },
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
              Forland Living crafts beds and mattresses for a slower, softer way of living. Quiet
              luxury. Timeless comfort. Thoughtfully made.
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
          <div>© {new Date().getFullYear()} Forland Living. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}