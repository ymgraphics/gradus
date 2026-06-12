import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./i18n-config";

const LEGACY_PREFIXES = [
  '/portfolio',
  '/wp-content',
  '/wp-admin',
  '/wp-includes',
  '/wp-json',
  '/category',
  '/tag',
  '/author',
  '/feed',
  '/comments',
];

const LEGACY_EXACT = ['/xmlrpc.php', '/wp-login.php'];

// Old WordPress blog post slugs at root level — 410 directly instead of 301 → 404
const LEGACY_WP_SLUGS = [
  '/brand-design-that-helps-the-company-grow',
  '/drawing-identity-elements-on-branded-media',
  '/brands-belonging-to-a-specific-thematic-group',
  '/stages-of-developing-a-corporate-identity',
  '/stages-of-developing-a-corporate-identity-and-logo',
  '/portfolio/light-lilac-waves',
  '/portfolio/corporate-colors-2',
  '/portfolio/tree-with-leaves',
  '/portfolio/broken-mirror-shards',
  '/portfolio/creative-design',
  '/portfolio/corporate-identity',
  '/portfolio/corporate-font',
];

const GONE_HTML = `<!DOCTYPE html><html><head><title>410 Gone</title><meta name="robots" content="noindex"></head><body><h1>410 — Gone</h1><p>This page no longer exists. <a href="https://www.gradus.ma/">Return home</a>.</p></body></html>`;

// Routes that are ALWAYS exempt from the coming-soon and i18n redirect
const EXEMPT_PREFIXES = [
  "/admin",
  "/api",
  "/_next",
  "/assets",
  "/fonts",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
];

function isExempt(pathname: string): boolean {
  return EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

function isValidAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  if (acceptLanguage.includes("fr")) return "fr";
  if (acceptLanguage.includes("en")) return "en";
  return i18n.defaultLocale;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── 1. Legacy WordPress 410 Gone ─────────────────────────────────────────
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  if (
    LEGACY_EXACT.includes(pathname) ||
    LEGACY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/')) ||
    LEGACY_WP_SLUGS.some((slug) => cleanPath === slug || pathname.startsWith(slug + '/'))
  ) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  // Old WordPress query-string permalinks like /?p=123
  if (pathname === '/' && req.nextUrl.searchParams.has('p')) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  // ─── 3. Admin Auth Guard ──────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (pathname.startsWith("/api/admin/auth")) return NextResponse.next();

    const token = req.cookies.get("__session")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isValidAdminToken(token)) {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("__session");
      return response;
    }

    return NextResponse.next();
  }

  // ─── 4. Exemptions ────────────────────────────────────────────────────────
  if (isExempt(pathname)) return NextResponse.next();

  // ─── 5. i18n Locale Negotiation ───────────────────────────────────────────
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let currentLocale = "";
  if (!pathnameHasLocale) {
    currentLocale = getLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${currentLocale}${pathname}`;
    // Use 301 Permanent Redirect for SEO (moves old indexed pages to their new localized versions)
    return NextResponse.redirect(url, { status: 301 });
  } else {
    currentLocale = pathname.split('/')[1];
  }

  // ─── 6. Coming Soon Guard ─────────────────────────────────────────────────
  const isComingSoonPath = pathname.endsWith('/coming-soon');
  
  if (!isComingSoonPath) {
    const sessionToken = req.cookies.get("__session")?.value;
    if (sessionToken && isValidAdminToken(sessionToken)) {
      return NextResponse.next();
    }

    const csModeRaw = req.cookies.get("__cs_mode")?.value;

    if (csModeRaw === "1") {
      const url = new URL(`/${currentLocale}/coming-soon`, req.url);
      return NextResponse.redirect(url);
    }

    if (csModeRaw === "0") {
      return NextResponse.next();
    }

    try {
      const apiUrl = new URL("/api/site-mode", req.url);
      const res = await fetch(apiUrl.toString(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.coming_soon === true) {
          const redirect = NextResponse.redirect(new URL(`/${currentLocale}/coming-soon`, req.url));
          redirect.cookies.set("__cs_mode", "1", { maxAge: 60, path: "/" });
          return redirect;
        } else {
          const next = NextResponse.next();
          next.cookies.set("__cs_mode", "0", { maxAge: 60, path: "/" });
          return next;
        }
      }
    } catch {
      // If API call fails, pass through gracefully
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)",
  ],
};
