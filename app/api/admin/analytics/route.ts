// API Route: Admin Analytics
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { analyticsService } from '@/lib/admin/analytics-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type') || 'overview';

    let data;
    switch (reportType) {
      case 'overview':
        data = await analyticsService.getPlatformOverview();
        break;
      case 'users':
        data = await analyticsService.getUserMetrics();
        break;
      case 'revenue':
        data = await analyticsService.getRevenueAnalytics();
        break;
      default:
        data = await analyticsService.getPlatformOverview();
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
