import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import heroImg from "@/assets/auth-hero.jpg";
import { api } from "@/lib/api";

export const Route = createFileRoute("/reset-password/$token")({
  head: () => ({
    meta: [{ title: "Reset Kata Sandi — Forland Living" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const password = String(fd.get("password"));
    const confirmPassword = String(fd.get("confirmPassword"));

    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak sama", {
        description: "Pastikan kedua kolom memiliki isi yang sama.",
      });
      return;
    }

    setLoading(true);

    try {
      await api(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({
          password,
        }),
      });

      setSuccess(true);

      setTimeout(() => {
        navigate({
          to: "/auth",
        });
      }, 2000);
    } catch (err) {
      toast.error("Reset gagal", {
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
          <div className="font-serif text-xl tracking-[0.32em]">FORLAND</div>

          <div>
            <div className="eyebrow !text-background/70">
              Security
            </div>

            <h2 className="mt-6 font-serif text-5xl leading-tight">
              Buat kata sandi baru.
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-background/75">
              Gunakan kata sandi yang kuat agar akun Anda tetap aman.
            </p>
          </div>

          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-background/60">
            Est. 2014 — Oslo · Jakarta
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 pt-24 pb-16 sm:px-10 lg:pt-32">
        <div className="w-full max-w-md">

          {!success ? (
            <>
              <div className="eyebrow">Reset Kata Sandi</div>

              <h1 className="mt-4 font-serif text-5xl">
                Atur kata sandi baru.
              </h1>

              <p className="mt-4 text-foreground/70">
                Masukkan kata sandi baru untuk akun Forland Living Anda.
              </p>

              <form
                onSubmit={onSubmit}
                className="mt-10 space-y-8"
              >

                <Field label="Kata Sandi Baru">
                  <input
                    className="input"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                  />
                </Field>

                <Field label="Konfirmasi Kata Sandi">
                  <input
                    className="input"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                  />
                </Field>

                <button
                  disabled={loading}
                  className="w-full bg-foreground py-4 text-background tracking-[0.22em] uppercase"
                >
                  {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
                </button>

              </form>
            </>
          ) : (
            <>
              <div className="eyebrow">Berhasil</div>

              <h1 className="mt-4 font-serif text-5xl">
                Kata sandi diperbarui.
              </h1>

              <p className="mt-4 text-foreground/70">
                Anda akan diarahkan ke halaman masuk dalam beberapa detik.
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