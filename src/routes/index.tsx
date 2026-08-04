import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import heroImg from "@/assets/hero-bedroom.jpg";
import philosophyImg from "@/assets/philosophy.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import materialImg from "@/assets/material-linen.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import bed2 from "@/assets/product-bed-2.jpg";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";

export const Route = createFileRoute("/")({
  component: Index,
});

type HomepageData = {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    smallText: string;
    image: string;
  };
  promoCards: {
    label: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  }[];
  collection: {
    label: string;
    title: string;
    viewAllText: string;
    viewAllLink: string;
    items: {
      title: string;
      subtitle: string;
      link: string;
      image: string;
    }[];
  };
  philosophy: {
    label: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
  };
  craftsmanship: {
    label: string;
    title: string;
    intro: string;
    items: {
      number: string;
      title: string;
      description: string;
    }[];
    image: string;
  };
  materialStudy: {
    label: string;
    title: string;
    paragraph: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
  gallery: {
    label: string;
    title: string;
    images: string[];
  };
  testimonials: {
    label: string;
    title: string;
    testimonials: {
      quote: string;
      name: string;
      location: string;
      rating: number;
    }[];
  };
  newsletter: {
    label: string;
    title: string;
    buttonText: string;
    disclaimer: string;
  };
};

function useHomepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  useEffect(() => {
    api<{ data: HomepageData }>("/homepage")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);
  return data;
}

function Index() {
  const hp = useHomepage();
  return (
    <>
      <Hero hp={hp} />
      <PromoBanner />
      <Categories hp={hp} />
      <Philosophy hp={hp} />
      <Craftsmanship hp={hp} />
      <MaterialStory hp={hp} />
      <Gallery hp={hp} />
      <Reviews hp={hp} />
      <Newsletter hp={hp} />
    </>
  );
}

function Hero({ hp }: { hp: HomepageData | null }) {
  const hero = hp?.hero;
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-foreground text-background">
      <SmartImage
        src={hero?.image || heroImg}
        alt="A quiet bedroom in soft morning light with linen bedding"
        width={1920}
        height={1280}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover fade-in-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-24">
        <div className="max-w-2xl fade-up">
          <div className="eyebrow !text-background/80">
            {hero?.badge || "Koleksi Aera — Musim Semi"}
          </div>
          <h1 className="mt-6 font-serif text-[clamp(2.75rem,6.5vw,6rem)] leading-[1.02] tracking-[-0.02em]">
            {hero?.title
              ? hero.title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))
              : (
                <>
                  Cara yang lebih tenang<br />mengakhiri hari.
                </>
              )}
          </h1>
          <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-background/80">
            {hero?.description ||
              "Bed dan kasur premium yang lahir dari keyakinan bahwa kenyamanan sejati bersifat tenang — material jujur, tangan yang tidak tergesa, dan ruang yang benar-benar mengistirahatkan Anda."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              to={hero?.primaryCtaLink || "/shop"}
              search={{ q: undefined }}
              className="group inline-flex items-center gap-3 border-b border-background/70 pb-2 text-[0.78rem] tracking-[0.24em] uppercase transition-colors hover:border-background"
            >
              {hero?.primaryCtaText || "Jelajahi Koleksi"}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to={hero?.secondaryCtaLink || "/about"}
              className="group inline-flex items-center gap-3 pb-2 text-[0.78rem] tracking-[0.24em] uppercase text-background/80 hover:text-background"
            >
              {hero?.secondaryCtaText || "Kenali Cerita Kami"}
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[0.65rem] tracking-[0.3em] uppercase text-background/60 lg:px-12">
        <span>{hero?.smallText || "Est. 2014 — Bogor, Indonesia"}</span>
        <span>N° 01 / 04</span>
      </div>
    </section>
  );
}

function PromoBanner() {
  type Banner = {
    _id: string;
    image: string;
    link?: string;
    sortOrder: number;
  };

  const [slides, setSlides] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api<{ data: Banner[] }>("/banners")
      .then((res) => setSlides(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [slides]);

  const go = (direction: number) => {
    setCurrent((prev) => (prev + direction + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-10 md:pt-16 lg:px-12 lg:pt-20">
      <div className="relative overflow-hidden rounded">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((banner) => (
            <div key={banner._id} className="relative min-w-full">
              {banner.link ? (
                <a href={banner.link} target="_self">
                  <SmartImage
                    src={banner.image}
                    alt=""
                    className="h-[260px] w-full object-cover md:h-[360px] lg:h-[360px]"
                  />
                </a>
              ) : (
                <SmartImage
                  src={banner.image}
                  alt=""
                  className="h-[260px] w-full object-cover md:h-[360px] lg:h-[360px]"
                />
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={
                    current === index
                      ? "h-1 w-8 bg-white transition-all"
                      : "h-1 w-4 bg-white/40 transition-all"
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Categories({ hp }: { hp: HomepageData | null }) {
  type Category = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api<{ data: Category[] }>("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  if (!categories.length) return null;

  const col = hp?.collection;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:pb-0 lg:pt-32">
      <div className="mb-12">
        <div className="eyebrow">{col?.label || "Koleksi"}</div>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">
          {col?.title || "Temukan ruang istirahat Anda."}
        </h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            to="/shop"
            search={{ q: category.slug }}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <SmartImage
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-6">
              <h3 className="font-serif text-2xl">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Philosophy({ hp }: { hp: HomepageData | null }) {
  const p = hp?.philosophy;
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-24">
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <div className="eyebrow">{p?.label || "Filosofi Kami"}</div>
          <h2 className="mt-8 font-serif text-4xl leading-[1.05] md:text-6xl">
            {p?.title || "Kemewahan seharusnya terasa hidup, bukan dipertontonkan."}
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <SmartImage
              src={p?.image || philosophyImg}
              alt="An arched window casting soft light across a linen-dressed bed"
              width={1600}
              height={1104}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="mt-10 space-y-6 text-[0.98rem] leading-[1.85] text-foreground/80 md:max-w-xl">
            <p>
              {p?.paragraph1 ||
                "Kami percaya bahwa istirahat adalah sebuah disiplin. Karena itu, setiap benda di sekitarnya kami rawat dengan sungguh-sungguh — bed yang membuat Anda melebur tanpa berpikir, kasur yang memeluk seperti tarikan napas panjang, dan linen yang semakin lembut seiring waktu."}
            </p>
            <p>
              {p?.paragraph2 ||
                "Tidak ada yang berteriak di sini. Semua ditempatkan dengan niat. Forland Living adalah praktik ketenangan — sebuah rumah berisi karya yang dibuat untuk melampaui tren, cuaca, dan hiruk pikuk hari."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Craftsmanship({ hp }: { hp: HomepageData | null }) {
  const c = hp?.craftsmanship;

  const defaultPillars = [
    { number: "01", title: "Material Jujur", description: "Flax Eropa, latex alami, oak kering oven, dan wool murni." },
    { number: "02", title: "Tangan Lokal", description: "Setiap rangka dan kasur dirakit oleh tim kecil di Bogor." },
    { number: "03", title: "Kenyamanan Terukur", description: "Lima belas lapis presisi, dipetakan sesuai lekuk tubuh." },
    { number: "04", title: "Dirancang untuk Berumur", description: "Sambungan yang dapat diperbaiki. Garansi struktural 25 tahun." },
  ];

  const pillars = c?.items?.length ? c.items : defaultPillars;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:py-48">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="order-2 lg:order-1">
          <div className="eyebrow">{c?.label || "Pengerjaan"}</div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
            {c?.title || "Dibuat perlahan, agar Anda dapat hidup perlahan."}
          </h2>
          <p className="mt-8 max-w-lg text-[0.98rem] leading-[1.85] text-foreground/80">
            {c?.intro ||
              "Setiap karya Forland dimulai dari sebuah gambar dan diakhiri dengan tanda tangan. Di antara keduanya, berminggu-minggu pekerjaan yang terukur — tanpa jahitan yang terburu, tanpa material yang disembunyikan, tanpa jalan pintas."}
          </p>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.number} className="border-t hairline pt-6">
                <div className="eyebrow">{p.number}</div>
                <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative order-1 lg:order-2 aspect-[4/5] w-full overflow-hidden">
          <SmartImage
            src={c?.image || craftImg}
            alt="A craftsman hand-stitching a premium mattress"
            width={1600}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function MaterialStory({ hp }: { hp: HomepageData | null }) {
  const m = hp?.materialStudy;
  return (
    <section className="border-y hairline bg-surface">
      <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full lg:aspect-auto">
          <SmartImage
            src={m?.image || materialImg}
            alt="A macro study of woven linen fabric"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-14 lg:px-16 lg:py-32">
          <div className="max-w-lg">
            <div className="eyebrow">{m?.label || "Studi Material — N° 03"}</div>
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
              {m?.title || "Flax Belgia. Dilembutkan oleh cuaca, bukan kimia."}
            </h2>
            <p className="mt-8 text-[0.98rem] leading-[1.85] text-foreground/80">
              {m?.paragraph ||
                "Linen kami berasal dari satu pabrik keluarga di West Flanders. Benangnya ditenun perlahan, lalu dicuci batu dalam air sungai hingga jatuh dengan sentuhan lembut dan hidup yang menjadi ciri setiap bed Forland."}
            </p>
            <Link
              to={m?.ctaLink || "/journal"}
              className="mt-10 inline-flex items-center gap-3 border-b hairline pb-2 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
            >
              {m?.ctaText || "Baca Jurnal Material"} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ hp }: { hp: HomepageData | null }) {
  const g = hp?.gallery;
  const defaultImages = [gallery1, philosophyImg, gallery2, bed2];
  const images = g?.images?.filter(Boolean).length ? g.images : defaultImages;

  return (
    <section className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12 lg:py-32">
        <div className="max-w-xl">
          <div className="eyebrow">{g?.label || "Rumah, Dalam Bidikan"}</div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            {g?.title || "Ruang yang bernapas."}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-12 md:gap-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden md:col-span-5">
            <SmartImage
              src={images[0]}
              alt="A serene minimalist bedroom"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-6 md:col-span-7 md:gap-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <SmartImage
                src={images[1]}
                alt="A bedroom with an arched window"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <div className="relative aspect-square w-full overflow-hidden">
                <SmartImage
                  src={images[2]}
                  alt="A stack of soft linen pillows"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative aspect-square w-full overflow-hidden">
                <SmartImage
                  src={images[3]}
                  alt="A low oak bed in a japandi bedroom"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews({ hp }: { hp: HomepageData | null }) {
  const t = hp?.testimonials;

  const defaultQuotes = [
    { quote: "Bed pertama yang saya miliki yang terasa menjadi bagian dari kamar, bukan dari katalog.", name: "INES M.", location: "Copenhagen", rating: 5 },
    { quote: "Tidur diam-diam menjadi bagian paling saya pertimbangkan dari hari saya.", name: "JULIAN W.", location: "Berlin", rating: 5 },
    { quote: "Anda bisa merasakan jam kerja di dalamnya. Itulah pujian terbaik yang bisa saya berikan.", name: "AIKO S.", location: "Kyoto", rating: 5 },
  ];

  const quotes = t?.testimonials?.length ? t.testimonials : defaultQuotes;

  return (
    <section className="border-y hairline">
      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-12 lg:py-40">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 border-b hairline pb-8">
          <div>
            <div className="eyebrow">{t?.label || "Dari Rumah Forland"}</div>
            <h2 className="mt-4 font-serif text-3xl leading-[1.1] md:text-5xl">
              {t?.title || "Suara dari mereka yang tidur di dalamnya."}
            </h2>
          </div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground">N° 04 · Ulasan</div>
        </div>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-3">
          {quotes.map((r, i) => (
            <figure key={r.name} className="relative flex h-full flex-col">
              <span aria-hidden className="font-serif text-6xl leading-none text-foreground/15">"</span>
              <blockquote className="mt-2 font-serif text-[1.35rem] leading-[1.4] md:text-[1.55rem]">
                {r.quote}
              </blockquote>
              <div className="mt-8 flex-1" />
              <figcaption className="mt-6 border-t hairline pt-5">
                <div className="text-[0.72rem] tracking-[0.28em] uppercase">{r.name}</div>
                <div className="mt-1 text-[0.68rem] tracking-[0.22em] uppercase text-muted-foreground">— {r.location}</div>
                <div className="mt-3 flex items-center gap-1.5 text-foreground/70">
                  {Array.from({ length: r.rating || 5 }).map((_, k) => (
                    <span key={k} className="text-[0.7rem]">★</span>
                  ))}
                  <span className="ml-2 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">N° 0{i + 1}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter({ hp }: { hp: HomepageData | null }) {
  const n = hp?.newsletter;
  return (
    <section className="border-t hairline bg-foreground text-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-14 text-center lg:py-32">
        <div className="eyebrow !text-background/60">{n?.label || "Surat Berkala"}</div>
        <h2 className="mt-6 font-serif text-3xl leading-[1.15] md:text-5xl">
          {n?.title || "Surat sesekali tentang istirahat, ruang, dan pembuatan karya yang tenang."}
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex w-full max-w-md items-center border-b border-background/40"
        >
          <input
            type="email"
            required
            placeholder="Alamat email Anda"
            className="w-full bg-transparent py-3 text-sm placeholder:text-background/50 focus:outline-none"
          />
          <button
            type="submit"
            className="pb-2 pl-4 text-[0.72rem] tracking-[0.24em] uppercase text-background/80 hover:text-background"
          >
            {n?.buttonText || "Berlangganan"} →
          </button>
        </form>
        <p className="mt-6 text-xs text-background/50">
          {n?.disclaimer || "Tidak lebih dari sekali sebulan. Berhenti langganan kapan saja."}
        </p>
      </div>
    </section>
  );
}