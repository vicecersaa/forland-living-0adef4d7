import { createFileRoute } from "@tanstack/react-router";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import philosophy from "@/assets/philosophy.jpg";
import craft from "@/assets/craftsmanship.jpg";
import material from "@/assets/material-linen.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Forland Living" },
      { name: "description", content: "Essays and studies on rest, rooms, and the making of quiet things." },
      { property: "og:title", content: "Journal — Forland Living" },
      { property: "og:description", content: "Essays and studies on rest, rooms, and the making of quiet things." },
    ],
  }),
  component: JournalPage,
});

const posts = [
  { n: "N° 12", cat: "Material", title: "A season with Belgian flax", img: material, read: "6 min" },
  { n: "N° 11", cat: "Rooms", title: "The bedroom that lets you leave the day", img: philosophy, read: "8 min" },
  { n: "N° 10", cat: "Craft", title: "Fifteen layers, one horizon", img: craft, read: "5 min" },
  { n: "N° 09", cat: "Ritual", title: "On the making of a bed", img: gallery2, read: "4 min" },
  { n: "N° 08", cat: "Places", title: "A quiet weekend in Kanazawa", img: gallery1, read: "7 min" },
];

function JournalPage() {
  const [feature, ...rest] = posts;
  return (
    <>
      <header className="border-b hairline pt-40 pb-16 lg:pt-56 lg:pb-20">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="eyebrow">The Journal</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">Field notes on quiet living.</h1>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12">
        <a href="#" className="group grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden">
            <img src={feature.img} alt={feature.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.02]" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="eyebrow">{feature.n} · {feature.cat}</div>
            <h2 className="mt-6 font-serif text-4xl leading-[1.1] md:text-5xl">{feature.title}</h2>
            <p className="mt-6 max-w-md text-foreground/70">
              On the West Flanders mill that has been weaving linen for six generations — and the
              river water that gives our sheets their unmistakable hand.
            </p>
            <div className="mt-10 text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
              {feature.read} read
            </div>
          </div>
        </a>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto grid max-w-[1600px] gap-x-10 gap-y-20 px-6 py-24 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
          {rest.map((p) => (
            <a key={p.n} href="#" className="group block">
              <div className="overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]" />
              </div>
              <div className="mt-6">
                <div className="eyebrow">{p.n} · {p.cat}</div>
                <h3 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h3>
                <div className="mt-4 text-xs text-muted-foreground">{p.read} read</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}