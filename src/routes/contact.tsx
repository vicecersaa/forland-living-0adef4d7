import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Hubungi Kami — Forland Living" },
      { name: "description", content: "Hubungi atelier kami. Buat janji kunjungan showroom, tanya soal waktu pengerjaan, atau minta sampel material." },
      { property: "og:title", content: "Hubungi Kami — Forland Living" },
      { property: "og:description", content: "Hubungi atelier kami. Buat janji kunjungan showroom atau minta sampel material." },
    ],
  }),
  component: ContactPage,
});

const WA_NUMBER = "6285174271344"; 

function ContactPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const nama = (form.elements.namedItem("nama") as HTMLInputElement).value.trim();
    const pesan = (form.elements.namedItem("pesan") as HTMLTextAreaElement).value.trim();

    const teks = `Halo Forland Living! 👋\n\nNama saya *${nama}*.\n\n${pesan}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(teks)}`;

    window.open(url, "_blank");
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-12 lg:pt-56">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div>
          <div className="eyebrow">Korespondensi</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">Kirim pesan kepada kami.</h1>
          <p className="mt-8 max-w-md text-foreground/70">
            Setiap pesan kami balas secara personal, biasanya dalam satu hari kerja. Kunjungan
            showroom hanya dengan perjanjian.
          </p>

          <div className="mt-12 space-y-10 text-sm">
           
            <div>
              <div className="eyebrow mb-3">Kontak Langsung</div>
              <a href="mailto:forland.living@gmail.com" className="font-serif text-xl hover:opacity-80">
                forland.living@gmail.com
              </a>
              <div className="mt-1 text-muted-foreground">+62 851-7427-1344</div>
            </div>
            <div>
              <div className="eyebrow mb-3">Pengiriman & Perawatan</div>
              <div className="text-muted-foreground">
                Pengiriman white-glove ke seluruh Indonesia. Waktu pengerjaan 6 — 8 minggu. Setiap
                karya dilengkapi garansi struktural 25 tahun.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8">
         <Field label="Nama Anda">
  <input
    name="nama"
    required
    placeholder="Nama lengkap Anda"
    className="w-full border border-foreground/20 bg-transparent px-4 py-3 placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none transition-colors"
  />
</Field>
<Field label="Pesan">
  <textarea
    name="pesan"
    rows={6}
    required
    placeholder="Tuliskan pesan Anda di sini..."
    className="w-full border border-foreground/20 bg-transparent px-4 py-3 placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none resize-none transition-colors"
  />
</Field>
          <button
            type="submit"
            className="mt-4 self-start bg-foreground px-10 py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90"
          >
            Kirim Pesan →
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow mb-3 block">{label}</span>
      {children}
    </label>
  );
}