import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign, ShoppingCart, Users, Package, AlertTriangle, Clock, Plus, Download,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { AdminShell, StatCard, SectionCard, StatusBadge } from "@/components/admin/admin-shell";
import { adminOrders, adminProducts, revenueSeries, trafficSources, categoryPerformance, activityLog } from "@/lib/admin/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard · Forland Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

const PIE_COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"];

function Dashboard() {
  return (
    <AdminShell
      title="Dashboard"
      description="An overview of your store's performance today."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button size="sm" className="gap-1.5" asChild><Link to="/admin/products/new"><Plus className="h-3.5 w-3.5" />New product</Link></Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value="$1.09M" delta="+12.4%" trend="up" icon={DollarSign} />
        <StatCard label="Total Orders" value="4,318" delta="+8.1%" trend="up" icon={ShoppingCart} />
        <StatCard label="Total Customers" value="2,041" delta="+5.6%" trend="up" icon={Users} />
        <StatCard label="Total Products" value="126" delta="+3 new" trend="up" icon={Package} />
        <StatCard label="Pending Orders" value="12" delta="+2 today" trend="down" icon={Clock} />
        <StatCard label="Low Stock" value="7" delta="Needs restock" trend="down" icon={AlertTriangle} />
        <StatCard label="Avg Order Value" value="$254" delta="+1.9%" trend="up" />
        <StatCard label="Conversion Rate" value="3.42%" delta="+0.4pp" trend="up" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          title="Revenue overview"
          className="xl:col-span-2"
          action={
            <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium dark:bg-slate-800">
              {["7d", "30d", "12m", "All"].map((t, i) => (
                <button key={t} className={i === 2 ? "rounded-md bg-white px-2.5 py-1 shadow-sm dark:bg-slate-900" : "px-2.5 py-1 text-slate-500"}>{t}</button>
              ))}
            </div>
          }
        >
          <div className="h-[300px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Traffic sources">
          <div className="h-[300px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {trafficSources.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Orders trend">
          <div className="h-[240px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Sales by category">
          <div className="p-5 space-y-3">
            {categoryPerformance.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium">{c.name}</span>
                  <span className="tabular-nums text-slate-500">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-slate-900 dark:bg-white" style={{ width: `${c.value * 2}%`, maxWidth: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Recent orders"
          className="lg:col-span-2"
          action={<Link to="/admin/orders" className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400">View all →</Link>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-5 py-2.5 font-medium">Order</th>
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Total</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-medium">{o.id}</td>
                    <td className="px-5 py-3">
                      <div className="text-[13px]">{o.customer}</div>
                      <div className="text-[11px] text-slate-500">{o.email}</div>
                    </td>
                    <td className="px-5 py-3 tabular-nums">${o.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={o.payment === "Paid" ? "success" : o.payment === "Pending" ? "warning" : "danger"}>{o.payment}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Best sellers">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {adminProducts.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-slate-800">{i + 1}</div>
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.category} · {(Math.random() * 200 + 40).toFixed(0)} sold</div>
                </div>
                <div className="text-[13px] font-semibold tabular-nums">${p.price.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Recent activity">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {activityLog.map((a) => (
              <li key={a.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-900 dark:bg-white" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px]"><span className="font-medium">{a.actor}</span> <span className="text-slate-500">{a.action}</span> <span className="font-medium">{a.target}</span></div>
                  <div className="text-[11px] text-slate-500">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Low stock alerts">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {adminProducts.filter((p) => p.stock <= 8).slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{p.name}</div>
                  <div className="text-[11px] text-slate-500">SKU {p.sku}</div>
                </div>
                <StatusBadge tone={p.stock === 0 ? "danger" : "warning"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</StatusBadge>
                <Link to="/admin/products" className="text-slate-400 hover:text-slate-900"><ArrowUpRight className="h-4 w-4" /></Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
