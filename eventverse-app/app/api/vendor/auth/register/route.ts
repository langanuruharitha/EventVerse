import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      businessName,
      contactPhone,
      city,
      state,
      country,
    } = body;

    // Validate required fields
    if (!email || !password || !businessName || !contactPhone || !city || !state || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
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

    // Create vendor profile
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        user_id: authData.user.id,
        business_name: businessName,
        contact_phone: contactPhone,
        contact_email: email,
        city,
        state,
        country,
        verification_status: 'pending',
        is_active: false,
      })
      .select()
      .single();

    if (vendorError) {
      // Rollback: Delete auth user if vendor creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: vendorError.message }, { status: 500 });
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
