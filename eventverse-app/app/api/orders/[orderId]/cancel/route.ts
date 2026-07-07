import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Get order + items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return NextResponse.json({ success: false, error: 'This order cannot be cancelled anymore.' }, { status: 400 });
    }

    // Cancel the order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Restore stock
    for (const item of order.items || []) {
      const { data: prod } = await supabase
        .from('products')
        .select('stock_quantity, sales_count')
        .eq('id', item.product_id)
        .single();

      if (prod) {
        await supabase
          .from('products')
          .update({
            stock_quantity: (prod.stock_quantity || 0) + item.quantity,
            sales_count: Math.max(0, (prod.sales_count || 0) - item.quantity),
          })
          .eq('id', item.product_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to cancel order' }, { status: 500 });
  }
}
