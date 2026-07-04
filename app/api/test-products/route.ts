import { NextResponse } from 'next/server';
import { createBrowserClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createBrowserClient();

    // Test 1: Count all products
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Test 2: Get sample products
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('name, event_types, status')
      .limit(10);

    // Test 3: Count birthday products using cs filter
    const { data: birthdayProducts, error: birthdayError } = await supabase
      .from('products')
      .select('name, event_types')
      .eq('status', 'active')
      .filter('event_types', 'cs', '{birthday}')
      .limit(5);

    // Test 4: Count wedding products
    const { data: weddingProducts, error: weddingError } = await supabase
      .from('products')
      .select('name, event_types')
      .eq('status', 'active')
      .filter('event_types', 'cs', '{wedding}')
      .limit(5);

    return NextResponse.json({
      totalProducts: totalCount,
      sampleProducts,
      birthdayTest: {
        count: birthdayProducts?.length || 0,
        products: birthdayProducts,
        error: birthdayError
      },
      weddingTest: {
        count: weddingProducts?.length || 0,
        products: weddingProducts,
        error: weddingError
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
