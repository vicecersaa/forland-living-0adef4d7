import { createFileRoute } from "@tanstack/react-router";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import philosophy from "@/assets/philosophy.jpg";
import craft from "@/assets/craftsmanship.jpg";
import material from "@/assets/material-linen.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Jurnal — Forland Living" },
      { name: "description", content: "Catatan tentang istirahat, ruang, dan cara membuat sesuatu dengan tenang." },
      { property: "og:title", content: "Jurnal — Forland Living" },
      { property: "og:description", content: "Catatan tentang istirahat, ruang, dan cara membuat sesuatu dengan tenang." },
    ],
  }),
  component: JournalPage,
});

const posts = [
  {
    n: "N° 12",
    cat: "Material",
    title: "Satu musim bersama flax Belgia",
    img: material,
    read: "6 menit",
    excerpt: "Tentang pabrik tenun di West Flanders yang telah menenun linen selama enam generasi — dan air sungai yang memberi lembaran tidur kami sentuhan yang tak tergantikan.",
  },
  {
    n: "N° 11",
    cat: "Ruang",
    title: "Kamar tidur yang membiarkan Anda melepas hari",
    img: philosophy,
    read: "8 menit",
    excerpt: "",
  },
  {
    n: "N° 10",
    cat: "Pengerjaan",
    title: "Lima belas lapis, satu cakrawala",
    img: craft,
    read: "5 menit",
    excerpt: "",
  },
  {
    n: "N° 09",
    cat: "Ritual",
    title: "Tentang cara merapikan tempat tidur",
    img: gallery2,
    read: "4 menit",
    excerpt: "",
  },
  {
    n: "N° 08",
    cat: "Perjalanan",
    title: "Akhir pekan yang tenang di Kanazawa",
    img: gallery1,
    read: "7 menit",
    excerpt: "",
  },
];

function JournalPage() {
  const [feature, ...rest] = posts;
  return (
    <>
      <header className="border-b hairline pt-24 pb-16 lg:pt-56 lg:pb-20">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="eyebrow">Jurnal Forland</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">
            Catatan dari kehidupan yang tenang.
          </h1>
        </div>
      </header>

      {/* Featured post */}
      <section className="mx-auto max-w-[1600px] px-6 py-12 lg:px-12">
        <a href="#" className="group grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden">
            <img
              src={feature.img}
              alt={feature.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.02]"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="eyebrow">{feature.n} · {feature.cat}</div>
            <h2 className="mt-6 font-serif text-4xl leading-[1.1] md:text-5xl">
              {feature.title}
            </h2>
            <p className="mt-6 max-w-md text-foreground/70">
              {feature.excerpt}
            </p>
            <div className="mt-10 text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
              {feature.read} baca
            </div>
          </div>
        </a>
      </section>

      {/* Rest of posts */}
      <section className="border-t hairline">
        <div className="mx-auto grid max-w-[1600px] gap-x-10 gap-y-20 px-6 py-14 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
          {rest.map((p) => (
            <a key={p.n} href="#" className="group block">
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-6">
                <div className="eyebrow">{p.n} · {p.cat}</div>
                <h3 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h3>
                <div className="mt-4 text-xs text-muted-foreground">{p.read} baca</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}