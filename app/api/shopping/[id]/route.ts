import { NextRequest, NextResponse } from 'next/server';
import { updateShoppingItemStatus } from '@/lib/events/actions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_purchased } = body;

    const result = await updateShoppingItemStatus(id, is_purchased);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update shopping item' },
      { status: 500 }
    );
  }
}
