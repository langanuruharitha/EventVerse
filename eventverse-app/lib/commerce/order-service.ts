'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCart, clearCart } from '@/lib/commerce/cart-service';

export interface CheckoutData {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress?: any;
  paymentMethod: string;
  deliveryInstructions?: string;
  eventId?: string;
}

/**
 * Create order from cart
 */
export async function createOrder(
  checkoutData: CheckoutData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get active cart with items
    const cartResult = await getCart();
    if (!cartResult.success || !cartResult.data) {
      return { success: false, error: cartResult.error || 'Cart is empty' };
    }

    const cart = cartResult.data;

    if (!cart.items || cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.product.name}`,
        };
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        event_id: checkoutData.eventId,
        status: 'pending',
        payment_status: 'pending',
        subtotal: cart.subtotal,
        discount_amount: cart.discountAmount || 0,
        shipping_amount: cart.shippingCharges,
        tax_amount: cart.taxAmount,
        total_amount: cart.totalAmount,
        shipping_address: checkoutData.shippingAddress,
        billing_address: checkoutData.billingAddress || checkoutData.shippingAddress,
        notes: checkoutData.deliveryInstructions,
        payment_method: checkoutData.paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cart.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_sku: item.product.sku || 'SKU-PENDING',
      product_image_url: item.product.primary_image_url || 'https://via.placeholder.com/150',
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      selected_color: item.selectedColor || null,
      selected_size: item.selectedSize || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product stock
    for (const item of cart.items) {
      await supabase
        .from('products')
        .update({
          stock_quantity: item.product.stock_quantity - item.quantity,
          sales_count: (item.product.sales_count || 0) + item.quantity,
        })
        .eq('id', item.product_id);
    }

    // Clear cart after order is created
    await clearCart();

    revalidatePath('/shop/orders');
    revalidatePath('/shop/cart');

    return {
      success: true,
      data: order,
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || error.details || 'Failed to create order',
    };
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: orders || [] };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/**
 * Get single order
 */
export async function getOrder(orderId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return { success: true, data: order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(
  orderId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get order
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return { success: false, error: 'Order cannot be cancelled' };
    }

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Restore product stock
    for (const item of order.items) {
      await supabase.rpc('increment_stock', {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    // Process refund if payment was made
    if (order.payment_status === 'paid') {
      // Initiate refund through payment gateway
      // This would be handled by razorpay-service in production
    }

    revalidatePath('/shop/orders');

    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: 'Failed to cancel order' };
  }
}

/**
 * Update order status (admin/vendor)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamp based on status
    if (status === 'shipped') {
      updates.shipped_date = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.delivered_date = new Date().toISOString();
    }

    await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    revalidatePath('/shop/orders');

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

/**
 * Process order payment (server action)
 * Creates a Razorpay order and marks payment as initiated.
 * The client-side Razorpay checkout handles the actual payment modal.
 */
export async function processOrderPayment(
  orderId: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('id, total_amount, order_number')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Dynamically import to keep crypto server-side only
    const { razorpayService } = await import('@/lib/payments/razorpay-service');
    const razorpayOrder = await razorpayService.createOrder(
      order.total_amount,
      'INR',
      order.order_number
    );

    // Update order with Razorpay order ID
    await supabase
      .from('orders')
      .update({
        razorpay_order_id: razorpayOrder.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return {
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}
