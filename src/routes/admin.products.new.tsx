import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Save, ArrowLeft, ImagePlus, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, SectionCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "New product · Forland Admin" }, { name: "robots", content: "noindex" }] }),
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([{ name: "Queen", sku: "FL-NEW-Q", price: "3480", stock: "10" }]);
  const [tags, setTags] = useState<string[]>(["Bedroom", "Handcrafted"]);
  const [tagInput, setTagInput] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product saved as draft");
    setTimeout(() => navigate({ to: "/admin/products" }), 400);
  };

  return (
    <AdminShell
      title="New product"
      description="Create a new product listing for your catalog."
      breadcrumbs={[{ label: "Products", to: "/admin/products" }, { label: "New" }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild><Link to="/admin/products"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" />Discard</Link></Button>
          <Button size="sm" variant="outline" onClick={() => toast("Saved as draft")}>Save draft</Button>
          <Button size="sm" className="gap-1.5" onClick={save}><Save className="h-3.5 w-3.5" />Publish</Button>
        </>
      }
    >
      <form onSubmit={save} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Basic information">
            <div className="space-y-4 p-5">
              <div><Label>Product name</Label><Input className="mt-1.5" placeholder="e.g. Aera Platform Bed" defaultValue="Aera Platform Bed" /></div>
              <div><Label>Slug</Label><Input className="mt-1.5 font-mono text-sm" defaultValue="aera-platform-bed" /></div>
              <div><Label>Short description</Label><Input className="mt-1.5" placeholder="One-liner shown on listing cards" /></div>
              <div>
                <Label>Full description</Label>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    {["B", "I", "U", "H1", "H2", "Quote", "•", "Link"].map((t) => (
                      <button key={t} type="button" className="rounded px-2 py-1 hover:bg-white dark:hover:bg-slate-800">{t}</button>
                    ))}
                  </div>
                  <Textarea rows={6} className="border-0 focus-visible:ring-0" placeholder="Tell the story of this product…" />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Media">
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-[11px] text-slate-500 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                  <ImagePlus className="h-5 w-5" />
                  Drop or click<input type="file" className="hidden" multiple />
                </label>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                    <img src={`https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=60&sig=${i}`} className="h-full w-full object-cover" alt="" />
                    <button type="button" className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-rose-600"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Pricing">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
              <div><Label>Regular price ($)</Label><Input type="number" className="mt-1.5" defaultValue="3480" /></div>
              <div><Label>Sale price ($)</Label><Input type="number" className="mt-1.5" placeholder="—" /></div>
              <div><Label>Cost price ($)</Label><Input type="number" className="mt-1.5" defaultValue="1820" /></div>
              <div className="sm:col-span-3 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                Est. margin <span className="font-semibold">47.7%</span> · Profit per unit <span className="font-semibold">$1,660</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Inventory">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div><Label>SKU</Label><Input className="mt-1.5 font-mono text-sm" defaultValue="FL-AERA-Q-LIN" /></div>
              <div><Label>Barcode (ISBN, UPC, GTIN)</Label><Input className="mt-1.5 font-mono text-sm" placeholder="—" /></div>
              <div><Label>Stock quantity</Label><Input type="number" className="mt-1.5" defaultValue="24" /></div>
              <div><Label>Low stock threshold</Label><Input type="number" className="mt-1.5" defaultValue="5" /></div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"><span className="text-sm">Allow backorders</span><Switch /></div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"><span className="text-sm">Track inventory</span><Switch defaultChecked /></div>
            </div>
          </SectionCard>

          <SectionCard title="Variants">
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
                <div className="flex-1">Name</div><div className="w-32">SKU</div><div className="w-24">Price</div><div className="w-20">Stock</div><div className="w-8" />
              </div>
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input className="flex-1" defaultValue={v.name} />
                    <Input className="w-32 font-mono text-sm" defaultValue={v.sku} />
                    <Input className="w-24" defaultValue={v.price} />
                    <Input className="w-20" defaultValue={v.stock} />
                    <button type="button" onClick={() => setVariants(variants.filter((_, x) => x !== i))} className="grid h-9 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => setVariants([...variants, { name: "", sku: "", price: "", stock: "0" }])}><Plus className="h-3.5 w-3.5" />Add variant</Button>
            </div>
          </SectionCard>

          <SectionCard title="Search engine optimisation">
            <div className="space-y-4 p-5">
              <div><Label>SEO title</Label><Input className="mt-1.5" defaultValue="Aera Platform Bed — Forland Living" /></div>
              <div><Label>Meta description</Label><Textarea rows={2} className="mt-1.5" defaultValue="A quietly luxurious Belgian linen platform bed, hand-tailored on a solid oak frame." /></div>
              <div><Label>URL preview</Label><div className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[12px] text-slate-500 dark:bg-slate-800/60">forland.co/products/aera-platform-bed</div></div>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Publishing">
            <div className="space-y-4 p-5">
              <Tabs defaultValue="published">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>
                <TabsContent value="scheduled" className="mt-3"><Input type="datetime-local" /></TabsContent>
              </Tabs>
              <div className="space-y-2.5">
                {[
                  { l: "Featured product" },
                  { l: "Best seller", on: true },
                  { l: "New arrival", on: true },
                  { l: "Hidden from storefront" },
                ].map((r) => (
                  <div key={r.l} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"><span className="text-sm">{r.l}</span><Switch defaultChecked={r.on} /></div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Organisation">
            <div className="space-y-4 p-5">
              <div>
                <Label>Category</Label>
                <Select defaultValue="Beds"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Beds", "Mattresses", "Bedding", "Storage", "Lighting", "Rugs"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Brand</Label><Input className="mt-1.5" defaultValue="Forland House" /></div>
              <div>
                <Label>Tags</Label>
                <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[12px] dark:bg-slate-800">
                      {t}<button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-2.5 w-2.5" /></button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); setTags([...tags, tagInput.trim()]); setTagInput(""); } }}
                    placeholder="Add tag…"
                    className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Shipping">
            <div className="grid grid-cols-2 gap-3 p-5">
              <div><Label className="text-[11px]">Weight (kg)</Label><Input className="mt-1.5" defaultValue="62" /></div>
              <div><Label className="text-[11px]">Width</Label><Input className="mt-1.5" defaultValue="160" /></div>
              <div><Label className="text-[11px]">Length</Label><Input className="mt-1.5" defaultValue="210" /></div>
              <div><Label className="text-[11px]">Height</Label><Input className="mt-1.5" defaultValue="34" /></div>
            </div>
          </SectionCard>
        </aside>
      </form>
    </AdminShell>
  );
}
