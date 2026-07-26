import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import heroImg from "@/assets/auth-hero.jpg";

type Search = { redirect?: string; mode?: "login" | "register" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    mode: s.mode === "register" ? "register" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Masuk Akun — Forland Living" },
      { name: "description", content: "Masuk ke akun Forland Living untuk melacak pesanan kasur & bed premium, menyimpan wishlist, dan menikmati layanan white-glove." },
      { property: "og:title", content: "Masuk Akun — Forland Living" },
      { property: "og:description", content: "Masuk atau daftar akun Forland Living untuk pengalaman belanja yang lebih personal." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, redirect } = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"login" | "register">(mode ?? "login");
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: (redirect as "/") ?? "/", replace: true });
  }, [user, redirect, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      if (tab === "login") {
        await login(String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
        toast.success("Selamat datang kembali.", { description: "Anda berhasil masuk ke Forland." });
      } else {
        await register(String(fd.get("name") ?? ""), String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
        toast.success("Akun berhasil dibuat.", { description: "Selamat bergabung di rumah Forland." });
      }
    } catch (err) {
      toast.error("Tidak dapat melanjutkan", {
        description: err instanceof Error ? err.message : "Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[100svh] grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <img src={heroImg} alt="Kamar tidur tenang Forland Living" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-background">
          <div className="font-serif text-xl tracking-[0.32em]">FORLAND</div>
          <div className="max-w-md fade-up">
            <div className="eyebrow !text-background/70">Rumah yang Tenang</div>
            <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-5xl">
              Tidur adalah disiplin. Kami membuat perlengkapannya dengan tenang.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-background/75">
              Masuk untuk melacak pesanan, menyimpan kamar impian, dan menerima surat berkala dari atelier kami di Oslo.
            </p>
          </div>
          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-background/60">Est. 2014 — Oslo · Jakarta</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 pt-24 pb-16 sm:px-10 lg:pt-32">
        <div className="w-full max-w-md">
          <div className="eyebrow">{tab === "login" ? "Masuk" : "Daftar"}</div>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">
            {tab === "login" ? "Selamat kembali." : "Bergabung dengan Forland."}
          </h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground/70">
            {tab === "login"
              ? "Masukkan email Anda untuk melanjutkan ke pesanan dan preferensi kamar."
              : "Buat akun untuk melacak pesanan kasur, menyimpan wishlist, dan menerima layanan white-glove."}
          </p>

          <div className="mt-8 inline-flex border hairline text-[0.72rem] tracking-[0.24em] uppercase">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={
                  "px-5 py-2.5 transition-colors " +
                  (tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")
                }
              >
                {t === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            {tab === "register" && (
              <Field label="Nama Lengkap">
                <input name="name" required autoComplete="name" className="input" placeholder="Sebutkan nama Anda" />
              </Field>
            )}
            <Field label="Email">
              <input name="email" type="email" required autoComplete="email" className="input" placeholder="nama@email.com" />
            </Field>
            <Field label="Kata Sandi">
              <input name="password" type="password" required minLength={6} autoComplete={tab === "login" ? "current-password" : "new-password"} className="input" placeholder="Minimal 6 karakter" />
            </Field>

            {tab === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="accent-foreground" /> Ingat saya
                </label>
                <a href="#" className="tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground">Lupa sandi?</a>
              </div>
            )}

            <button
              disabled={loading}
              className="mt-4 w-full bg-foreground py-4 text-[0.78rem] tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Memproses…" : tab === "login" ? "Masuk ke Akun" : "Buat Akun"}
            </button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link to="/contact" className="underline underline-offset-4 hover:text-foreground">Ketentuan</Link>{" "}
            dan{" "}
            <Link to="/contact" className="underline underline-offset-4 hover:text-foreground">Kebijakan Privasi</Link>{" "}
            Forland Living.
          </p>
        </div>
      </div>

      <style>{`.input{width:100%;background:transparent;border:0;border-bottom:1px solid hsl(var(--border,0 0% 88%));padding:12px 0;outline:none;font-size:0.95rem;transition:border-color .3s ease;} .input:focus{border-color:hsl(var(--foreground));}`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
    </label>
  );
}