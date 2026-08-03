import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export const Route = createFileRoute("/warranty")({
  component: WarrantyPage,
});

type Warranty = {
  _id: string;
  phone: string;
  customerName: string;
  address: string;
  productName: string;
  variant: string;
  purchaseDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  status: "active" | "expired" | "claimed" | "void";
  notes: string;
};

type WarrantyResponse = {
  success: boolean;
  message: string;
  data: Warranty[];
};

function WarrantyPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate({
        to: "/auth",
        search: {
          redirect: "/warranty",
          mode: "login",
        },
      });
    }
  }, [ready, user, navigate]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setWarranty(null);

    try {
      const res = await api<WarrantyResponse>(
        `/warranty/search?phone=${encodeURIComponent(phone)}`
      );

      if (!res.data.length) {
        setError("Garansi tidak ditemukan");
        return;
      }

      setWarranty(res.data[0]);
    } catch (err: any) {
      setError(err.message || "Garansi tidak ditemukan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <div className="eyebrow">Garansi</div>

      <h1 className="mt-4 font-serif text-5xl">
        Cek Garansi Produk
      </h1>

      <p className="mt-6 text-muted-foreground">
        Masukkan nomor telepon yang digunakan saat pembelian.
      </p>

      <form onSubmit={handleSearch} className="mt-12 flex gap-4">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          className="flex-1 border-b hairline bg-transparent py-3 outline-none"
        />

        <button
          disabled={loading}
          className="bg-foreground px-8 text-background uppercase tracking-[0.2em]"
        >
          {loading ? "Mencari..." : "Cari"}
        </button>
      </form>

      {error && (
        <div className="mt-8 border border-red-300 bg-red-50 p-5 text-red-600">
          {error}
        </div>
      )}

      {warranty && (
  <section className="mt-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

    <div className="border-b border-neutral-200 bg-neutral-50 px-10 py-10">

      <div className="text-center">

        <div className="text-xs uppercase tracking-[0.35em] text-neutral-500">
          Warranty Certificate
        </div>

        <div
          className={`mx-auto mt-6 inline-flex rounded-full px-5 py-2 text-sm font-medium ${
            warranty.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : warranty.status === "expired"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {statusText(warranty.status)}
        </div>

        <h2 className="mt-8 font-serif text-4xl">
          {warranty.productName}
        </h2>

        <p className="mt-3 text-neutral-500">
          {warranty.variant}
        </p>

      </div>

    </div>

    <div className="grid gap-12 p-10 md:grid-cols-2">

      <div>

        <div className="mb-6 text-xs uppercase tracking-[0.25em] text-neutral-400">
          Customer
        </div>

        <Info
          title="Customer Name"
          value={warranty.customerName}
        />

        <Info
          title="Phone Number"
          value={warranty.phone}
        />

        <Info
          title="Address"
          value={warranty.address}
        />

      </div>

      <div>

        <div className="mb-6 text-xs uppercase tracking-[0.25em] text-neutral-400">
          Warranty
        </div>

        <Info
          title="Purchase Date"
          value={formatDate(warranty.purchaseDate)}
        />

        <Info
          title="Warranty Start"
          value={formatDate(warranty.warrantyStart)}
        />

        <Info
          title="Warranty Ends"
          value={formatDate(warranty.warrantyEnd)}
        />

      </div>

    </div>

    {warranty.notes && (
      <div className="border-t border-neutral-200 bg-neutral-50 px-10 py-8">

        <div className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          Coverage
        </div>

        <p className="mt-3 leading-7 text-neutral-700">
          {warranty.notes}
        </p>

      </div>
    )}

    <div className="border-t border-neutral-200 px-10 py-8">

      <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

        <div>

          <h3 className="font-serif text-2xl">
            Need Assistance?
          </h3>

          <p className="mt-2 text-neutral-500">
            Contact Forland Living Customer Care for warranty claims.
          </p>

        </div>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          className="rounded-full bg-black px-8 py-4 text-sm uppercase tracking-[0.25em] text-white transition hover:opacity-90"
        >
          WhatsApp
        </a>

      </div>

    </div>

  </section>
)}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b hairline py-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="mb-7">

      <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">
        {title}
      </div>

      <div className="mt-2 text-lg">
        {value || "-"}
      </div>

    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusText(status?: string) {
  switch (status) {
    case "active":
      return "Aktif";
    case "expired":
      return "Berakhir";
    case "claimed":
      return "Sudah Diklaim";
    case "void":
      return "Tidak Berlaku";
    default:
      return "-";
  }
}