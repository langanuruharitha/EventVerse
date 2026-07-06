'use server';

import { createServerClient } from '@/lib/supabase/server';
import { SignUpData, SignInData } from '@/types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signUp(data: SignUpData) {
  const supabase = await createServerClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        role: data.role || 'customer',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Update user profile with full name if provided
  if (authData.user && data.full_name) {
    await supabase
      .from('user_profiles')
      .update({ full_name: data.full_name })
      .eq('user_id', authData.user.id);
  }

  // Note: Notification is now handled client-side in signup page
  
  return { 
    success: true, 
    message: 'Account created successfully! You can now sign in.',
    user: authData.user 
  };
}

export async function signIn(data: SignInData) {
  const supabase = await createServerClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user role to determine redirect path
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', authData.user.id)
    .single();

  // Log for debugging
  console.log('SignIn Debug:', {
    userId: authData.user.id,
    email: data.email,
    userData,
    userError,
    role: userData?.role
  });

  // Get user profile for full name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('user_id', authData.user.id)
    .single();

  revalidatePath('/', 'layout');

  // Return user info so client can handle notification
  const redirectPath = 
    userData?.role === 'vendor' ? '/vendor/dashboard' :
    userData?.role === 'admin' ? '/admin/dashboard' : 
    '/dashboard';

  console.log('SignIn Redirect Path:', redirectPath, 'for role:', userData?.role);

  // Return data for client-side notification
  return {
    success: true,
    redirect: redirectPath,
    shouldNotify: userData?.role !== 'admin',
    userData: {
      email: userData?.email || data.email,
      fullName: profile?.full_name || 'Unknown User',
      role: userData?.role || 'customer',
    }
  };
}

export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Get user details from public.users table
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return {
    ...user,
    role: userData?.role,
    status: userData?.status,
    profile,
  };
}

export async function updateProfile(userId: string, profileData: any) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('user_id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function requestPasswordReset(email: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password reset email sent' };
}

export async function requestAdminPasswordReset(email: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password reset email sent' };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password updated successfully' };
}
