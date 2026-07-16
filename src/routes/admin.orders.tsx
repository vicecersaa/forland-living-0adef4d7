import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Download, MoreHorizontal, FileText, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, StatusBadge, SectionCard, StatCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { adminOrders } from "@/lib/admin/mock-data";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders · Forland Admin" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const [q, setQ] = useState("");
  const [fulfillment, setFulfillment] = useState("all");
  const rows = useMemo(() => adminOrders.filter((o) => {
    if (q && !`${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (fulfillment !== "all" && o.fulfillment !== fulfillment) return false;
    return true;
  }), [q, fulfillment]);

  return (
    <AdminShell
      title="Orders"
      description="Track, fulfill, and reconcile customer orders."
      breadcrumbs={[{ label: "Orders" }]}
      actions={<Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Exported")}><Download className="h-3.5 w-3.5" />Export</Button>}
    >
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Unfulfilled" value="12" delta="4 urgent" trend="down" />
        <StatCard label="Processing" value="28" delta="+3" trend="up" />
        <StatCard label="Shipped this week" value="94" delta="+12%" trend="up" />
        <StatCard label="Refund requests" value="3" delta="Needs review" trend="down" />
      </div>

      <SectionCard>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders, customers…" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <Select value={fulfillment} onValueChange={setFulfillment}>
            <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fulfillment</SelectItem>
              {["Unfulfilled", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Order", "Date", "Customer", "Items", "Payment", "Fulfillment", "Total", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3 text-slate-500">{o.date}</td>
                  <td className="px-4 py-3"><div className="text-[13px]">{o.customer}</div><div className="text-[11px] text-slate-500">{o.email}</div></td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{o.items}</td>
                  <td className="px-4 py-3"><StatusBadge tone={o.payment === "Paid" ? "success" : o.payment === "Pending" ? "warning" : o.payment === "Refunded" ? "info" : "danger"}>{o.payment}</StatusBadge></td>
                  <td className="px-4 py-3"><StatusBadge tone={o.fulfillment === "Delivered" ? "success" : o.fulfillment === "Shipped" ? "info" : o.fulfillment === "Processing" ? "warning" : o.fulfillment === "Cancelled" ? "danger" : "neutral"}>{o.fulfillment}</StatusBadge></td>
                  <td className="px-4 py-3 font-semibold tabular-nums">${o.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><FileText className="mr-2 h-3.5 w-3.5" />Print invoice</DropdownMenuItem>
                        <DropdownMenuItem><Truck className="mr-2 h-3.5 w-3.5" />Print shipping label</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Order marked shipped")}>Mark shipped</DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600" onClick={() => toast("Refund initiated")}><RotateCcw className="mr-2 h-3.5 w-3.5" />Refund</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AdminShell>
  );
}
