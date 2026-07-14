import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-bedroom.jpg";
import philosophyImg from "@/assets/philosophy.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import materialImg from "@/assets/material-linen.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import bed1 from "@/assets/product-bed-1.jpg";
import bed2 from "@/assets/product-bed-2.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Collections />
      <Craftsmanship />
      <MaterialStory />
      <BestSellers />
      <Gallery />
      <Reviews />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-foreground text-background">
      <img
        src={heroImg}
        alt="A quiet bedroom in soft morning light with linen bedding"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover fade-in-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-24">
        <div className="max-w-2xl fade-up">
          <div className="eyebrow !text-background/80">Aera Collection — Spring</div>
          <h1 className="mt-6 font-serif text-[clamp(2.75rem,6.5vw,6rem)] leading-[1.02] tracking-[-0.02em]">
            A slower way<br />to end the day.
          </h1>
          <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-background/80">
            Beds and mattresses shaped by the belief that comfort should be quiet — honest
            materials, unhurried hands, a room that finally lets you rest.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 border-b border-background/70 pb-2 text-[0.78rem] tracking-[0.24em] uppercase transition-colors hover:border-background"
            >
              Shop the Collection
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 pb-2 text-[0.78rem] tracking-[0.24em] uppercase text-background/80 hover:text-background"
            >
              Discover the Story
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[0.65rem] tracking-[0.3em] uppercase text-background/60 lg:px-12">
        <span>Est. 2014 — Oslo</span>
        <span>N° 01 / 04</span>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-32 lg:px-12 lg:py-48">
      <div className="grid gap-16 md:grid-cols-12 md:gap-24">
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <div className="eyebrow">Our Philosophy</div>
          <h2 className="mt-8 font-serif text-4xl leading-[1.05] md:text-6xl">
            Luxury should feel lived&nbsp;in, not performed.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <img
            src={philosophyImg}
            alt="An arched window casting soft light across a linen-dressed bed"
            loading="lazy"
            width={1600}
            height={1104}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="mt-10 space-y-6 text-[0.98rem] leading-[1.85] text-foreground/80 md:max-w-xl">
            <p>
              We believe rest is a discipline. So we make the objects around it with the same care —
              a bed you sink into without thinking, a mattress that holds you like a long breath,
              linen that becomes better the longer you own it.
            </p>
            <p>
              Nothing here shouts. Everything is placed with intention. Forland Living is a
              practice of quiet — a house of considered pieces made to outlast trend, weather, and
              the noise of the day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  const items = [
    { title: "Beds", copy: "Frames in oak, walnut, and upholstery.", img: bed1, id: "beds" },
    { title: "Mattresses", copy: "Fifteen layers of quiet support.", img: gallery2, id: "mattresses" },
    { title: "Bedroom", copy: "A room, considered end to end.", img: gallery1, id: "bedroom" },
    { title: "New Arrivals", copy: "The season, softly introduced.", img: bed2, id: "new" },
  ];
  return (
    <section className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Collections</div>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Composed for the room.</h2>
          </div>
          <Link
            to="/shop"
            className="border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            View All
          </Link>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <Link key={c.id} to="/shop" className="group block">
              <div className="overflow-hidden aspect-[3/4] bg-background">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-6">
                <h3 className="font-serif text-2xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Craftsmanship() {
  const pillars = [
    { n: "01", t: "Honest Materials", c: "European flax, natural latex, kiln-dried oak, virgin wool." },
    { n: "02", t: "Local Hands", c: "Every frame and mattress is assembled by a small team in Oslo." },
    { n: "03", t: "Comfort, Engineered", c: "Fifteen tuned layers, mapped to the way a body settles." },
    { n: "04", t: "Built to Age", c: "Repairable joinery. A 25-year structural guarantee." },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-32 lg:px-12 lg:py-48">
      <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">
        <div className="order-2 lg:order-1">
          <div className="eyebrow">Craftsmanship</div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
            Made slowly, so you may live slowly.
          </h2>
          <p className="mt-8 max-w-lg text-[0.98rem] leading-[1.85] text-foreground/80">
            Each Forland piece begins with a drawing and ends with a signature. Between the two,
            weeks of measured work — no rushed seams, no hidden materials, no shortcuts.
          </p>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.n} className="border-t hairline pt-6">
                <div className="eyebrow">{p.n}</div>
                <h3 className="mt-3 font-serif text-xl">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.c}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <img
            src={craftImg}
            alt="A craftsman hand-stitching a premium mattress"
            loading="lazy"
            width={1600}
            height={1200}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function MaterialStory() {
  return (
    <section className="border-y hairline bg-surface">
      <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full lg:aspect-auto">
          <img
            src={materialImg}
            alt="A macro study of woven linen fabric"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-24 lg:px-16 lg:py-32">
          <div className="max-w-lg">
            <div className="eyebrow">Material Study — N° 03</div>
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
              Belgian flax. Softened by weather, not chemistry.
            </h2>
            <p className="mt-8 text-[0.98rem] leading-[1.85] text-foreground/80">
              We source our linen from a single family mill in West Flanders. The yarn is loomed
              slowly, then stone-washed in river water until it settles into the gentle, lived-in
              hand that defines every Forland bed.
            </p>
            <Link
              to="/journal"
              className="mt-10 inline-flex items-center gap-3 border-b hairline pb-2 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
            >
              Read the Material Journal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="eyebrow">Considered Objects</div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Quietly loved.</h2>
        </div>
        <Link
          to="/shop"
          className="border-b hairline pb-1 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
        >
          Shop All
        </Link>
      </div>
      <div className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="max-w-xl">
          <div className="eyebrow">A House, Photographed</div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Rooms that breathe.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
          <img src={gallery1} alt="A serene minimalist bedroom" loading="lazy" className="aspect-[4/5] w-full object-cover md:col-span-5" />
          <div className="grid gap-6 md:col-span-7 md:gap-8">
            <img src={philosophyImg} alt="A bedroom with an arched window" loading="lazy" className="aspect-[16/9] w-full object-cover" />
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <img src={gallery2} alt="A stack of soft linen pillows" loading="lazy" className="aspect-square w-full object-cover" />
              <img src={bed2} alt="A low oak bed in a japandi bedroom" loading="lazy" className="aspect-square w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const quotes = [
    { q: "The first bed I've owned that feels like it belongs to the room, not the catalogue.", a: "Ines M. — Copenhagen" },
    { q: "Sleep has quietly become the most considered part of my day.", a: "Julian W. — Berlin" },
    { q: "You feel the hours in it. That's the compliment I can pay.", a: "Aiko S. — Kyoto" },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 text-center lg:px-12 lg:py-48">
      <div className="eyebrow">From the House</div>
      <div className="mt-14 grid gap-16 md:grid-cols-3">
        {quotes.map((r) => (
          <figure key={r.a} className="mx-auto max-w-sm">
            <blockquote className="font-serif text-2xl leading-[1.35] md:text-[1.6rem]">
              "{r.q}"
            </blockquote>
            <figcaption className="mt-8 text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
              {r.a}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="border-t hairline bg-foreground text-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:py-32">
        <div className="eyebrow !text-background/60">Correspondence</div>
        <h2 className="mt-6 font-serif text-3xl leading-[1.15] md:text-5xl">
          Occasional letters on rest, rooms, and the making of quiet things.
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex w-full max-w-md items-center border-b border-background/40"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="w-full bg-transparent py-3 text-sm placeholder:text-background/50 focus:outline-none"
          />
          <button
            type="submit"
            className="pb-2 pl-4 text-[0.72rem] tracking-[0.24em] uppercase text-background/80 hover:text-background"
          >
            Subscribe →
          </button>
        </form>
        <p className="mt-6 text-xs text-background/50">No more than once a month. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
