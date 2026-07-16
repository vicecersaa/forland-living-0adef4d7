export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: "Published" | "Draft" | "Archived";
  visibility: "Public" | "Hidden";
  image: string;
  createdAt: string;
  updatedAt: string;
};

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=400&q=60`;

export const adminProducts: AdminProduct[] = [
  { id: "P-1001", name: "Aera Platform Bed — Queen", sku: "FL-AERA-Q-LIN", category: "Beds", brand: "Forland", price: 3480, salePrice: 2980, stock: 24, status: "Published", visibility: "Public", image: img("1505693416388-ac5ce068fe85"), createdAt: "2026-04-12", updatedAt: "2026-07-02" },
  { id: "P-1002", name: "Sori Oak Bed — King", sku: "FL-SORI-K-OAK", category: "Beds", brand: "Forland", price: 3980, stock: 12, status: "Published", visibility: "Public", image: img("1560448204-e02f11c3d0e2"), createdAt: "2026-03-04", updatedAt: "2026-06-28" },
  { id: "P-1003", name: "Cirrus Signature Mattress — Queen", sku: "FL-CIRR-Q-STD", category: "Mattresses", brand: "Forland", price: 2650, stock: 48, status: "Published", visibility: "Public", image: img("1522771739844-6a9f6d5f14af"), createdAt: "2026-02-19", updatedAt: "2026-07-08" },
  { id: "P-1004", name: "Stonewashed Linen Set — Queen", sku: "FL-LINEN-Q-IVR", category: "Bedding", brand: "Forland", price: 460, stock: 3, status: "Published", visibility: "Public", image: img("1587220512492-1c4dc27f3f81"), createdAt: "2026-05-22", updatedAt: "2026-07-10" },
  { id: "P-1005", name: "Kaya Walnut Nightstand", sku: "FL-KAYA-NS-WAL", category: "Storage", brand: "Forland", price: 890, stock: 0, status: "Published", visibility: "Public", image: img("1493663284031-b7e3aefcae8e"), createdAt: "2026-01-15", updatedAt: "2026-06-01" },
  { id: "P-1006", name: "Muro Cashmere Throw", sku: "FL-MURO-TH-CSH", category: "Bedding", brand: "Forland", price: 320, stock: 62, status: "Draft", visibility: "Hidden", image: img("1600585154340-be6161a56a0c"), createdAt: "2026-06-01", updatedAt: "2026-07-11" },
  { id: "P-1007", name: "Loom Handwoven Rug 8x10", sku: "FL-LOOM-R-810", category: "Rugs", brand: "Forland", price: 1240, salePrice: 990, stock: 8, status: "Published", visibility: "Public", image: img("1540932239986-30128078f3c5"), createdAt: "2026-04-30", updatedAt: "2026-07-09" },
  { id: "P-1008", name: "Nara Bedside Lamp", sku: "FL-NARA-LP-BRS", category: "Lighting", brand: "Forland", price: 210, stock: 34, status: "Published", visibility: "Public", image: img("1519710164239-da123dc03ef4"), createdAt: "2026-05-14", updatedAt: "2026-07-05" },
  { id: "P-1009", name: "Aera Headboard — Standalone", sku: "FL-AERA-HB-LIN", category: "Beds", brand: "Forland", price: 1480, stock: 15, status: "Published", visibility: "Public", image: img("1505691938895-1758d7feb511"), createdAt: "2026-03-18", updatedAt: "2026-06-20" },
  { id: "P-1010", name: "Fjord Pillow Set", sku: "FL-FJRD-PL-2PK", category: "Bedding", brand: "Forland", price: 180, stock: 120, status: "Published", visibility: "Public", image: img("1584100936595-c0654b55a2e2"), createdAt: "2026-02-10", updatedAt: "2026-07-01" },
  { id: "P-1011", name: "Hana Solid Oak Bench", sku: "FL-HANA-BN-OAK", category: "Storage", brand: "Forland", price: 620, stock: 5, status: "Published", visibility: "Public", image: img("1567016432779-094069958ea5"), createdAt: "2026-06-12", updatedAt: "2026-07-14" },
  { id: "P-1012", name: "Cirrus Latex Topper", sku: "FL-CIRR-TP-LTX", category: "Mattresses", brand: "Forland", price: 780, stock: 22, status: "Archived", visibility: "Hidden", image: img("1540518614846-7eded433c457"), createdAt: "2025-12-01", updatedAt: "2026-05-10" },
];

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  payment: "Paid" | "Pending" | "Refunded" | "Failed";
  fulfillment: "Unfulfilled" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  channel: string;
  date: string;
};

export const adminOrders: AdminOrder[] = [
  { id: "#FL-24089", customer: "Amelia Kusuma", email: "amelia.k@mail.com", items: 2, total: 4210, payment: "Paid", fulfillment: "Shipped", channel: "Online", date: "2026-07-15" },
  { id: "#FL-24088", customer: "Rendra Nugraha", email: "rendra@studio.co", items: 1, total: 2650, payment: "Paid", fulfillment: "Processing", channel: "Online", date: "2026-07-15" },
  { id: "#FL-24087", customer: "Petra Wijaya", email: "petra.w@mail.com", items: 3, total: 5980, payment: "Pending", fulfillment: "Unfulfilled", channel: "Showroom", date: "2026-07-14" },
  { id: "#FL-24086", customer: "Sasha Tanuwijaya", email: "sasha.t@mail.com", items: 1, total: 460, payment: "Paid", fulfillment: "Delivered", channel: "Online", date: "2026-07-14" },
  { id: "#FL-24085", customer: "Karin Halim", email: "karin.h@mail.com", items: 4, total: 3120, payment: "Refunded", fulfillment: "Cancelled", channel: "Online", date: "2026-07-13" },
  { id: "#FL-24084", customer: "Julian Wirawan", email: "julian@design.id", items: 1, total: 3480, payment: "Paid", fulfillment: "Shipped", channel: "Online", date: "2026-07-13" },
  { id: "#FL-24083", customer: "Naomi Setiawan", email: "naomi.s@mail.com", items: 2, total: 890, payment: "Paid", fulfillment: "Delivered", channel: "Online", date: "2026-07-12" },
  { id: "#FL-24082", customer: "Ivan Pramono", email: "ivan.p@mail.com", items: 1, total: 1240, payment: "Failed", fulfillment: "Unfulfilled", channel: "Online", date: "2026-07-12" },
];

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  ltv: number;
  tier: "New" | "Silver" | "Gold" | "Platinum";
  lastActive: string;
};

export const adminCustomers: AdminCustomer[] = [
  { id: "C-1401", name: "Amelia Kusuma", email: "amelia.k@mail.com", phone: "+62 812 3311 2245", location: "Jakarta, ID", orders: 12, ltv: 18420, tier: "Platinum", lastActive: "2h ago" },
  { id: "C-1402", name: "Rendra Nugraha", email: "rendra@studio.co", phone: "+62 813 5522 8891", location: "Bandung, ID", orders: 7, ltv: 9240, tier: "Gold", lastActive: "5h ago" },
  { id: "C-1403", name: "Petra Wijaya", email: "petra.w@mail.com", phone: "+62 811 8802 5510", location: "Surabaya, ID", orders: 4, ltv: 5980, tier: "Silver", lastActive: "1d ago" },
  { id: "C-1404", name: "Sasha Tanuwijaya", email: "sasha.t@mail.com", phone: "+62 815 6690 1122", location: "Bali, ID", orders: 3, ltv: 3120, tier: "Silver", lastActive: "1d ago" },
  { id: "C-1405", name: "Karin Halim", email: "karin.h@mail.com", phone: "+62 812 7745 3341", location: "Medan, ID", orders: 2, ltv: 2110, tier: "New", lastActive: "3d ago" },
  { id: "C-1406", name: "Julian Wirawan", email: "julian@design.id", phone: "+62 811 2231 8890", location: "Jakarta, ID", orders: 9, ltv: 12480, tier: "Gold", lastActive: "6h ago" },
  { id: "C-1407", name: "Naomi Setiawan", email: "naomi.s@mail.com", phone: "+62 812 9910 4471", location: "Yogyakarta, ID", orders: 5, ltv: 4890, tier: "Silver", lastActive: "2d ago" },
  { id: "C-1408", name: "Ivan Pramono", email: "ivan.p@mail.com", phone: "+62 813 4420 8721", location: "Semarang, ID", orders: 1, ltv: 1240, tier: "New", lastActive: "4d ago" },
];

export const revenueSeries = [
  { month: "Jan", revenue: 48200, orders: 210, customers: 96 },
  { month: "Feb", revenue: 52100, orders: 232, customers: 108 },
  { month: "Mar", revenue: 61400, orders: 278, customers: 124 },
  { month: "Apr", revenue: 58900, orders: 264, customers: 118 },
  { month: "May", revenue: 71200, orders: 312, customers: 141 },
  { month: "Jun", revenue: 79800, orders: 348, customers: 156 },
  { month: "Jul", revenue: 88400, orders: 381, customers: 172 },
  { month: "Aug", revenue: 82100, orders: 359, customers: 164 },
  { month: "Sep", revenue: 94300, orders: 402, customers: 188 },
  { month: "Oct", revenue: 101200, orders: 431, customers: 201 },
  { month: "Nov", revenue: 118900, orders: 498, customers: 226 },
  { month: "Dec", revenue: 134500, orders: 552, customers: 248 },
];

export const trafficSources = [
  { name: "Direct", value: 38 },
  { name: "Organic Search", value: 27 },
  { name: "Instagram", value: 18 },
  { name: "Email", value: 11 },
  { name: "Referral", value: 6 },
];

export const categoryPerformance = [
  { name: "Beds", value: 42 },
  { name: "Mattresses", value: 28 },
  { name: "Bedding", value: 14 },
  { name: "Storage", value: 9 },
  { name: "Lighting", value: 4 },
  { name: "Rugs", value: 3 },
];

export const adminCategories = [
  { id: "CAT-01", name: "Beds", parent: "—", products: 24, slug: "beds", updated: "2026-07-10" },
  { id: "CAT-02", name: "Mattresses", parent: "—", products: 12, slug: "mattresses", updated: "2026-07-09" },
  { id: "CAT-03", name: "Bedding", parent: "—", products: 38, slug: "bedding", updated: "2026-07-11" },
  { id: "CAT-04", name: "— Sheets", parent: "Bedding", products: 14, slug: "bedding/sheets", updated: "2026-07-11" },
  { id: "CAT-05", name: "— Duvet Covers", parent: "Bedding", products: 9, slug: "bedding/duvets", updated: "2026-07-08" },
  { id: "CAT-06", name: "Storage", parent: "—", products: 11, slug: "storage", updated: "2026-07-05" },
  { id: "CAT-07", name: "Lighting", parent: "—", products: 7, slug: "lighting", updated: "2026-07-04" },
  { id: "CAT-08", name: "Rugs", parent: "—", products: 5, slug: "rugs", updated: "2026-07-02" },
];

export const adminBrands = [
  { id: "BR-01", name: "Forland House", products: 89, country: "Indonesia" },
  { id: "BR-02", name: "Aera Atelier", products: 12, country: "Denmark" },
  { id: "BR-03", name: "Cirrus Sleep Lab", products: 8, country: "Japan" },
  { id: "BR-04", name: "Muro Textiles", products: 21, country: "Portugal" },
];

export const adminReviews = [
  { id: "R-3301", product: "Aera Platform Bed", customer: "Amelia K.", rating: 5, title: "A quiet, grounding presence.", status: "Published", date: "2026-07-14" },
  { id: "R-3302", product: "Cirrus Mattress", customer: "Rendra N.", rating: 5, title: "Best sleep in years.", status: "Published", date: "2026-07-12" },
  { id: "R-3303", product: "Stonewashed Linen Set", customer: "Petra W.", rating: 4, title: "Softens beautifully.", status: "Pending", date: "2026-07-11" },
  { id: "R-3304", product: "Sori Oak Bed", customer: "Julian W.", rating: 5, title: "Craftsmanship you can feel.", status: "Published", date: "2026-07-09" },
  { id: "R-3305", product: "Loom Rug 8x10", customer: "Karin H.", rating: 3, title: "Colour slightly off screen.", status: "Pending", date: "2026-07-08" },
];

export const adminCoupons = [
  { id: "CPN-01", code: "QUIET15", type: "Percentage", value: "15%", used: 128, limit: 500, expires: "2026-08-31", status: "Active" },
  { id: "CPN-02", code: "FIRSTNIGHT", type: "Fixed", value: "$100", used: 42, limit: 200, expires: "2026-09-30", status: "Active" },
  { id: "CPN-03", code: "FREESHIP", type: "Free Shipping", value: "—", used: 311, limit: 1000, expires: "2026-12-31", status: "Active" },
  { id: "CPN-04", code: "SUMMER26", type: "Percentage", value: "20%", used: 512, limit: 500, expires: "2026-07-10", status: "Expired" },
];

export const activityLog = [
  { id: 1, actor: "Amelia (Admin)", action: "updated stock", target: "Cirrus Mattress — Queen", time: "12 min ago" },
  { id: 2, actor: "System", action: "auto-archived", target: "Cirrus Latex Topper", time: "1 hr ago" },
  { id: 3, actor: "Rendra (Product Mgr)", action: "published", target: "Kaya Walnut Nightstand", time: "3 hr ago" },
  { id: 4, actor: "Warehouse Bot", action: "received shipment", target: "PO-2205 · 48 units", time: "5 hr ago" },
  { id: 5, actor: "Julian (Finance)", action: "issued refund", target: "Order #FL-24085 · $3,120", time: "Yesterday" },
  { id: 6, actor: "Naomi (Support)", action: "replied to review", target: "R-3303 · Petra W.", time: "Yesterday" },
];

export const adminUsers = [
  { id: "U-01", name: "Amelia Kusuma", email: "amelia@forland.co", role: "Super Admin", status: "Active", lastLogin: "2 min ago" },
  { id: "U-02", name: "Rendra Nugraha", email: "rendra@forland.co", role: "Product Manager", status: "Active", lastLogin: "1 hr ago" },
  { id: "U-03", name: "Julian Wirawan", email: "julian@forland.co", role: "Finance Manager", status: "Active", lastLogin: "3 hr ago" },
  { id: "U-04", name: "Naomi Setiawan", email: "naomi@forland.co", role: "Customer Support", status: "Active", lastLogin: "Yesterday" },
  { id: "U-05", name: "Ivan Pramono", email: "ivan@forland.co", role: "Warehouse Staff", status: "Invited", lastLogin: "—" },
];
