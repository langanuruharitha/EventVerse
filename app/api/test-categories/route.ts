import { NextResponse } from 'next/server';
import { createBrowserClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createBrowserClient();

    // Check categories
    const { data: categories, count, error } = await supabase
      .from('product_categories')
      .select('*', { count: 'exact' });

    return NextResponse.json({
      totalCategories: count,
      categories,
      error
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
