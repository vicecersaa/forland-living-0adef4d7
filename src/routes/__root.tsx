import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "../components/site-nav";
import { SiteFooter } from "../components/site-footer";
import { CartProvider } from "../lib/cart";
import { AuthProvider } from "../lib/auth";
import { WhatsAppFab } from "../components/whatsapp-fab";
import { Toaster } from "sonner";
import { PromoCard } from "../components/promo-card";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Forland Living — Kasur & Bed Premium Quiet Luxury" },
      {
        name: "description",
        content:
          "Forland Living menghadirkan kasur dan bed premium bergaya quiet luxury. Desain abadi, material jujur, dan pengerjaan seksama untuk tidur yang lebih tenang.",
      },
      { name: "author", content: "Forland Living" },
      { property: "og:title", content: "Forland Living — Kasur & Bed Premium Quiet Luxury" },
      {
        property: "og:description",
        content:
          "Kasur dan bed premium karya Forland Living. Kenyamanan tenang, material jujur, garansi struktural 25 tahun.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Forland Living — Kasur & Bed Premium Quiet Luxury" },
      { name: "twitter:description", content: "Kasur dan bed premium karya Forland Living. Kenyamanan tenang, material jujur, garansi struktural 25 tahun." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b86e948f-83d6-4ddb-84d5-4e070128a8fc/id-preview-e49736b0--685301c9-5984-42af-9591-bc4364e2daa0.lovable.app-1784022455715.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b86e948f-83d6-4ddb-84d5-4e070128a8fc/id-preview-e49736b0--685301c9-5984-42af-9591-bc4364e2daa0.lovable.app-1784022455715.png" },
    ],
    links: [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap",
  },
  {
    rel: "stylesheet",
    href: appCss,
  },
  { rel: "icon", href: "/favicon.jpeg", type: "image/x-icon" },
],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const authRoutes = [
  "/auth",
  "/forgot-password",
  "/reset-password",
];

const isAuth = authRoutes.some((route) =>
  pathname.startsWith(route),
);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {isAdmin ? (
            <Outlet />
          ) : isAuth ? (
            <Outlet />
          ) : (
            <div className="flex min-h-screen flex-col overflow-x-hidden">
              <SiteNav />
              <main className="flex-1">
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
              </main>
              <SiteFooter />
              <WhatsAppFab />
            </div>
          )}
          {!isAdmin && !isAuth && pathname === "/" && <PromoCard />}
          <Toaster
            position="top-right"
            richColors={false}
            closeButton={false}
            expand={false}
            visibleToasts={1}
            toastOptions={{
              duration: 3000,
              classNames: {
                toast: "forland-toast",
                title: "forland-toast-title",
                description: "forland-toast-description",
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
