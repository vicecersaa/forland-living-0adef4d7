import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import heroImg from "@/assets/auth-hero.jpg";
import { api } from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Lupa Kata Sandi — Forland Living" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    setLoading(true);

    try {
      await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: fd.get("email"),
        }),
      });

      setSent(true);
    } catch (err) {
      toast.error("Permintaan gagal", {
        description:
          err instanceof Error ? err.message : "Silakan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[100svh] grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <img
          src={heroImg}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-background">
          <div className="font-serif text-xl tracking-[0.32em]">
            FORLAND
          </div>

          <div>
            <div className="eyebrow !text-background/70">
              Account Recovery
            </div>

            <h2 className="mt-6 font-serif text-5xl leading-tight">
              Privasi Anda tetap kami jaga.
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-background/75">
              Kami akan mengirimkan tautan untuk membuat kata sandi baru melalui
              email yang terdaftar.
            </p>
          </div>

          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-background/60">
            Est. 2014 — Oslo · Jakarta
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 pt-24 pb-16 sm:px-10 lg:pt-32">
        <div className="w-full max-w-md">

          {!sent ? (
            <>
              <div className="eyebrow">Lupa Kata Sandi</div>

              <h1 className="mt-4 font-serif text-5xl">
                Atur ulang akses Anda.
              </h1>

              <p className="mt-4 text-foreground/70">
                Masukkan email yang terdaftar dan kami akan mengirimkan tautan
                untuk membuat kata sandi baru.
              </p>

              <form onSubmit={onSubmit} className="mt-10 space-y-8">

                <Field label="Email">
                  <input
                    className="input"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </Field>

                <button
                  disabled={loading}
                  className="w-full bg-foreground py-4 text-background tracking-[0.22em] uppercase"
                >
                  {loading
                    ? "Mengirim..."
                    : "Kirim Tautan Reset"}
                </button>

              </form>
            </>
          ) : (
            <>
              <div className="eyebrow">Email Terkirim</div>

              <h1 className="mt-4 font-serif text-5xl">
                Periksa inbox Anda.
              </h1>

              <p className="mt-4 text-foreground/70">
                Jika email terdaftar, kami telah mengirimkan tautan untuk
                mengatur ulang kata sandi Anda.
              </p>
            </>
          )}

          <Link
            to="/auth"
            className="mt-10 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            ← Kembali ke Masuk
          </Link>

        </div>
      </div>

      <style>{`
      .input{
        width:100%;
        border:0;
        border-bottom:1px solid hsl(var(--border));
        background:transparent;
        padding:12px 0;
        outline:none;
      }
      .input:focus{
        border-color:hsl(var(--foreground));
      }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
    </label>
  );
}