import { NextRequest, NextResponse } from 'next/server';
import { updateTaskStatus } from '@/lib/events/actions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const result = await updateTaskStatus(id, status);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
