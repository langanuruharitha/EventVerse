// Application Monitoring & Health Checks
import { createServerClient } from '@/lib/supabase/server';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  error?: string;
  timestamp: string;
}

export class ApplicationMonitor {
  async runHealthChecks(): Promise<HealthCheckResult[]> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkSupabaseAuth(),
      this.checkSupabaseStorage(),
      this.checkAIService(),
      this.checkMemoryUsage(),
    ]);

    return checks.map((result, index) => {
      const serviceName = ['database', 'auth', 'storage', 'ai', 'memory'][index];
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service: serviceName,
          status: 'unhealthy' as const,
          responseTime: 0,
          error: result.reason?.message || 'Unknown error',
          timestamp: new Date().toISOString(),
        };
      }
    });
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.from('users').select('count').limit(1).single();
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: error ? 'degraded' : 'healthy',
        responseTime,
        error: error?.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkSupabaseAuth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase.auth.getSession();
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'auth',
        status: error ? 'degraded' : 'healthy',
        responseTime,
        error: error?.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        service: 'auth',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkSupabaseStorage(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase.storage.listBuckets();
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'storage',
        status: error ? 'degraded' : 'healthy',
        responseTime,
        error: error?.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkAIService(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple check - verify API key is set
      const hasApiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'ai',
        status: hasApiKey ? 'healthy' : 'degraded',
        responseTime,
        error: hasApiKey ? undefined : 'API key not configured',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        service: 'ai',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkMemoryUsage(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
      const usagePercentage = (heapUsedMB / heapTotalMB) * 100;
      
      const status = usagePercentage > 85 ? 'degraded' : 'healthy';
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'memory',
        status,
        responseTime,
        error: status === 'degraded' ? `High memory usage: ${usagePercentage.toFixed(1)}%` : undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        service: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      uptime: {
        seconds: Math.floor(uptime),
        formatted: this.formatUptime(uptime),
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }
}

export const appMonitor = new ApplicationMonitor();
