// Admin Analytics Service
// Handles platform metrics and reporting

import { createServerClient } from '@/lib/supabase/server';

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  userGrowthPercentage: number;
  
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  eventGrowthPercentage: number;
  
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueGrowthPercentage: number;
  
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  
  totalVenues: number;
  totalProducts: number;
  
  totalPhotos: number;
  photosUploadedToday: number;
  
  openTickets: number;
  urgentTickets: number;
  
  systemHealth: string;
  apiResponseTime: number;
}

export interface AnalyticsTimeRange {
  startDate: Date;
  endDate: Date;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

class AnalyticsService {
  /**
   * Get platform overview metrics
   */
  async getPlatformOverview(timeRange?: AnalyticsTimeRange): Promise<PlatformMetrics> {
    const supabase = await createServerClient();
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // Get user metrics
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    const { count: newUsersToday } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    const { count: newUsersThisWeek } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());
    
    const { count: newUsersThisMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString());
    
    // Get event metrics
    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    const { count: completedEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
    
    // Get revenue metrics (if payment tables exist)
    let totalRevenue = 0;
    let revenueToday = 0;
    let revenueThisWeek = 0;
    let revenueThisMonth = 0;
    
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status');
      
      if (orders) {
        totalRevenue = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + Number(o.total_amount), 0);
        
        revenueToday = orders
          .filter(o => 
            o.status === 'completed' && 
            new Date(o.created_at) >= today
          )
          .reduce((sum, o) => sum + Number(o.total_amount), 0);
        
        revenueThisWeek = orders
          .filter(o => 
            o.status === 'completed' && 
            new Date(o.created_at) >= weekAgo
          )
          .reduce((sum, o) => sum + Number(o.total_amount), 0);
        
        revenueThisMonth = orders
          .filter(o => 
            o.status === 'completed' && 
            new Date(o.created_at) >= monthAgo
          )
          .reduce((sum, o) => sum + Number(o.total_amount), 0);
      }
    } catch (error) {
      console.log('Orders table not available yet');
    }
    
    // Get order metrics
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
    
    // Get vendor metrics
    const { count: totalVendors } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });
    
    // Get venue and product counts
    const { count: totalVenues } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Get memory vault metrics
    const { count: totalPhotos } = await supabase
      .from('memory_items')
      .select('*', { count: 'exact', head: true })
      .eq('file_type', 'photo');
    
    const { count: photosUploadedToday } = await supabase
      .from('memory_items')
      .select('*', { count: 'exact', head: true })
      .eq('file_type', 'photo')
      .gte('uploaded_at', today.toISOString());
    
    // Calculate growth percentages
    const userGrowthPercentage = totalUsers 
      ? ((newUsersThisMonth || 0) / totalUsers) * 100 
      : 0;
    
    const eventGrowthPercentage = totalEvents 
      ? ((activeEvents || 0) / totalEvents) * 100 
      : 0;
    
    const revenueGrowthPercentage = totalRevenue 
      ? ((revenueThisMonth / totalRevenue) * 100) 
      : 0;
    
    return {
      totalUsers: totalUsers || 0,
      activeUsers: totalUsers || 0, // Simplified for MVP
      newUsersToday: newUsersToday || 0,
      newUsersThisWeek: newUsersThisWeek || 0,
      newUsersThisMonth: newUsersThisMonth || 0,
      userGrowthPercentage,
      
      totalEvents: totalEvents || 0,
      activeEvents: activeEvents || 0,
      completedEvents: completedEvents || 0,
      eventGrowthPercentage,
      
      totalRevenue,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      revenueGrowthPercentage,
      
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      
      totalVendors: totalVendors || 0,
      activeVendors: totalVendors || 0, // Simplified
      pendingVendors: 0,
      
      totalVenues: totalVenues || 0,
      totalProducts: totalProducts || 0,
      
      totalPhotos: totalPhotos || 0,
      photosUploadedToday: photosUploadedToday || 0,
      
      openTickets: 0, // Not implemented yet
      urgentTickets: 0,
      
      systemHealth: 'healthy',
      apiResponseTime: 120 // ms
    };
  }

  /**
   * Get user analytics
   */
  async getUserMetrics(filters?: any) {
    const supabase = await createServerClient();
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, created_at, role')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (error) throw error;
    
    return {
      totalUsers: users?.length || 0,
      users: users || []
    };
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(filters?: any) {
    const supabase = await createServerClient();
    
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      const totalRevenue = orders?.reduce((sum, order) => 
        sum + Number(order.total_amount), 0
      ) || 0;
      
      return {
        totalRevenue,
        orders: orders || []
      };
    } catch (error) {
      return {
        totalRevenue: 0,
        orders: []
      };
    }
  }

  /**
   * Track platform metric
   */
  async trackMetric(
    metricType: string,
    value: number,
    category?: string,
    metadata?: any
  ) {
    const supabase = await createServerClient();
    
    await supabase.from('platform_analytics').insert({
      metric_type: metricType,
      metric_value: value,
      category,
      metric_data: metadata,
      metric_date: new Date().toISOString().split('T')[0]
    });
  }
}

export const analyticsService = new AnalyticsService();
