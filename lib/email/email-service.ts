// Email service using Resend or any email provider
// For now, this is a placeholder that logs emails

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // TODO: Integrate with Resend, SendGrid, or other email provider
      console.log('📧 Email sent:', {
        to: template.to,
        subject: template.subject
      });
      
      // For production, uncomment and configure:
      /*
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'EventVerse <noreply@eventverse.com>',
          to: template.to,
          subject: template.subject,
          html: template.html
        })
      });
      */
      
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  async sendOrderConfirmation(orderDetails: any): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #e5e7eb; padding: 15px 0; }
            .total { font-size: 24px; font-weight: bold; color: #7c3aed; margin-top: 20px; }
            .button { background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order</p>
            </div>
            <div class="content">
              <h2>Hi ${orderDetails.customerName},</h2>
              <p>Your order has been confirmed and is being processed.</p>
              
              <div class="order-details">
                <h3>Order #${orderDetails.orderNumber}</h3>
                <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${orderDetails.status}</p>
                
                <h4>Items:</h4>
                ${orderDetails.items.map((item: any) => `
                  <div class="item">
                    <p><strong>${item.name}</strong></p>
                    <p>Quantity: ${item.quantity} × ₹${item.price}</p>
                  </div>
                `).join('')}
                
                <div class="total">
                  Total: ₹${orderDetails.total}
                </div>
              </div>
              
              <p>We'll send you another email when your order ships.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop/orders/${orderDetails.orderId}" class="button">
                View Order Details
              </a>
              
              <p>Questions? Contact us at support@eventverse.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: orderDetails.email,
      subject: `Order Confirmation - #${orderDetails.orderNumber}`,
      html
    });
  }

  async sendOrderStatusUpdate(orderDetails: any): Promise<boolean> {
    const statusMessages = {
      confirmed: '✓ Your order has been confirmed',
      processing: '📦 Your order is being processed',
      shipped: '🚚 Your order has been shipped',
      delivered: '✅ Your order has been delivered',
      cancelled: '❌ Your order has been cancelled'
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .status { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Update</h1>
            </div>
            <div class="content">
              <h2>Hi ${orderDetails.customerName},</h2>
              
              <div class="status">
                <h3>${statusMessages[orderDetails.status as keyof typeof statusMessages]}</h3>
                <p>Order #${orderDetails.orderNumber}</p>
                ${orderDetails.trackingNumber ? `<p><strong>Tracking:</strong> ${orderDetails.trackingNumber}</p>` : ''}
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop/orders/${orderDetails.orderId}" class="button">
                Track Order
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: orderDetails.email,
      subject: `Order Update - #${orderDetails.orderNumber}`,
      html
    });
  }
}

export const emailService = new EmailService();
