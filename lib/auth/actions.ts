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
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  // Track user login for admin notifications
  try {
    await supabase.rpc('log_user_login');
  } catch (loginError) {
    console.error('Failed to log user login:', loginError);
    // Don't block login if tracking fails
  }

  revalidatePath('/', 'layout');

  if (userData?.role === 'vendor') {
    redirect('/vendor/dashboard');
  } else if (userData?.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/dashboard');
  }
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
