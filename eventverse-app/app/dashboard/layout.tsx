// Server Component — auth check + role-based redirect for /dashboard routes.
// Vendors and admins landing here get sent to their own portals.
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Check if the user has a non-customer role and redirect accordingly
  const { data: roleData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleData?.role === 'vendor') {
    redirect('/vendor/dashboard');
  }
  if (roleData?.role === 'admin') {
    redirect('/admin/dashboard');
  }

  return <AppShell>{children}</AppShell>;
}
