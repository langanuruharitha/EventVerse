import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      businessName,
      ownerName,
      contactPhone,
      city,
      state,
      country,
      primaryCategory,
    } = body;

    // Validate required fields
    if (!email || !password || !businessName || !contactPhone || !primaryCategory) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Create auth user with vendor role
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: ownerName || businessName,
          role: 'vendor',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Update users table role to vendor
    await supabase
      .from('users')
      .update({ role: 'vendor' })
      .eq('id', authData.user.id);

    // Create vendor profile in vendors table
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        user_id: authData.user.id,
        business_name: businessName,
        business_email: email,
        business_phone: contactPhone,
        city: city || null,
        state: state || null,
        country: country || 'India',
        primary_category: primaryCategory,
        services_offered: [primaryCategory],
        verification_status: 'pending',
        is_active: true,
        is_verified: false,
      })
      .select()
      .single();

    if (vendorError) {
      console.error('Vendor profile creation error:', vendorError);
      return NextResponse.json({
        message: 'Account created. Profile setup incomplete — please contact support.',
        warning: vendorError.message,
        userId: authData.user.id,
      });
    }

    return NextResponse.json({
      message: 'Vendor registered successfully',
      vendor,
    });
  } catch (error: any) {
    console.error('Vendor registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
