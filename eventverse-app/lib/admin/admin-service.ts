// Admin Service - Business logic for admin operations
import { createServerClient } from '@/lib/supabase/server';
import type {
  AdminDashboardStats,
  PlatformStats,
  SupportTicket,
  PlatformTemplate,
  ContentReport,
  VendorPerformance,
  RevenueAnalytics,
  UserActivityMetrics,
} from '@/types/admin';
import type { Vendor } from '@/types/vendor';

export class AdminService {
  private async getSupabase() {
    return await createServerClient();
  }

  // ==================== Dashboard ====================

  // Get admin dashboard statistics
  async getDashboardStats(): Promise<AdminDashboardStats> {
    // Get latest platform stats
    const { data: latestStats } = await (await this.getSupabase()).from('platform_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    const today = latestStats?.[0] || {};
    const yesterday = latestStats?.[1] || {};

    // Calculate changes
    const usersChange = yesterday.total_users
      ? ((today.total_users - yesterday.total_users) / yesterday.total_users) * 100
      : 0;
    const vendorsChange = yesterday.total_vendors
      ? ((today.total_vendors - yesterday.total_vendors) / yesterday.total_vendors) * 100
      : 0;
    const eventsChange = yesterday.total_events
      ? ((today.total_events - yesterday.total_events) / yesterday.total_events) * 100
      : 0;
    const revenueChange = yesterday.total_revenue
      ? ((today.total_revenue - yesterday.total_revenue) / yesterday.total_revenue) * 100
      : 0;

    // Get pending actions
    const { count: pendingVendors } = await (await this.getSupabase()).from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'under_review');

    const { count: openTickets } = await (await this.getSupabase()).from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']);

    const { count: pendingReports } = await (await this.getSupabase()).from('content_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: pendingContent } = await (await this.getSupabase()).from('vendor_portfolio')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', false);

    // Get user growth data (last 30 days)
    const userGrowth = latestStats?.map((stat) => ({
      date: stat.date,
      count: stat.new_users_today,
    })) || [];

    // Get revenue chart data (last 12 months)
    const { data: monthlyStats } = await (await this.getSupabase()).from('platform_stats')
      .select('date, revenue_today')
      .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    const revenueChart = this.groupByMonth(monthlyStats || []);

    // Get event type distribution
    const { data: eventTypes } = await (await this.getSupabase()).from('events')
      .select('event_type');

    const eventDistribution = this.calculateDistribution(eventTypes || [], 'event_type');

    // Get recent admin activities
    const { data: activities } = await (await this.getSupabase()).from('admin_activity_logs')
      .select(`
        id,
        action_type,
        description,
        created_at,
        admin:admin_id (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentActivities = (activities || []).map((activity: any) => ({
      id: activity.id,
      type: activity.action_type,
      message: activity.description,
      timestamp: activity.created_at,
      admin: (Array.isArray(activity.admin) ? activity.admin[0]?.full_name : activity.admin?.full_name) || 'System',
    }));

    return {
      overview: {
        totalUsers: today.total_users || 0,
        usersChange: Math.round(usersChange * 10) / 10,
        totalVendors: today.total_vendors || 0,
        vendorsChange: Math.round(vendorsChange * 10) / 10,
        totalEvents: today.total_events || 0,
        eventsChange: Math.round(eventsChange * 10) / 10,
        totalRevenue: today.total_revenue || 0,
        revenueChange: Math.round(revenueChange * 10) / 10,
      },
      pendingActions: {
        vendorVerifications: pendingVendors || 0,
        supportTickets: openTickets || 0,
        contentReports: pendingReports || 0,
        contentApprovals: pendingContent || 0,
      },
      charts: {
        userGrowth,
        revenueChart,
        eventTypeDistribution: eventDistribution,
      },
      recentActivities,
    };
  }

  // ==================== Vendor Management ====================

  // Get all vendors with filters
  async getVendors(filters?: {
    status?: string;
    search?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase()).from('vendors')
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('verification_status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`business_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
    }

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      vendors: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Get vendor details
  async getVendorDetails(vendorId: string) {
    const { data, error } = await (await this.getSupabase()).from('vendors')
      .select(`
        *,
        services:vendor_services(*),
        portfolio:vendor_portfolio(*),
        reviews:vendor_reviews(*)
      `)
      .eq('id', vendorId)
      .single();

    if (error) throw error;
    return data;
  }

  // Verify vendor
  async verifyVendor(vendorId: string, adminId: string, approved: boolean, reason?: string) {
    const updates: Partial<Vendor> = {
      verification_status: approved ? 'verified' : 'rejected',
      verified_by: adminId,
      verified_at: new Date().toISOString(),
      rejection_reason: reason,
    };

    const { data, error } = await (await this.getSupabase()).from('vendors')
      .update(updates)
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'vendor_verification', 'vendor', vendorId, {
      action: approved ? 'approved' : 'rejected',
      reason,
    });

    // Create notification for vendor
    await this.createVendorNotification(vendorId, {
      type: approved ? 'verification_approved' : 'verification_rejected',
      title: approved ? 'Verification Approved' : 'Verification Rejected',
      message: approved
        ? 'Your vendor account has been verified and is now active!'
        : `Your verification request was rejected. Reason: ${reason}`,
    });

    return data;
  }

  // Suspend vendor
  async suspendVendor(vendorId: string, adminId: string, reason: string) {
    const { data, error } = await (await this.getSupabase()).from('vendors')
      .update({
        verification_status: 'suspended',
        is_active: false,
        rejection_reason: reason,
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'vendor_suspension', 'vendor', vendorId, { reason });

    // Create notification
    await this.createVendorNotification(vendorId, {
      type: 'verification_rejected',
      title: 'Account Suspended',
      message: `Your account has been suspended. Reason: ${reason}`,
    });

    return data;
  }

  // Feature vendor
  async featureVendor(vendorId: string, adminId: string, featured: boolean) {
    const { data, error } = await (await this.getSupabase()).from('vendors')
      .update({ is_featured: featured })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'vendor_featured', 'vendor', vendorId, { featured });

    return data;
  }

  // ==================== User Management ====================

  // Get all users with filters
  async getUsers(filters?: {
    search?: string;
    blocked?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    // Note: This would need proper user table implementation
    // Using auth.users might require admin privileges
    const { data, error, count } = await (await this.getSupabase()).from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Block user
  async blockUser(userId: string, adminId: string, reason: string) {
    // Implementation depends on user table structure
    await this.logActivity(adminId, 'user_blocked', 'user', userId, { reason });
    return { success: true };
  }

  // Delete user
  async deleteUser(userId: string, adminId: string, reason: string) {
    // Implementation depends on user table structure
    // This should soft delete or archive user data
    await this.logActivity(adminId, 'user_deleted', 'user', userId, { reason });
    return { success: true };
  }

  // ==================== Template Management ====================

  // Get all templates
  async getTemplates(filters?: {
    type?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase()).from('platform_templates')
      .select('*', { count: 'exact' });

    if (filters?.type) {
      query = query.eq('template_type', filters.type);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error, count } = await query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      templates: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Create template
  async createTemplate(adminId: string, template: Partial<PlatformTemplate>) {
    const { data, error } = await (await this.getSupabase()).from('platform_templates')
      .insert({
        ...template,
        created_by: adminId,
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'template_created', 'template', data.id, {
      name: template.template_name,
    });

    return data;
  }

  // Update template
  async updateTemplate(templateId: string, adminId: string, updates: Partial<PlatformTemplate>) {
    const { data, error } = await (await this.getSupabase()).from('platform_templates')
      .update({
        ...updates,
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'template_updated', 'template', templateId, updates);

    return data;
  }

  // Delete template
  async deleteTemplate(templateId: string, adminId: string) {
    const { error } = await (await this.getSupabase()).from('platform_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'template_deleted', 'template', templateId, {});

    return { success: true };
  }

  // ==================== Support System ====================

  // Get support tickets
  async getTickets(filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase()).from('support_tickets')
      .select('*, assigned:assigned_to(full_name)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data, error, count } = await query
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      tickets: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Get ticket details with messages
  async getTicketDetails(ticketId: string) {
    const { data: ticket, error: ticketError } = await (await this.getSupabase()).from('support_tickets')
      .select('*, assigned:assigned_to(full_name)')
      .eq('id', ticketId)
      .single();

    if (ticketError) throw ticketError;

    const { data: messages, error: messagesError } = await (await this.getSupabase()).from('support_ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    return {
      ...ticket,
      messages,
    };
  }

  // Assign ticket
  async assignTicket(ticketId: string, adminId: string, assignToId: string) {
    const { data, error } = await (await this.getSupabase()).from('support_tickets')
      .update({
        assigned_to: assignToId,
        assigned_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'ticket_assigned', 'ticket', ticketId, { assignToId });

    return data;
  }

  // Respond to ticket
  async respondToTicket(ticketId: string, adminId: string, message: string, attachments?: string[]) {
    // Add message
    const { data: messageData, error: messageError } = await (await this.getSupabase()).from('support_ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: adminId,
        sender_type: 'admin',
        message,
        attachments: attachments || [],
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update ticket status
    await (await this.getSupabase()).from('support_tickets')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    // Log activity
    await this.logActivity(adminId, 'ticket_response', 'ticket', ticketId, {});

    return messageData;
  }

  // Resolve ticket
  async resolveTicket(ticketId: string, adminId: string, resolutionNotes: string) {
    const { data, error } = await (await this.getSupabase()).from('support_tickets')
      .update({
        status: 'resolved',
        resolved_by: adminId,
        resolved_at: new Date().toISOString(),
        resolution_notes: resolutionNotes,
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'ticket_resolved', 'ticket', ticketId, {});

    return data;
  }

  // ==================== Content Moderation ====================

  // Get content reports
  async getContentReports(filters?: {
    status?: string;
    contentType?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase()).from('content_reports')
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.contentType) {
      query = query.eq('content_type', filters.contentType);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      reports: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Review content report
  async reviewContentReport(
    reportId: string,
    adminId: string,
    decision: 'action_taken' | 'dismissed',
    actionTaken?: string,
    adminNotes?: string
  ) {
    const { data, error } = await (await this.getSupabase()).from('content_reports')
      .update({
        status: decision,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        action_taken: actionTaken,
        admin_notes: adminNotes,
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'content_report_reviewed', 'report', reportId, {
      decision,
      actionTaken,
    });

    return data;
  }

  // Approve portfolio content
  async approvePortfolioItem(itemId: string, adminId: string, approved: boolean) {
    const { data, error } = await (await this.getSupabase()).from('vendor_portfolio')
      .update({ is_approved: approved })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(adminId, 'portfolio_reviewed', 'portfolio', itemId, { approved });

    return data;
  }

  // ==================== Analytics ====================

  // Get vendor performance analytics
  async getVendorPerformance(limit: number = 50): Promise<VendorPerformance[]> {
    const { data, error } = await (await this.getSupabase()).from('vendors')
      .select(`
        id,
        business_name,
        total_bookings,
        completed_events,
        average_rating,
        total_reviews
      `)
      .eq('is_active', true)
      .order('total_bookings', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Calculate additional metrics for each vendor
    const performance = await Promise.all(
      (data || []).map(async (vendor) => {
        // Get revenue from bookings
        const { data: bookings } = await (await this.getSupabase()).from('vendor_bookings')
          .select('total_amount')
          .eq('vendor_id', vendor.id)
          .eq('status', 'completed');

        const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

        // Get analytics for response time and conversion
        const { data: analytics } = await (await this.getSupabase()).from('vendor_analytics')
          .select('avg_response_time_hours, conversion_rate')
          .eq('vendor_id', vendor.id)
          .order('date', { ascending: false })
          .limit(30);

        const avgResponseTime = (analytics?.reduce((sum, a) => sum + (a.avg_response_time_hours || 0), 0) || 0) / (analytics?.length || 1);
        const avgConversion = (analytics?.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) || 0) / (analytics?.length || 1);

        return {
          vendor_id: vendor.id,
          business_name: vendor.business_name,
          total_bookings: vendor.total_bookings,
          completed_bookings: vendor.completed_events,
          total_revenue: totalRevenue,
          average_rating: vendor.average_rating,
          total_reviews: vendor.total_reviews,
          response_time_hours: Math.round(avgResponseTime * 10) / 10,
          conversion_rate: Math.round(avgConversion * 100) / 100,
        };
      })
    );

    return performance;
  }

  // Get revenue analytics
  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    // Get platform stats for last 12 months
    const { data: stats } = await (await this.getSupabase()).from('platform_stats')
      .select('*')
      .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    const totalRevenue = stats?.reduce((sum, s) => sum + Number(s.total_revenue), 0) || 0;
    const platformCommission = stats?.reduce((sum, s) => sum + Number(s.platform_commission), 0) || 0;
    const vendorPayouts = totalRevenue - platformCommission;

    // Calculate growth
    const lastMonth = stats?.slice(-30);
    const previousMonth = stats?.slice(-60, -30);
    const lastMonthRevenue = lastMonth?.reduce((sum, s) => sum + Number(s.total_revenue), 0) || 0;
    const previousMonthRevenue = previousMonth?.reduce((sum, s) => sum + Number(s.total_revenue), 0) || 0;
    const growth = previousMonthRevenue > 0 ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;

    // Group by month
    const byMonth = this.groupByMonth(stats || []).map((month) => ({
      ...month,
      commission: month.revenue * 0.1, // Assuming 10% commission
      bookings: 0, // Would need to join with bookings
    }));

    // Get revenue by service
    const { data: bookings } = await (await this.getSupabase()).from('vendor_bookings')
      .select('service_type, total_amount')
      .eq('status', 'completed');

    const serviceMap = new Map<string, { revenue: number; bookings: number }>();
    bookings?.forEach((booking) => {
      const existing = serviceMap.get(booking.service_type) || { revenue: 0, bookings: 0 };
      serviceMap.set(booking.service_type, {
        revenue: existing.revenue + Number(booking.total_amount),
        bookings: existing.bookings + 1,
      });
    });

    const byService = Array.from(serviceMap.entries()).map(([service, data]) => ({
      service,
      revenue: data.revenue,
      bookings: data.bookings,
    }));

    // Get top vendors
    const { data: topVendors } = await (await this.getSupabase()).from('vendor_bookings')
      .select('vendor_id, vendors:vendor_id(business_name)')
      .eq('status', 'completed');

    const vendorMap = new Map<string, { name: string; revenue: number; bookings: number }>();
    topVendors?.forEach((booking: any) => {
      const vendorId = booking.vendor_id;
      const businessName = booking.vendors?.business_name || 'Unknown';
      const existing = vendorMap.get(vendorId) || { name: businessName, revenue: 0, bookings: 0 };
      vendorMap.set(vendorId, {
        name: businessName,
        revenue: existing.revenue + Number(booking.total_amount),
        bookings: existing.bookings + 1,
      });
    });

    const topVendorsList = Array.from(vendorMap.entries())
      .map(([vendor_id, data]) => ({
        vendor_id,
        business_name: data.name,
        revenue: data.revenue,
        bookings: data.bookings,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      summary: {
        totalRevenue,
        platformCommission,
        vendorPayouts,
        growth: Math.round(growth * 10) / 10,
      },
      byMonth,
      byService,
      topVendors: topVendorsList,
    };
  }

  // ==================== Helper Methods ====================

  // Log admin activity
  private async logActivity(
    adminId: string,
    actionType: string,
    targetType: string,
    targetId: string,
    changes: any
  ) {
    await (await this.getSupabase()).from('admin_activity_logs').insert({
      admin_id: adminId,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      description: `${actionType} on ${targetType}`,
      changes,
    });
  }

  // Create vendor notification
  private async createVendorNotification(
    vendorId: string,
    notification: {
      type: string;
      title: string;
      message: string;
    }
  ) {
    await (await this.getSupabase()).from('vendor_notifications').insert({
      vendor_id: vendorId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
    });
  }

  // Group stats by month
  private groupByMonth(data: any[]): Array<{ month: string; revenue: number }> {
    const monthMap = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, existing + (Number(item.revenue_today) || Number(item.total_revenue) || 0));
    });

    return Array.from(monthMap.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // Calculate distribution
  private calculateDistribution(data: any[], field: string): Array<{ type: string; count: number; percentage: number }> {
    const countMap = new Map<string, number>();
    const total = data.length;

    data.forEach((item) => {
      const value = item[field] || 'Other';
      countMap.set(value, (countMap.get(value) || 0) + 1);
    });

    return Array.from(countMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);
  }
}
