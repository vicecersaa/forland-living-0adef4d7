import { createFileRoute } from "@tanstack/react-router";
import philosophyImg from "@/assets/philosophy.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import materialImg from "@/assets/material-linen.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Forland Living" },
      { name: "description", content: "A small Oslo house making beds and mattresses for a slower way of living." },
      { property: "og:title", content: "About — Forland Living" },
      { property: "og:description", content: "A small Oslo house making beds and mattresses for a slower way of living." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-14 text-center lg:pt-56">
        <div className="eyebrow">Est. 2014 — Oslo</div>
        <h1 className="mt-8 font-serif text-5xl leading-[1.05] md:text-7xl">
          A quiet house of considered comfort.
        </h1>
        <p className="mx-auto mt-10 max-w-2xl text-[1rem] leading-[1.85] text-foreground/80">
          Forland Living was founded on a single instinct — that the objects surrounding rest
          deserve as much thought as the objects that fill the working hours of a day.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-12">
        <img src={philosophyImg} alt="" loading="lazy" className="aspect-[21/9] w-full object-cover" />
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-16 md:grid-cols-2 md:gap-24">
        <div>
          <div className="eyebrow">Our Practice</div>
          <h2 className="mt-6 font-serif text-4xl leading-tight">Slow, by design.</h2>
        </div>
        <div className="space-y-6 text-[0.98rem] leading-[1.85] text-foreground/80">
          <p>
            We work in a small atelier north of Oslo. Every frame is signed, every mattress is
            hand-tufted, and every order is scheduled with unhurried care.
          </p>
          <p>
            Our range is intentionally small. We would rather return to the same drawing for a
            decade than release a season we cannot stand behind in twenty years.
          </p>
          <p>
            The house counts twelve people. Two of them are the founders. All of them touch every
            bed that leaves the workshop.
          </p>
        </div>
      </section>

      <section className="border-y hairline bg-surface">
        <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2">
          <img src={craftImg} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover lg:aspect-auto" />
          <div className="flex items-center px-6 py-14 lg:px-16">
            <div className="max-w-md">
              <div className="eyebrow">Materials</div>
              <h2 className="mt-6 font-serif text-4xl leading-tight">The five we trust.</h2>
              <ul className="mt-10 space-y-6 text-sm">
                {[
                  ["Belgian Flax Linen", "A single family mill in West Flanders."],
                  ["Kiln-Dried European Oak", "FSC-certified, air-cured for six months."],
                  ["Natural Talalay Latex", "Rubber-tree sap, poured in Sri Lanka."],
                  ["Virgin Wool", "Icelandic. Fire-resistant without treatment."],
                  ["Pocket Springs", "Individually nested, tuned to five body zones."],
                ].map(([t, c]) => (
                  <li key={t} className="border-t hairline pt-4">
                    <div className="font-serif text-lg">{t}</div>
                    <div className="mt-1 text-muted-foreground">{c}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-40">
        <img src={materialImg} alt="" loading="lazy" className="mx-auto mb-14 aspect-[4/3] w-40 object-cover" />
        <blockquote className="font-serif text-3xl leading-[1.25] md:text-4xl">
          "Luxury, to us, is the absence of noise — in the room, in the object, and in the hand
          that made it."
        </blockquote>
        <div className="mt-8 text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
          Mette & Anders Forland — Founders
        </div>
      </section>
    </>
  );
}