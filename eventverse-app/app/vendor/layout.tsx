// Server Component — performs vendor role check without Edge timeout risk.
// The sidebar UI is in VendorLayoutClient.tsx.
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import VendorLayoutClient from './VendorLayoutClient';

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read current path from headers to detect public pages
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';

  const vendorPublicPaths = ['/vendor/login', '/vendor/register'];
  const isPublicPath = vendorPublicPaths.some((p) => pathname.startsWith(p));

  // Render login / register without sidebar
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Role check — server-side, no timeout limit
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/vendor/login');
  }

  // Check vendor role in users table first (fast path)
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role === 'vendor') {
    // User has vendor role — allow through
    return <VendorLayoutClient user={{ email: user.email, user_metadata: user.user_metadata }}>{children}</VendorLayoutClient>;
  }

  // Fallback: check vendor_profiles table
  const { data: vendorData } = await supabase
    .from('vendor_profiles')
    .select('id, is_active')
    .eq('user_id', user.id)
    .single();

  if (!vendorData) {
    redirect('/vendor/login');
  }

  return <VendorLayoutClient user={{ email: user.email, user_metadata: user.user_metadata }}>{children}</VendorLayoutClient>;
}
