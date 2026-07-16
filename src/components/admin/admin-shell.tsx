import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, FolderTree, Tag, Boxes, ShoppingCart, Users,
  Star, Ticket, LineChart, Wallet, Truck, Megaphone, FileBarChart, Image as ImageIcon,
  Shield, ActivitySquare, Plug, Settings, LogOut, Search, Bell, Command,
  Plus, ChevronRight, Sun, Moon, PanelLeft, X,
} from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "Overview", items: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/analytics", label: "Analytics", icon: LineChart },
    { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  ]},
  { group: "Catalog", items: [
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/brands", label: "Brands", icon: Tag },
    { to: "/admin/inventory", label: "Inventory", icon: Boxes },
    { to: "/admin/media", label: "Media Library", icon: ImageIcon },
  ]},
  { group: "Commerce", items: [
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "12" },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
    { to: "/admin/coupons", label: "Coupons", icon: Ticket },
    { to: "/admin/finance", label: "Finance", icon: Wallet },
    { to: "/admin/shipping", label: "Shipping", icon: Truck },
    { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
  ]},
  { group: "System", items: [
    { to: "/admin/admins", label: "Admin Management", icon: Shield },
    { to: "/admin/activity", label: "Activity Logs", icon: ActivitySquare },
    { to: "/admin/integrations", label: "Integrations", icon: Plug },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ]},
] as const;

export function AdminShell({ title, description, breadcrumbs, actions, children }: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="admin-scope min-h-screen bg-[hsl(220_20%_98%)] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <style>{`.admin-scope,.admin-scope *{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;letter-spacing:-0.01em}`}</style>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/70 bg-white transition-[width,transform] duration-300 dark:border-slate-800 dark:bg-slate-900",
          collapsed ? "lg:w-[72px]" : "lg:w-[248px]",
          mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/70 px-4 dark:border-slate-800">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <span className="text-[13px] font-semibold tracking-tight">FL</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Forland Admin</div>
              <div className="truncate text-[11px] text-slate-500">forland.co · Live</div>
            </div>
          )}
          <button
            className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              {!collapsed && (
                <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {g.group}
                </div>
              )}
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active =
                    (item as any).end
                      ? pathname === item.to
                      : pathname === item.to || pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to + item.label}
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                        collapsed && "justify-center",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && (item as any).badge && (
                        <span className={cn(
                          "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          active ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                        )}>
                          {(item as any).badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200/70 p-3 dark:border-slate-800">
          <button className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            collapsed && "justify-center",
          )}>
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile scrim */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]")}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <button
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <button
              className="hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-500 hover:border-slate-300 sm:flex sm:max-w-md dark:border-slate-800 dark:bg-slate-800/60"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search products, orders, customers…</span>
              <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-flex dark:border-slate-700 dark:bg-slate-900">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setDark((v) => !v)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    { t: "New order #FL-24089 · $4,210", s: "2 min ago" },
                    { t: "Low stock: Stonewashed Linen Set (3 left)", s: "12 min ago" },
                    { t: "New review · 5★ on Cirrus Mattress", s: "1 hr ago" },
                    { t: "Refund requested · Order #FL-24085", s: "3 hr ago" },
                  ].map((n, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5">
                      <span className="text-sm">{n.t}</span>
                      <span className="text-[11px] text-slate-500">{n.s}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 flex items-center gap-2 rounded-full pr-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-900 text-[11px] text-white dark:bg-white dark:text-slate-900">AK</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <div className="text-xs font-medium">Amelia K.</div>
                      <div className="text-[10px] text-slate-500">Super Admin</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page header */}
        <div className="border-b border-slate-200/70 bg-white/40 px-4 py-5 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-[1400px]">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-2 flex items-center gap-1 text-[12px] text-slate-500">
                <Link to="/admin" className="hover:text-slate-900 dark:hover:text-slate-200">Admin</Link>
                {breadcrumbs.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {b.to ? (
                      <Link to={b.to} className="hover:text-slate-900 dark:hover:text-slate-200">{b.label}</Link>
                    ) : (
                      <span className="text-slate-700 dark:text-slate-300">{b.label}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>

      {/* Command palette */}
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <PaletteItem to="/admin/products/new" onSelect={() => setPaletteOpen(false)} icon={<Plus className="h-4 w-4" />} label="Add new product" />
            <PaletteItem to="/admin/orders" onSelect={() => setPaletteOpen(false)} icon={<ShoppingCart className="h-4 w-4" />} label="View unfulfilled orders" />
            <PaletteItem to="/admin/coupons" onSelect={() => setPaletteOpen(false)} icon={<Ticket className="h-4 w-4" />} label="Create discount" />
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            {NAV.flatMap((g) => g.items).map((i) => (
              <PaletteItem key={i.to + i.label} to={i.to} onSelect={() => setPaletteOpen(false)} icon={<i.icon className="h-4 w-4" />} label={i.label} />
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function PaletteItem({ to, label, icon, onSelect }: { to: string; label: string; icon: ReactNode; onSelect: () => void }) {
  return (
    <CommandItem
      onSelect={() => {
        onSelect();
        setTimeout(() => { window.location.href = to; }, 0);
      }}
      className="gap-2"
    >
      {icon}
      <span>{label}</span>
    </CommandItem>
  );
}

export function StatCard({ label, value, delta, trend, icon: Icon }: {
  label: string; value: string; delta?: string; trend?: "up" | "down" | "flat"; icon?: any;
}) {
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500";
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-slate-500">{label}</span>
        {Icon && (
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 text-[26px] font-semibold tracking-tight tabular-nums">{value}</div>
      {delta && (
        <div className={cn("mt-1 text-[12px] font-medium", trendColor)}>
          {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}
          {delta} <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
    warning: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    danger: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30",
    info: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", styles)}>{children}</span>;
}

export function SectionCard({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold">{title}</h3>
          {action}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export { Button, Badge };
