import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];
  const adminRoutes = ['/admin'];
  const vendorRoutes = ['/vendor'];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const isVendorRoute = vendorRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to sign in if accessing protected route without authentication
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Check user role for admin routes — skip login/setup/debug pages
  const adminPublicPaths = ['/admin/login', '/admin/debug', '/admin/setup'];
  const isAdminPublicPath = adminPublicPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (isAdminRoute && !isAdminPublicPath) {
    console.log('🛡️ Middleware: checking admin route access for path:', request.nextUrl.pathname);
    console.log('👤 Middleware: User:', user ? user.email : 'No user');

    if (!user) {
      console.log('❌ Middleware: No authenticated user, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Check admin_users table (not users.role)
    const { data: adminUser, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    console.log('🔍 Middleware: adminUser result:', adminUser, 'Error:', adminErr);

    if (!adminUser) {
      console.log('❌ Middleware: Not an active admin user, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    console.log('✅ Middleware: Admin check passed');
  }

  // Check user role for vendor routes — skip login page
  const vendorPublicPaths = ['/vendor/login', '/vendor/register'];
  const isVendorPublicPath = vendorPublicPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (isVendorRoute && !isVendorPublicPath) {
    if (!user) {
      return NextResponse.redirect(new URL('/vendor/login', request.url));
    }
    console.log('🏪 Middleware: checking vendor route access for path:', request.nextUrl.pathname);
    
    // First check if user has vendor role in users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    console.log('👤 Middleware: User role:', userData?.role);
    
    // If user has vendor role, allow access (skip vendor_profiles check for now)
    if (userData?.role === 'vendor') {
      console.log('✅ Middleware: User has vendor role, allowing access');
      return response;
    }
    
    // Otherwise check vendor_profiles table
    const { data: vendorData, error: vendorErr } = await supabase
      .from('vendor_profiles')
      .select('id, is_active')
      .eq('user_id', user.id)
      .single();

    console.log('🔍 Middleware: vendorData result:', vendorData, 'Error:', vendorErr);

    if (!vendorData) {
      console.log('❌ Middleware: No active vendor profile, redirecting to vendor login');
      return NextResponse.redirect(new URL('/vendor/login', request.url));
    }

    console.log('✅ Middleware: Vendor check passed');
  }

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
