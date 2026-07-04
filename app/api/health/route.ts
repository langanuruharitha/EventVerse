// Health Check API Endpoint
import { NextResponse } from 'next/server';
import { appMonitor } from '@/lib/monitoring/app-monitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [healthChecks, systemMetrics] = await Promise.all([
      appMonitor.runHealthChecks(),
      appMonitor.getSystemMetrics(),
    ]);

    const allHealthy = healthChecks.every(check => check.status === 'healthy');
    const hasDegraded = healthChecks.some(check => check.status === 'degraded');
    
    const overallStatus = allHealthy ? 'healthy' : hasDegraded ? 'degraded' : 'unhealthy';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      metrics: systemMetrics,
    }, {
      status: overallStatus === 'unhealthy' ? 503 : 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, {
      status: 503,
    });
  }
}
