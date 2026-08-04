import { createFileRoute } from "@tanstack/react-router";
import philosophyImg from "@/assets/philosophy.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import materialImg from "@/assets/material-linen.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Forland Living" },
      { name: "description", content: "Studio kecil di Bogor yang membuat kasur dan bed premium untuk cara hidup yang lebih tenang." },
      { property: "og:title", content: "Tentang Kami — Forland Living" },
      { property: "og:description", content: "Studio kecil di Bogor yang membuat kasur dan bed premium untuk cara hidup yang lebih tenang." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-14 text-center lg:pt-56">
        <div className="eyebrow">Est. 2014 — Bogor, Indonesia</div>
        <h1 className="mt-8 font-serif text-5xl leading-[1.05] md:text-7xl">
          Rumah kecil yang membuat istirahat menjadi serius.
        </h1>
        <p className="mx-auto mt-10 max-w-2xl text-[1rem] leading-[1.85] text-foreground/80">
          Forland Living lahir dari satu keyakinan — bahwa benda-benda di sekitar tidur berhak
          mendapat perhatian yang sama besarnya dengan benda-benda yang mengisi jam kerja kita.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-12">
        <img src={philosophyImg} alt="" loading="lazy" className="aspect-[21/9] w-full object-cover" />
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-16 md:grid-cols-2 md:gap-24">
        <div>
          <div className="eyebrow">Cara Kami Bekerja</div>
          <h2 className="mt-6 font-serif text-4xl leading-tight">Perlahan, dengan niat.</h2>
        </div>
        <div className="space-y-6 text-[0.98rem] leading-[1.85] text-foreground/80">
          <p>
            Kami bekerja di sebuah studio kecil di Bogor. Setiap rangka ditandatangani, setiap
            kasur dijahit tangan, dan setiap pesanan dijadwalkan dengan penuh kehati-hatian.
          </p>
          <p>
            Koleksi kami sengaja dibuat terbatas. Kami lebih memilih kembali ke rancangan yang
            sama selama bertahun-tahun daripada merilis produk yang tidak bisa kami pertanggungjawabkan
            dua puluh tahun ke depan.
          </p>
          <p>
            Tim kami terdiri dari dua belas orang. Dua di antaranya adalah pendiri. Semua dari
            mereka menyentuh setiap bed yang keluar dari bengkel kami.
          </p>
        </div>
      </section>

      <section className="border-y hairline bg-surface">
        <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2">
          <img src={craftImg} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover lg:aspect-auto" />
          <div className="flex items-center px-6 py-14 lg:px-16">
            <div className="max-w-md">
              <div className="eyebrow">Material</div>
              <h2 className="mt-6 font-serif text-4xl leading-tight">Lima yang kami percaya.</h2>
              <ul className="mt-10 space-y-6 text-sm">
                {[
                  ["Linen Flax Belgia", "Dari satu pabrik keluarga di West Flanders yang telah beroperasi enam generasi."],
                  ["Oak Eropa Kering Oven", "Bersertifikat FSC, dikeringkan udara selama enam bulan."],
                  ["Latex Talalay Alami", "Getah pohon karet, dituang langsung dari Sri Lanka."],
                  ["Wol Murni", "Tahan api secara alami, tanpa bahan kimia tambahan."],
                  ["Pocket Spring", "Disusun secara individual, disetel untuk lima zona tubuh."],
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
          "Kemewahan, bagi kami, adalah ketiadaan kebisingan — di dalam ruangan, di dalam benda,
          dan di tangan yang membuatnya."
        </blockquote>
        <div className="mt-8 text-[0.72rem] tracking-[0.24em] uppercase text-muted-foreground">
          Pendiri Forland Living — Bogor, Indonesia
        </div>
      </section>
    </>
  );
}