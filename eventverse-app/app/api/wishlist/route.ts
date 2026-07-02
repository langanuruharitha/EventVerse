import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, items: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const { productId, notes } = await request.json();
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        notes
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, item: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
