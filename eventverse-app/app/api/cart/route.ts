import { NextRequest, NextResponse } from 'next/server';
import { addToCart, getCart, getCartItemCount } from '@/lib/commerce/cart-service';

export async function GET() {
  try {
    const [cartResult, countResult] = await Promise.all([getCart(), getCartItemCount()]);

    if (!cartResult.success && cartResult.error === 'Not authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: cartResult.success,
      cart: cartResult.data,
      count: countResult.count ?? 0,
      error: cartResult.error,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const result = await addToCart({ productId, quantity: Number(quantity) || 1 });

    if (!result.success) {
      const status = result.error === 'Not authenticated' ? 401 : 400;
      return NextResponse.json({ success: false, error: result.error }, { status });
    }

    const countResult = await getCartItemCount();
    return NextResponse.json({ success: true, count: countResult.count ?? 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
