// Centralized Error Handling and Logging
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown',
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  async logError(
    error: Error | unknown,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context?: Record<string, any>
  ): Promise<void> {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      severity,
      category,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      requestId: context?.requestId,
      userId: context?.userId,
    };

    // Add to in-memory log (for development)
    this.addToInMemoryLog(errorLog);

    // Log to console with color coding
    this.logToConsole(errorLog);

    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      await this.sendToExternalService(errorLog);
    }

    // Send critical errors to alerting system
    if (severity === ErrorSeverity.CRITICAL) {
      await this.triggerAlert(errorLog);
    }
  }

  private addToInMemoryLog(errorLog: ErrorLog): void {
    this.errorLogs.push(errorLog);
    
    // Keep only last N logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }
  }

  private logToConsole(errorLog: ErrorLog): void {
    const colors = {
      [ErrorSeverity.LOW]: '\x1b[36m',      // Cyan
      [ErrorSeverity.MEDIUM]: '\x1b[33m',   // Yellow
      [ErrorSeverity.HIGH]: '\x1b[31m',     // Red
      [ErrorSeverity.CRITICAL]: '\x1b[35m', // Magenta
    };

    const reset = '\x1b[0m';
    const color = colors[errorLog.severity];

    console.error(
      `${color}[${errorLog.severity.toUpperCase()}]${reset}`,
      `[${errorLog.category}]`,
      errorLog.message
    );

    if (errorLog.stack && process.env.NODE_ENV === 'development') {
      console.error(errorLog.stack);
    }

    if (errorLog.context) {
      console.error('Context:', errorLog.context);
    }
  }

  private async sendToExternalService(errorLog: ErrorLog): Promise<void> {
    // In production, integrate with services like:
    // - Sentry
    // - Datadog
    // - New Relic
    // - CloudWatch
    
    try {
      // Example: Send to external logging API
      if (process.env.LOGGING_ENDPOINT) {
        await fetch(process.env.LOGGING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorLog),
        });
      }
    } catch (error) {
      // Fail silently - don't throw errors in error handler
      console.error('Failed to send error to external service:', error);
    }
  }

  private async triggerAlert(errorLog: ErrorLog): Promise<void> {
    // Send critical alerts via:
    // - Email
    // - SMS
    // - Slack/Teams
    // - PagerDuty
    
    console.error('🚨 CRITICAL ERROR ALERT:', errorLog.message);
    
    // In production, send actual alerts
    if (process.env.NODE_ENV === 'production' && process.env.ALERT_WEBHOOK_URL) {
      try {
        await fetch(process.env.ALERT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Critical Error in EventVerse`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Critical Error Detected*\n\n*Message:* ${errorLog.message}\n*Category:* ${errorLog.category}\n*Time:* ${errorLog.timestamp}`,
                },
              },
            ],
          }),
        });
      } catch (error) {
        console.error('Failed to send alert:', error);
      }
    }
  }

  getRecentErrors(limit = 50): ErrorLog[] {
    return this.errorLogs.slice(-limit).reverse();
  }

  getErrorsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.errorLogs.filter(log => log.category === category);
  }

  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.errorLogs.filter(log => log.severity === severity);
  }

  clearLogs(): void {
    this.errorLogs = [];
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper methods for specific error types
  async logAuthError(error: Error, userId?: string): Promise<void> {
    await this.logError(error, ErrorSeverity.HIGH, ErrorCategory.AUTHENTICATION, { userId });
  }

  async logDatabaseError(error: Error, query?: string): Promise<void> {
    await this.logError(error, ErrorSeverity.HIGH, ErrorCategory.DATABASE, { query });
  }

  async logValidationError(error: Error, field?: string): Promise<void> {
    await this.logError(error, ErrorSeverity.LOW, ErrorCategory.VALIDATION, { field });
  }

  async logExternalServiceError(error: Error, service: string): Promise<void> {
    await this.logError(error, ErrorSeverity.MEDIUM, ErrorCategory.EXTERNAL_SERVICE, { service });
  }

  async logSystemError(error: Error): Promise<void> {
    await this.logError(error, ErrorSeverity.CRITICAL, ErrorCategory.SYSTEM);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Helper function for try-catch blocks
export async function handleAsync<T>(
  promise: Promise<T>,
  errorCategory: ErrorCategory = ErrorCategory.UNKNOWN,
  errorSeverity: ErrorSeverity = ErrorSeverity.MEDIUM
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    await errorHandler.logError(error, errorSeverity, errorCategory);
    return [null, error as Error];
  }
}
