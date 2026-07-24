import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * LEAN MIDDLEWARE — only refreshes the session cookie and protects routes
 * from completely unauthenticated users.
 *
 * WHY: Vercel Edge Middleware has a strict ~1-2 s timeout.
 * Making multiple Supabase DB queries (users, admin_users, vendor_profiles)
 * in middleware caused MIDDLEWARE_INVOCATION_TIMEOUT (504) errors.
 *
 * Role-based redirects (admin / vendor) now live in the respective
 * Server Component layouts where there is NO timeout limit.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build request headers including x-pathname so Server Component layouts
  // can know the current route without relying on Edge-only APIs.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Create a Supabase client that can read/write cookies on the Edge
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: requestHeaders } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: requestHeaders } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Single auth call — refreshes the session token in the cookie if needed.
  // No DB queries here; role checks are handled in layout.tsx files.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Unauthenticated user trying to access a protected area ──────────────
  const protectedPrefixes = ['/dashboard', '/profile'];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // /admin routes — require authenticated user session for admin area
  const adminPublicPaths = [
    '/admin/login',
    '/admin/debug',
    '/admin/setup',
    '/admin/forgot-password',
    '/admin/reset-password',
  ];
  const isAdminPublicPath = adminPublicPaths.some((p) => pathname.startsWith(p));
  if (pathname.startsWith('/admin') && !isAdminPublicPath && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // /vendor routes — block unauthenticated users, allow the rest through.
  // Role verification (vendor_profiles table) is done in app/vendor/layout.tsx.
  const vendorPublicPaths = ['/vendor/login', '/vendor/register'];
  const isVendorPublicPath = vendorPublicPaths.some((p) => pathname.startsWith(p));
  if (pathname.startsWith('/vendor') && !isVendorPublicPath && !user) {
    return NextResponse.redirect(new URL('/vendor/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - auth/callback (OAuth callback — must NOT be blocked)
     *   - image files (svg, png, jpg …)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
