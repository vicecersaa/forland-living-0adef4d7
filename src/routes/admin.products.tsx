import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus, Download, Upload, Search, Filter, ArrowUpDown, MoreHorizontal,
  Copy, Trash2, Archive, Edit3, EyeOff, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell, StatusBadge, SectionCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminProducts } from "@/lib/admin/mock-data";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products · Forland Admin" }, { name: "robots", content: "noindex" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return adminProducts.filter((p) => {
      if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (status !== "all" && p.status !== status) return false;
      return true;
    });
  }, [q, cat, status]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allChecked = paged.length > 0 && paged.every((p) => selected.includes(p.id));
  const toggleAll = () => setSelected(allChecked ? selected.filter((s) => !paged.some((p) => p.id === s)) : [...new Set([...selected, ...paged.map((p) => p.id)])]);
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  const categories = [...new Set(adminProducts.map((p) => p.category))];

  return (
    <AdminShell
      title="Products"
      description={`${filtered.length} products · ${adminProducts.filter((p) => p.stock === 0).length} out of stock`}
      breadcrumbs={[{ label: "Products" }]}
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export queued")}><Download className="h-3.5 w-3.5" />Export</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Import CSV opened")}><Upload className="h-3.5 w-3.5" />Import</Button>
          <Button size="sm" className="gap-1.5" asChild><Link to="/admin/products/new"><Plus className="h-3.5 w-3.5" />New product</Link></Button>
        </>
      }
    >
      <SectionCard>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by name or SKU…"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[150px] text-sm"><Filter className="mr-1.5 h-3.5 w-3.5" /><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[140px] text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            {selected.length > 0 ? (
              <>
                <span className="text-xs text-slate-500">{selected.length} selected</span>
                <Button size="sm" variant="outline" onClick={() => toast.success("Bulk published")}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Bulk archived")}>Archive</Button>
                <Button size="sm" variant="outline" className="text-rose-600" onClick={() => { setSelected([]); toast.success("Deleted"); }}>Delete</Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" className="gap-1.5 text-slate-600"><ArrowUpDown className="h-3.5 w-3.5" />Sort</Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="w-10 px-4 py-3"><Checkbox checked={allChecked} onCheckedChange={toggleAll} /></th>
                <th className="px-2 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3"><Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} /></td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-500">{p.sku}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {p.salePrice ? (
                      <div>
                        <span className="font-medium">${p.salePrice.toLocaleString()}</span>
                        <span className="ml-1.5 text-[11px] text-slate-400 line-through">${p.price.toLocaleString()}</span>
                      </div>
                    ) : <span>${p.price.toLocaleString()}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-rose-600" : p.stock <= 8 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={p.status === "Published" ? "success" : p.status === "Draft" ? "neutral" : "warning"}>
                      {p.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500">{p.updatedAt}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><MoreHorizontal className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem><Edit3 className="mr-2 h-3.5 w-3.5" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Duplicated")}><Copy className="mr-2 h-3.5 w-3.5" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Unpublished")}><EyeOff className="mr-2 h-3.5 w-3.5" />Unpublish</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Archived")}><Archive className="mr-2 h-3.5 w-3.5" />Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600" onClick={() => toast.success("Deleted")}><Trash2 className="mr-2 h-3.5 w-3.5" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-800"><Search className="h-5 w-5 text-slate-500" /></div>
                    <div className="mt-3 text-sm font-medium">No products match your filters</div>
                    <div className="mt-1 text-xs text-slate-500">Try clearing the search or adjusting filters.</div>
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => { setQ(""); setCat("all"); setStatus("all"); }}>Reset filters</Button>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
          <div>Showing <span className="font-medium text-slate-700 dark:text-slate-300">{paged.length}</span> of {filtered.length}</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <span className="px-2">Page {page} of {Math.max(1, Math.ceil(filtered.length / perPage))}</span>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(filtered.length / perPage)}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </SectionCard>
    </AdminShell>
  );
}
