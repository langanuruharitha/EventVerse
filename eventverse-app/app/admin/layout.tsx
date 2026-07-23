// Server Component — performs role check without any Edge timeout limit.
// The actual UI (sidebar, navigation) is in AdminLayoutClient.tsx.
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Determine the current path from headers so we can skip auth on public pages
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';

  const adminPublicPaths = [
    '/admin/login',
    '/admin/debug',
    '/admin/setup',
    '/admin/forgot-password',
    '/admin/reset-password',
  ];
  const isPublicPath = adminPublicPaths.some((p) => pathname.startsWith(p));

  // On public paths (login etc.) just render the page without a sidebar
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Role check — runs server-side with no timeout risk
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Verify active admin record
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!adminUser) {
    redirect('/admin/login');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
