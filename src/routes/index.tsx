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
      <BestsellerProducts />
      <PromoBanner />
      <PromoCards />
      <FlashDeals />
      <Categories hp={hp} />
      <Craftsmanship hp={hp} />
      <PromoStrip />
      <Reviews hp={hp} />
      <Newsletter hp={hp} />
    </>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

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
          <p className="mt-8 max-w-md font-display text-[0.95rem] leading-relaxed text-background/80">
            {hero?.description ||
              "Bed dan kasur premium yang lahir dari keyakinan bahwa kenyamanan sejati bersifat tenang — material jujur, tangan yang tidak tergesa, dan ruang yang benar-benar mengistirahatkan Anda."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              to={hero?.primaryCtaLink || "/shop"}
              search={{ q: undefined }}
              className="group inline-flex items-center gap-3 border-b border-background/70 pb-2 text-[0.78rem] tracking-[0.24em] uppercase transition-colors hover:border-background font-display"
            >
              {hero?.primaryCtaText || "Jelajahi Koleksi"}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to={hero?.secondaryCtaLink || "/about"}
              className="group inline-flex items-center gap-3 pb-2 text-[0.78rem] tracking-[0.24em] uppercase hover:text-background font-display"
            >
              {hero?.secondaryCtaText || "Kenali Cerita Kami"}
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[0.65rem] tracking-[0.3em] uppercase text-background/100 lg:px-12 font-display">
        <span>{hero?.smallText || "Est. 2014 — Bogor, Indonesia"}</span>
        <span>N° 01 / 04</span>
      </div>
    </section>
  );
}

// ─── Promo Banner (carousel) ─────────────────────────────────────────────────

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
    /*
      Section ini sengaja TIDAK punya px (padding horizontal) di mobile
      supaya carousel bisa full-bleed edge-to-edge.
      Di lg ke atas baru diberi padding + max-width.
    */
    <section className="py-0 lg:py-0">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
        {/* wrapper carousel — overflow:hidden wajib ada di sini */}
        <div className="relative overflow-hidden rounded-sm">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((banner) => (
              <div key={banner._id} className="relative min-w-full">
                {/*
                  Mobile  : h-[180px] fixed — cukup untuk preview banner, tidak makan layar
                  Tablet  : h-[260px]
                  Desktop : h-[360px]
                */}
                <div className="h-[180px] sm:h-[260px] md:h-[360px]">
                  {banner.link ? (
                    <a href={banner.link} target="_self" className="block h-full">
                      <SmartImage
                        src={banner.image}
                        alt=""
                        className="h-full w-full object-contain object-center"
                      />
                    </a>
                  ) : (
                    <SmartImage
                      src={banner.image}
                      alt=""
                      className="h-full w-full object-contain object-center"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white md:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white md:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
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
      </div>
    </section>
  );
}

// ─── Bestseller Products ──────────────────────────────────────────────────────

function BestsellerProducts() {
  type Size = { name: string; price: number };
  type Variant = { name: string; image?: string; sizes?: Size[] };
  type Product = {
    _id: string;
    name: string;
    slug: string;
    price?: number;
    thumbnail: string;
    variants?: Variant[];
    category?: { name: string };
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api<{ data: { items: Product[] } }>("/products")
      .then((res) => setProducts(res.data.items.slice(0, 4)))
      .catch(console.error);
  }, []);

  if (!products.length) return null;

  const getStartingPrice = (product: Product): number => {
    const allPrices: number[] = [];
    for (const v of product.variants ?? []) {
      for (const s of v.sizes ?? []) {
        if (s.price) allPrices.push(s.price);
      }
    }
    if (allPrices.length) return Math.min(...allPrices);
    return product.price ?? 0;
  };

  const formatPrice = (price: number) =>
    price > 0 ? "Rp " + price.toLocaleString("id-ID") : "Hubungi kami";

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="eyebrow">Paling Dicari</div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            Pilihan terbaik, menurut mereka.
          </h2>
        </div>
        <Link
          to="/shop"
          search={{ q: undefined }}
          className="group inline-flex items-center gap-2 border-b hairline pb-2 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
        >
          Lihat Semua
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => {
          const startingPrice = getStartingPrice(product);
          const isBestseller = i === 0;
          const hasVariants = (product.variants?.length ?? 0) > 1;

          return (
            <Link
              key={product._id}
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="group block font-display"
            >
              <div className="relative aspect-square overflow-hidden bg-surface">
                <SmartImage
                  src={product.thumbnail}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                />
                {isBestseller && (
                  <div className="absolute left-4 top-4">
                    <span className="inline-block bg-background/90 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase text-foreground">
                      Terlaris
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground/90 py-3 text-center text-[0.7rem] tracking-[0.22em] uppercase text-background backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                  Lihat Produk →
                </div>
              </div>
              <div className="mt-5">
                {product.category?.name && (
                  <div className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground font-display">
                    {product.category.name}
                  </div>
                )}
                <h3 className="mt-1 font-serif text-xl leading-tight line-clamp-2">{product.name}</h3>
                <div className="mt-3 border-t hairline pt-3">
                  <span className="font-serif text-lg">
                    {hasVariants ? "Mulai " : ""}{formatPrice(startingPrice)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Promo Cards ─────────────────────────────────────────────────────────────

function PromoCards() {
  type Size = {
    name: string;
    price: number;
  };

  type Variant = {
    name: string;
    image?: string;
    sizes?: Size[];
  };

  type Category = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
  };

  type Product = {
    _id: string;
    name: string;
    slug: string;
    price?: number;
    thumbnail: string;
    variants?: Variant[];
    category?: {
      name: string;
    };
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    Promise.all([
      api<{ data: Category[] }>("/categories"),
      api<{ data: { items: Product[] } }>("/products?category=furniture&limit=6"),
    ])
      .then(([categoryRes, productRes]) => {
        const furniture = categoryRes.data.find((item) => item.slug === "furniture");
        setCategory(furniture ?? null);
        setProducts(productRes.data.items);
      })
      .catch(console.error);
  }, []);

  if (!category || !products.length) return null;

  const getStartingPrice = (product: Product): number => {
    const prices: number[] = [];
    for (const variant of product.variants ?? []) {
      for (const size of variant.sizes ?? []) {
        if (size.price > 0) prices.push(size.price);
      }
    }
    if (prices.length) return Math.min(...prices);
    return product.price ?? 0;
  };

  const formatPrice = (price: number) =>
    price > 0 ? `Rp ${price.toLocaleString("id-ID")}` : "Hubungi kami";

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b hairline pb-8">
        <div>
          <div className="eyebrow">Koleksi Terpilih</div>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">
            Kesempurnaan di setiap sisi ruangan.
          </h2>
        </div>
        <Link
          to="/shop"
          search={{ q: undefined }}
          className="group inline-flex items-center gap-2 border-b hairline pb-2 text-[0.72rem] tracking-[0.24em] uppercase hover:border-foreground"
        >
          Lihat Semua
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_2fr]">
        <Link
          to="/shop"
          search={{ q: undefined }}
          className="group relative overflow-hidden bg-surface"
        >
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[560px]">
            {category.image && (
              <SmartImage
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.035]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute right-5 top-5 font-display text-[0.62rem] tracking-[0.2em] text-white/60">
              01
            </div>
            <div className="absolute left-5 top-5">
              <span className="bg-white/90 px-3 py-1.5 text-[0.58rem] tracking-[0.2em] uppercase text-black">
                Koleksi
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
              <div className="font-display text-[0.62rem] tracking-[0.2em] uppercase text-white/60">
                Forland Living
              </div>
              <h3 className="mt-2 font-serif text-4xl leading-none md:text-5xl">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-4 max-w-md text-[0.78rem] leading-relaxed text-white/70">
                  {category.description}
                </p>
              )}
              <div className="mt-6 inline-flex items-center gap-3 border-b border-white/40 pb-2 text-[0.65rem] tracking-[0.22em] uppercase transition-all duration-300 group-hover:gap-4 group-hover:border-white">
                Jelajahi Furniture
                <span>→</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((product, index) => {
            const price = getStartingPrice(product);
            const hasVariants = (product.variants?.length ?? 0) > 1;

            return (
              <Link
                key={product._id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group flex min-w-0 flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-surface">
                  <SmartImage
                    src={product.thumbnail}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
                  />
                  <div className="absolute left-3 top-3 text-[0.58rem] tracking-[0.15em] text-foreground/40">
                    {String(index + 2).padStart(2, "0")}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground/90 py-2.5 text-center text-[0.62rem] tracking-[0.2em] uppercase text-background transition-transform duration-300 group-hover:translate-y-0">
                    Lihat Produk →
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted-foreground">
                    Furniture
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 font-serif text-[0.95rem] leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-3 border-t hairline pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-[0.85rem]">
                        {hasVariants ? "Mulai " : ""}
                        {formatPrice(price)}
                      </span>
                      <span className="text-[0.7rem] text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Flash Deals ─────────────────────────────────────────────────────────────

function FlashDeals() {
  type Size = { name: string; price: number };
  type Variant = { name: string; image?: string; sizes?: Size[] };
  type Product = {
    _id: string;
    name: string;
    slug: string;
    price?: number;
    thumbnail: string;
    variants?: Variant[];
    category?: { name: string };
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api<{ data: { items: Product[] } }>("/products")
      .then((res) => setProducts(res.data.items.slice(0, 5)))
      .catch(console.error);
  }, []);

  if (!products.length) return null;

  const getStartingPrice = (product: Product): number => {
    const prices: number[] = [];
    for (const variant of product.variants ?? []) {
      for (const size of variant.sizes ?? []) {
        if (size.price > 0) prices.push(size.price);
      }
    }
    if (prices.length) return Math.min(...prices);
    return product.price ?? 0;
  };

  const formatPrice = (price: number) =>
    price > 0 ? `Rp ${price.toLocaleString("id-ID")}` : "Hubungi kami";

  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="font-display text-[0.62rem] tracking-[0.24em] uppercase text-white/40">
              Pilihan Terpilih
            </div>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] text-white md:text-5xl">
              Temuan terbaik untuk ruang Anda.
            </h2>
          </div>
          <Link
            to="/shop"
            search={{ q: undefined }}
            className="group inline-flex items-center gap-2 border-b border-white/30 pb-2 text-[0.68rem] tracking-[0.24em] uppercase text-white/50 transition-all duration-300 hover:border-white hover:text-white"
          >
            Lihat Semua
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product, index) => {
            const price = getStartingPrice(product);
            const hasVariants = (product.variants?.length ?? 0) > 1;

            return (
              <Link
                key={product._id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group flex min-w-0 flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F5F5F4]">
                  <SmartImage
                    src={product.thumbnail}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                  />
                </div>
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-display text-[0.57rem] tracking-[0.2em] uppercase text-white/35">
                      {product.category?.name ?? "Forland Living"}
                    </div>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-serif text-[0.95rem] leading-[1.25] text-white/90 transition-colors duration-300 group-hover:text-white">
                    {product.name}
                  </h3>
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-serif text-[0.82rem] text-white/65">
                        {hasVariants ? "Mulai " : ""}
                        {formatPrice(price)}
                      </span>
                      <span className="text-[0.7rem] text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-5">
          <div className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-white/25">
            Forland Living — Curated Selection
          </div>
          <div className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-white/25">
            01 — 05
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

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
  const [hero, ...rest] = categories;
  // semua kategori digabung untuk mobile scroll
  const allCategories = hero ? [hero, ...rest] : rest;

  return (
    <section className="py-20 lg:py-28">
      {/* ── Header — px penuh ── */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">{col?.label || "Koleksi"}</div>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              {col?.title || "Temukan ruang istirahat Anda."}
            </h2>
          </div>
          <Link
            to="/shop"
            search={{ q: undefined }}
            className="group inline-flex items-center gap-2 border-b hairline pb-2 text-[0.78rem] tracking-[0.24em] uppercase hover:border-foreground"
          >
            Semua Kategori
            <span className="transition-transform duration-300 group-hover:translate-x-1 font-display">→</span>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE  : horizontal scroll snap dengan peek
          DESKTOP : grid layout asli
      ══════════════════════════════════════════════ */}

      {/* ── MOBILE scroll ── (hidden lg+) */}
      <div className="lg:hidden">
        {/*
          overflow-x-auto + snap — scrollbar disembunyikan via CSS class
          pl-6 pr-0 → kartu pertama rata kiri, kartu terakhir memberi peek
        */}
        <div
          className="
            flex gap-3
            overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            pl-6
            pr-6
            pb-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {allCategories.map((category, i) => (
            <Link
              key={category._id}
              to="/shop"
              search={{ q: category.slug }}
              /*
                w-[78vw] → kartu utama ~78% lebar layar
                flex-shrink-0 → jangan menyusut
                snap-start → snap ke tepi kiri setiap kartu
                Efek peek: kartu berikutnya terlihat ~16% (100 - 78 - gap)
              */
              className="
                group
        relative
        flex-shrink-0
        w-[calc(100vw-3rem)]
        scroll-pl-6
        snap-start
        overflow-hidden
        bg-surface
              "
            >
              <div className="relative aspect-[3/4] w-full">
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-active:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                {/* nomor urut */}
                <div className="absolute right-4 top-4 font-display text-[0.6rem] tracking-[0.2em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-display text-[0.6rem] tracking-[0.22em] uppercase text-white/55">
                    {col?.label || "Koleksi"}
                  </div>
                  <h3 className="mt-1.5 font-serif text-2xl leading-tight text-white">
                    {category.name}
                  </h3>
                  {i === 0 && category.description && (
                    <p className="mt-2 text-[0.75rem] leading-relaxed text-white/65 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[0.65rem] tracking-[0.2em] uppercase text-white">
                    Lihat →
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* ghost item — beri ruang di akhir supaya kartu terakhir bisa snap ke kiri */}
          <div className="flex-shrink-0 w-6" aria-hidden />
        </div>

        {/* dot indicator */}
      </div>

      {/* ── DESKTOP grid ── (hidden on mobile) */}
      <div className="hidden lg:block mx-auto max-w-[1600px] px-12">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:grid-rows-2">
          {hero && (
            <Link
              to="/shop"
              search={{ q: hero.slug }}
              className="group relative overflow-hidden bg-surface lg:row-span-2"
            >
              <div className="relative aspect-auto h-full min-h-[520px]">
                <SmartImage
                  src={hero.image}
                  alt={hero.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <div className="text-[0.65rem] tracking-[0.28em] uppercase text-background/70">
                    {col?.label || "Koleksi"}
                  </div>
                  <h3 className="mt-2 font-serif text-3xl leading-tight text-background md:text-4xl">
                    {hero.name}
                  </h3>
                  <p className="mt-2 max-w-xs font-display text-[0.85rem] leading-relaxed text-background/70">
                    {hero.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 border-b border-background/50 pb-1 text-[0.72rem] tracking-[0.22em] uppercase text-background transition-all group-hover:border-background group-hover:gap-3 font-display">
                    Lihat Koleksi →
                  </div>
                </div>
              </div>
            </Link>
          )}

          {rest.slice(0, 2).map((category) => (
            <Link
              key={category._id}
              to="/shop"
              search={{ q: category.slug }}
              className="group relative overflow-hidden bg-surface"
            >
              <div className="relative aspect-auto h-full min-h-[248px]">
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-2xl leading-tight text-background">
                    {category.name}
                  </h3>
                  <div className="mt-1 text-[0.72rem] tracking-[0.2em] uppercase text-background/60 transition-all group-hover:text-background/90">
                    Lihat →
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {rest.length > 2 && (
            <div className="col-span-full grid gap-4 lg:grid-cols-4">
              {rest.slice(2).map((category) => (
                <Link
                  key={category._id}
                  to="/shop"
                  search={{ q: category.slug }}
                  className="group relative overflow-hidden bg-surface"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <SmartImage
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-serif text-xl leading-tight text-background">
                        {category.name}
                      </h3>
                      <div className="mt-1 text-[0.72rem] tracking-[0.2em] uppercase text-background/60 group-hover:text-background/90">
                        Lihat →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Strip ─────────────────────────────────────────────────────────────

function PromoStrip() {
  return (
    <section className="border-y hairline bg-foreground text-background">
      {/* PromoStrip sengaja lebih tipis — ini memang design-nya sebagai divider/accent strip */}
      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <span className="eyebrow !text-background/60">Penawaran Aktif</span>
            <div className="hidden h-4 w-px bg-background/20 md:block" />
            <p className="font-display text-xl md:text-2xl">
              Diskon FORLAND hemat sebesar 10% untuk seluruh produk - minimum pembelian 1 juta.
            </p>
          </div>
          <Link
            to="/shop"
            search={{ q: undefined }}
            className="group inline-flex shrink-0 items-center gap-3 border-b border-background/50 pb-1 text-[0.75rem] tracking-[0.24em] uppercase text-background/80 hover:border-background hover:text-background"
          >
            Belanja Sekarang
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Craftsmanship ────────────────────────────────────────────────────────────

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
    <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="order-2 lg:order-1">
          <div className="eyebrow">{c?.label || "Pengerjaan"}</div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
            {c?.title || "Dibuat perlahan, agar Anda dapat hidup perlahan."}
          </h2>
          <p className="mt-8 max-w-lg font-display text-[0.98rem] leading-[1.85] text-foreground/80">
            {c?.intro ||
              "Setiap karya Forland dimulai dari sebuah gambar dan diakhiri dengan tanda tangan. Di antara keduanya, berminggu-minggu pekerjaan yang terukur — tanpa jahitan yang terburu, tanpa material yang disembunyikan, tanpa jalan pintas."}
          </p>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.number} className="border-t hairline pt-6">
                <div className="eyebrow">{p.number}</div>
                <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
                <p className="mt-2 font-display text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative order-1 lg:order-2 aspect-[4/5] w-full overflow-hidden">
          <SmartImage
            src={c?.image ? `${c.image}?v=123456` : craftImg}
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

// ─── Reviews ─────────────────────────────────────────────────────────────────

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
      <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12 lg:py-28">
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
              <span aria-hidden className="font-display text-6xl leading-none text-foreground/15">"</span>
              <blockquote className="mt-2 font-display text-[1.35rem] leading-[1.4] md:text-[1.55rem]">
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

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter({ hp }: { hp: HomepageData | null }) {
  const n = hp?.newsletter;
  return (
    <section className="border-t hairline bg-foreground text-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center lg:py-28">
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
        <p className="mt-6 font-display text-xs text-background/50">
          {n?.disclaimer || "Tidak lebih dari sekali sebulan. Berhenti langganan kapan saja."}
        </p>
      </div>
    </section>
  );
}