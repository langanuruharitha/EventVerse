// Vendor Service - Business logic for vendor operations
import { createServerClient } from '@/lib/supabase/server';
import type { Vendor, VendorLead, VendorBooking, VendorDashboardStats } from '@/types/vendor';

export class VendorService {
  private async getSupabase() {
    return await createServerClient();
  }

  // Get vendor by user ID
  async getVendorByUserId(userId: string): Promise<Vendor | null> {
    const { data, error } = await (await this.getSupabase())
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get vendor dashboard statistics
  async getDashboardStats(vendorId: string): Promise<VendorDashboardStats> {
    // Get current period stats
    const { data: currentStats } = await (await this.getSupabase())
      .from('vendor_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    // Get previous period stats for comparison
    const { data: previousStats } = await (await this.getSupabase())
      .from('vendor_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('date', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
      .lt('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Calculate totals
    const currentLeads = currentStats?.reduce((sum, day) => sum + day.leads_received, 0) || 0;
    const previousLeads = previousStats?.reduce((sum, day) => sum + day.leads_received, 0) || 0;
    const leadsChange = previousLeads > 0 ? ((currentLeads - previousLeads) / previousLeads) * 100 : 0;

    const currentBookings = currentStats?.reduce((sum, day) => sum + day.bookings_confirmed, 0) || 0;
    const previousBookings = previousStats?.reduce((sum, day) => sum + day.bookings_confirmed, 0) || 0;
    const bookingsChange = previousBookings > 0 ? ((currentBookings - previousBookings) / previousBookings) * 100 : 0;

    const currentRevenue = currentStats?.reduce((sum, day) => sum + Number(day.revenue_earned), 0) || 0;
    const previousRevenue = previousStats?.reduce((sum, day) => sum + Number(day.revenue_earned), 0) || 0;
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Get vendor details for rating
    const { data: vendor } = await (await this.getSupabase())
      .from('vendors')
      .select('average_rating')
      .eq('id', vendorId)
      .single();

    // Get pending leads count
    const { count: pendingLeads } = await (await this.getSupabase())
      .from('vendor_leads')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', vendorId)
      .eq('status', 'pending');

    // Get active bookings count
    const { count: activeBookings } = await (await this.getSupabase())
      .from('vendor_bookings')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', vendorId)
      .in('status', ['confirmed', 'in_progress']);

    // Get upcoming events
    const { data: upcomingEvents } = await (await this.getSupabase())
      .from('vendor_bookings')
      .select(`
        id,
        service_type,
        event_date,
        customer_id,
        status
      `)
      .eq('vendor_id', vendorId)
      .eq('status', 'confirmed')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(5);

    // Get customer names for upcoming events
    const upcomingEventsWithNames = await Promise.all(
      (upcomingEvents || []).map(async (event) => {
        const { data: user } = await (await this.getSupabase())
          .from('auth.users')
          .select('email')
          .eq('id', event.customer_id)
          .single();

        const daysUntil = Math.ceil(
          (new Date(event.event_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: event.id,
          eventType: event.service_type,
          date: event.event_date,
          customer: user?.email?.split('@')[0] || 'Customer',
          daysUntil,
        };
      })
    );

    // Get recent activities
    const { data: recentActivities } = await (await this.getSupabase())
      .from('vendor_notifications')
      .select('id, type, title, message, created_at')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      totalLeads: currentLeads,
      leadsChange: Math.round(leadsChange * 10) / 10,
      pendingLeads: pendingLeads || 0,
      totalBookings: currentBookings,
      bookingsChange: Math.round(bookingsChange * 10) / 10,
      activeBookings: activeBookings || 0,
      monthlyRevenue: currentRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      averageRating: vendor?.average_rating || 0,
      ratingChange: 0, // TODO: Calculate from previous period
      upcomingEvents: upcomingEventsWithNames,
      recentActivities: (recentActivities || []).map((activity) => ({
        id: activity.id,
        type: activity.type,
        message: activity.message,
        timestamp: activity.created_at,
      })),
    };
  }

  // Get vendor leads with filters
  async getLeads(vendorId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase())
      .from('vendor_leads')
      .select('*, customers:customer_id(*)', { count: 'exact' })
      .eq('vendor_id', vendorId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      leads: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Respond to a lead
  async respondToLead(
    leadId: string,
    vendorId: string,
    response: {
      action: 'accept' | 'reject' | 'request_info';
      response: string;
      proposedPrice?: number;
      rejectionReason?: string;
    }
  ) {
    // Verify lead belongs to vendor
    const { data: lead, error: leadError } = await (await this.getSupabase())
      .from('vendor_leads')
      .select('*')
      .eq('id', leadId)
      .eq('vendor_id', vendorId)
      .single();

    if (leadError) throw leadError;
    if (!lead) throw new Error('Lead not found');

    // Check if already responded
    if (lead.status !== 'pending') {
      throw new Error('Lead already responded to');
    }

    // Check if expired
    if (new Date(lead.expires_at) < new Date()) {
      throw new Error('Lead has expired');
    }

    // Update lead based on action
    const updates: Partial<VendorLead> = {
      vendor_response: response.response,
      responded_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    };

    if (response.action === 'accept') {
      updates.status = 'contacted';
      updates.contacted_at = new Date().toISOString();
      updates.proposed_price = response.proposedPrice;
    } else if (response.action === 'reject') {
      updates.status = 'rejected';
      updates.rejected_at = new Date().toISOString();
      updates.rejection_reason = response.rejectionReason;
    }

    const { data, error } = await (await this.getSupabase())
      .from('vendor_leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for customer
    await this.createCustomerNotification(lead.customer_id, {
      type: response.action === 'accept' ? 'lead_response' : 'lead_rejected',
      title: response.action === 'accept' ? 'Vendor Responded!' : 'Vendor Declined',
      message: response.response.substring(0, 200),
      relatedLeadId: leadId,
    });

    return data;
  }

  // Helper: Create customer notification
  private async createCustomerNotification(
    customerId: string,
    notification: {
      type: string;
      title: string;
      message: string;
      relatedLeadId?: string;
    }
  ) {
    // This would create a notification in a customer_notifications table
    // For now, we can skip or implement based on customer panel structure
    console.log('Customer notification created:', notification);
  }

  // Get vendor bookings with filters
  async getBookings(vendorId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase())
      .from('vendor_bookings')
      .select('*, customers:customer_id(*)', { count: 'exact' })
      .eq('vendor_id', vendorId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      bookings: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    vendorId: string,
    updates: {
      status: string;
      notes?: string;
    }
  ) {
    // Verify booking belongs to vendor
    const { data: booking, error: bookingError } = await (await this.getSupabase())
      .from('vendor_bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('vendor_id', vendorId)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Booking not found');

    const updateData: Partial<VendorBooking> = {
      status: updates.status as any,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    };

    // Set status-specific timestamps
    if (updates.status === 'confirmed' && !booking.confirmed_at) {
      updateData.confirmed_at = new Date().toISOString();
    } else if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else if (updates.status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { data, error } = await (await this.getSupabase())
      .from('vendor_bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    // Update analytics
    if (updates.status === 'confirmed') {
      await this.updateAnalytics(vendorId, 'bookings_confirmed', 1);
    } else if (updates.status === 'completed') {
      await this.updateAnalytics(vendorId, 'bookings_completed', 1);
      await this.updateAnalytics(vendorId, 'revenue_earned', booking.total_amount);
    }

    // Create notification for customer
    await this.createCustomerNotification(booking.customer_id, {
      type: 'booking_updated',
      title: 'Booking Status Updated',
      message: `Your booking status has been updated to: ${updates.status}`,
    });

    return data;
  }

  // Get vendor portfolio
  async getPortfolio(vendorId: string, filters?: {
    eventCategory?: string;
    mediaType?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 24;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase())
      .from('vendor_portfolio')
      .select('*', { count: 'exact' })
      .eq('vendor_id', vendorId)
      .eq('is_approved', true);

    if (filters?.eventCategory) {
      query = query.eq('event_category', filters.eventCategory);
    }

    if (filters?.mediaType) {
      query = query.eq('media_type', filters.mediaType);
    }

    const { data, error, count } = await query
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Upload portfolio item
  async uploadPortfolioItem(
    vendorId: string,
    item: {
      mediaType: 'image' | 'video';
      mediaUrl: string;
      thumbnailUrl?: string;
      title?: string;
      description?: string;
      eventCategory: string;
      serviceCategory?: string;
      tags?: string[];
    }
  ) {
    const { data, error } = await (await this.getSupabase())
      .from('vendor_portfolio')
      .insert({
        vendor_id: vendorId,
        media_type: item.mediaType,
        media_url: item.mediaUrl,
        thumbnail_url: item.thumbnailUrl,
        title: item.title,
        description: item.description,
        event_category: item.eventCategory,
        service_category: item.serviceCategory,
        tags: item.tags || [],
        is_approved: false, // Requires admin approval
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await this.createVendorNotification(vendorId, {
      type: 'profile_incomplete',
      title: 'Portfolio Item Uploaded',
      message: 'Your portfolio item is pending admin approval',
    });

    return data;
  }

  // Delete portfolio item
  async deletePortfolioItem(itemId: string, vendorId: string) {
    const { error } = await (await this.getSupabase())
      .from('vendor_portfolio')
      .delete()
      .eq('id', itemId)
      .eq('vendor_id', vendorId);

    if (error) throw error;

    return { success: true };
  }

  // Get vendor reviews
  async getReviews(vendorId: string, filters?: {
    rating?: number;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = (await this.getSupabase())
      .from('vendor_reviews')
      .select('*, customers:customer_id(*)', { count: 'exact' })
      .eq('vendor_id', vendorId)
      .eq('is_approved', true);

    if (filters?.rating) {
      query = query.eq('rating', filters.rating);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      reviews: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  // Respond to review
  async respondToReview(reviewId: string, vendorId: string, response: string) {
    // Verify review belongs to vendor
    const { data: review, error: reviewError } = await (await this.getSupabase())
      .from('vendor_reviews')
      .select('*')
      .eq('id', reviewId)
      .eq('vendor_id', vendorId)
      .single();

    if (reviewError) throw reviewError;
    if (!review) throw new Error('Review not found');

    if (review.vendor_response) {
      throw new Error('Review already responded to');
    }

    const { data, error } = await (await this.getSupabase())
      .from('vendor_reviews')
      .update({
        vendor_response: response,
        vendor_responded_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for customer
    await this.createCustomerNotification(review.customer_id, {
      type: 'lead_response',
      title: 'Vendor Responded to Your Review',
      message: response.substring(0, 200),
    });

    return data;
  }

  // Get vendor analytics
  async getAnalytics(vendorId: string, filters?: {
    startDate?: string;
    endDate?: string;
  }) {
    const startDate = filters?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = filters?.endDate || new Date().toISOString();

    const { data, error } = await (await this.getSupabase())
      .from('vendor_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // Calculate summary metrics
    const summary = {
      totalProfileViews: data?.reduce((sum, day) => sum + day.profile_views, 0) || 0,
      totalPortfolioViews: data?.reduce((sum, day) => sum + day.portfolio_views, 0) || 0,
      totalLeadsReceived: data?.reduce((sum, day) => sum + day.leads_received, 0) || 0,
      totalLeadsAccepted: data?.reduce((sum, day) => sum + day.leads_accepted, 0) || 0,
      totalBookingsConfirmed: data?.reduce((sum, day) => sum + day.bookings_confirmed, 0) || 0,
      totalRevenue: data?.reduce((sum, day) => sum + Number(day.revenue_earned), 0) || 0,
      avgResponseTimeHours: data?.reduce((sum, day) => sum + (day.avg_response_time_hours || 0), 0) / (data?.length || 1),
      avgConversionRate: data?.reduce((sum, day) => sum + (day.conversion_rate || 0), 0) / (data?.length || 1),
    };

    return {
      summary,
      dailyData: data,
    };
  }

  // Helper: Update vendor analytics
  private async updateAnalytics(
    vendorId: string,
    metric: string,
    value: number
  ) {
    const today = new Date().toISOString().split('T')[0];

    // Check if record exists for today
    const { data: existing } = await (await this.getSupabase())
      .from('vendor_analytics')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing record
      await (await this.getSupabase())
        .from('vendor_analytics')
        .update({
          [metric]: existing[metric] + value,
        })
        .eq('vendor_id', vendorId)
        .eq('date', today);
    } else {
      // Create new record
      await (await this.getSupabase())
        .from('vendor_analytics')
        .insert({
          vendor_id: vendorId,
          date: today,
          [metric]: value,
        });
    }
  }

  // Helper: Create vendor notification
  private async createVendorNotification(
    vendorId: string,
    notification: {
      type: string;
      title: string;
      message: string;
    }
  ) {
    await (await this.getSupabase())
      .from('vendor_notifications')
      .insert({
        vendor_id: vendorId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
      });
  }

  // Update vendor profile
  async updateProfile(vendorId: string, updates: Partial<Vendor>) {
    const { data, error } = await (await this.getSupabase())
      .from('vendors')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get vendor notifications
  async getNotifications(vendorId: string, unreadOnly: boolean = false) {
    let query = (await this.getSupabase())
      .from('vendor_notifications')
      .select('*')
      .eq('vendor_id', vendorId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string, vendorId: string) {
    const { error } = await (await this.getSupabase())
      .from('vendor_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return { success: true };
  }
}
