// API Route: Content Moderation
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { moderationService } from '@/lib/admin/moderation-service';

// GET: Fetch moderation queue
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filters = {
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      contentType: searchParams.get('contentType') || undefined,
      assignedTo: adminUser.id
    };

    const items = await moderationService.getModerationQueue(filters);

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Moderation fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch moderation queue' },
      { status: 500 }
    );
  }
}

// POST: Review content
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { itemId, decision, notes, actionTaken } = body;

    if (!itemId || !decision) {
      return NextResponse.json(
        { error: 'Item ID and decision are required' },
        { status: 400 }
      );
    }

    const success = await moderationService.reviewContent({
      itemId,
      reviewerId: adminUser.id,
      decision,
      notes: notes || '',
      actionTaken: actionTaken || 'none'
    });

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Content review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to review content' },
      { status: 500 }
    );
  }
}
