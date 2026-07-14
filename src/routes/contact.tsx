import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Forland Living" },
      { name: "description", content: "Reach the atelier. Book a private showroom appointment, ask about lead times, or request a material sample." },
      { property: "og:title", content: "Contact — Forland Living" },
      { property: "og:description", content: "Reach the atelier. Book a showroom appointment or request a material sample." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-32 lg:px-12 lg:pt-56">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div>
          <div className="eyebrow">Correspondence</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">Write to the house.</h1>
          <p className="mt-8 max-w-md text-foreground/70">
            We answer every letter personally, usually within one business day. Showroom visits are
            by appointment.
          </p>

          <div className="mt-16 space-y-10 text-sm">
            <div>
              <div className="eyebrow mb-3">Atelier</div>
              <div className="font-serif text-xl">Rådhusgata 14, 0151 Oslo</div>
              <div className="mt-1 text-muted-foreground">By appointment · Tue — Sat</div>
            </div>
            <div>
              <div className="eyebrow mb-3">Direct</div>
              <a href="mailto:atelier@forland.living" className="font-serif text-xl hover:opacity-80">atelier@forland.living</a>
              <div className="mt-1 text-muted-foreground">+47 22 00 00 00</div>
            </div>
            <div>
              <div className="eyebrow mb-3">Care & Delivery</div>
              <div className="text-muted-foreground">
                White-glove delivery worldwide. Lead times of 6 — 8 weeks. Every piece carries a
                25-year structural guarantee.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="grid gap-8">
          <Field label="Your Name">
            <input required className="w-full border-b hairline bg-transparent py-3 focus:border-foreground focus:outline-none" />
          </Field>
          <Field label="Email">
            <input type="email" required className="w-full border-b hairline bg-transparent py-3 focus:border-foreground focus:outline-none" />
          </Field>
          <Field label="Interested In">
            <select className="w-full border-b hairline bg-transparent py-3 focus:border-foreground focus:outline-none">
              <option>A specific piece</option>
              <option>Material samples</option>
              <option>Showroom appointment</option>
              <option>Trade & interiors</option>
              <option>Something else</option>
            </select>
          </Field>
          <Field label="Message">
            <textarea rows={5} className="w-full border-b hairline bg-transparent py-3 focus:border-foreground focus:outline-none resize-none" />
          </Field>
          <button className="mt-4 self-start bg-foreground px-10 py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background hover:opacity-90">
            Send Letter →
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