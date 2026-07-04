'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  isAiRecommended?: boolean;
}

export interface Cart {
  id: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
}

type CartTable = 'carts' | 'shopping_carts';
type CartStorageMode = 'cart_id' | 'user_id';

interface ResolvedCart {
  mode: CartStorageMode;
  table?: CartTable;
  id: string;
  userId: string;
}

let cachedStorageMode: CartStorageMode | null = null;

function computeTotals(items: Array<{ total_price: number }>) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const taxAmount = subtotal * 0.18;
  const shippingCharges = subtotal >= 999 ? 0 : 50;
  const totalAmount = subtotal + taxAmount + shippingCharges;

  return {
    subtotal,
    tax_amount: taxAmount,
    shipping_charges: shippingCharges,
    total_amount: totalAmount,
    discount_amount: 0,
  };
}

function normalizeItems(rawItems: any[] | null | undefined) {
  return (rawItems || []).map((item) => {
    const unitPrice = Number(item.unit_price ?? item.product?.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    const totalPrice = Number(item.total_price ?? unitPrice * quantity);

    return {
      ...item,
      unit_price: unitPrice,
      total_price: totalPrice,
      quantity,
    };
  });
}

function isMissingColumnError(error: { code?: string; message?: string } | null, column: string) {
  if (!error) return false;
  return (
    error.code === '42703' ||
    error.message?.includes(`column "${column}"`) ||
    error.message?.includes(`column ${column} does not exist`) ||
    error.message?.includes(`'${column}'`)
  );
}

async function detectStorageMode(
  supabase: Awaited<ReturnType<typeof createServerClient>>
): Promise<CartStorageMode | null> {
  if (cachedStorageMode) {
    return cachedStorageMode;
  }

  const { error: cartIdError } = await supabase.from('cart_items').select('cart_id').limit(1);
  if (!isMissingColumnError(cartIdError, 'cart_id')) {
    cachedStorageMode = 'cart_id';
    return cachedStorageMode;
  }

  const { error: userIdError } = await supabase.from('cart_items').select('user_id').limit(1);
  if (!isMissingColumnError(userIdError, 'user_id')) {
    cachedStorageMode = 'user_id';
    return cachedStorageMode;
  }

  return null;
}

async function resolveCartTable(
  supabase: Awaited<ReturnType<typeof createServerClient>>
): Promise<CartTable | null> {
  const { error: cartsError } = await supabase.from('carts').select('id').limit(1);
  if (!cartsError || cartsError.code !== '42P01') {
    return 'carts';
  }

  const { error: shoppingCartsError } = await supabase.from('shopping_carts').select('id').limit(1);
  if (!shoppingCartsError || shoppingCartsError.code !== '42P01') {
    return 'shopping_carts';
  }

  return null;
}

async function getOrCreateCartRecord(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userId: string
): Promise<{ table: CartTable; id: string } | null> {
  const table = await resolveCartTable(supabase);
  if (!table) {
    return null;
  }

  let query = supabase.from(table).select('id').eq('user_id', userId);
  if (table === 'shopping_carts') {
    query = query.eq('status', 'active');
  }

  const { data: existingCart, error: fetchError } = await query.maybeSingle();
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching cart:', fetchError);
    return null;
  }

  if (existingCart) {
    return { table, id: existingCart.id };
  }

  if (table === 'shopping_carts') {
    const { data: newCart, error: createError } = await supabase
      .from('shopping_carts')
      .insert({ user_id: userId, status: 'active' })
      .select('id')
      .single();

    if (createError || !newCart) {
      console.error('Error creating cart:', createError);
      return null;
    }

    return { table, id: newCart.id };
  }

  const { data: newCart, error: createError } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (createError || !newCart) {
    console.error('Error creating cart:', createError);
    return null;
  }

  return { table, id: newCart.id };
}

async function resolveCart(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userId: string
): Promise<ResolvedCart | null> {
  const mode = await detectStorageMode(supabase);
  if (!mode) {
    console.error('cart_items table not found or has unsupported columns.');
    return null;
  }

  if (mode === 'user_id') {
    return { mode, id: userId, userId };
  }

  const cartRecord = await getOrCreateCartRecord(supabase, userId);
  if (!cartRecord) {
    console.error('No carts/shopping_carts table found for cart_id storage mode.');
    return null;
  }

  return {
    mode,
    table: cartRecord.table,
    id: cartRecord.id,
    userId,
  };
}

async function fetchCartItems(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  cart: ResolvedCart
) {
  let query = supabase.from('cart_items').select(`
    *,
    product:products(*)
  `);

  if (cart.mode === 'user_id') {
    query = query.eq('user_id', cart.userId);
  } else {
    query = query.eq('cart_id', cart.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  return normalizeItems(data);
}

async function updateCartTotals(cart: ResolvedCart): Promise<void> {
  if (cart.mode !== 'cart_id' || cart.table !== 'shopping_carts') {
    return;
  }

  const supabase = await createServerClient();
  const items = await fetchCartItems(supabase, cart);
  const totals = computeTotals(items);

  await supabase
    .from('shopping_carts')
    .update({
      subtotal: totals.subtotal,
      tax_amount: totals.tax_amount,
      shipping_charges: totals.shipping_charges,
      total_amount: totals.total_amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cart.id);
}

async function findExistingItem(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  cart: ResolvedCart,
  productId: string
) {
  let query = supabase
    .from('cart_items')
    .select('id, quantity, unit_price')
    .eq('product_id', productId);

  if (cart.mode === 'user_id') {
    query = query.eq('user_id', cart.userId);
  } else {
    query = query.eq('cart_id', cart.id);
  }

  return query.maybeSingle();
}

async function insertCartItem(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  cart: ResolvedCart,
  item: CartItem,
  productPrice: number
): Promise<{ success: boolean; error?: string }> {
  const payloads: Record<string, unknown>[] = [];

  if (cart.mode === 'user_id') {
    payloads.push(
      {
        user_id: cart.userId,
        product_id: item.productId,
        quantity: item.quantity,
        selected_color: null,
        selected_size: null,
      },
      {
        user_id: cart.userId,
        product_id: item.productId,
        quantity: item.quantity,
      }
    );
  } else {
    payloads.push(
      {
        cart_id: cart.id,
        user_id: cart.userId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: productPrice,
        total_price: item.quantity * productPrice,
        variant_id: item.variantId,
        is_ai_recommended: item.isAiRecommended || false,
        selected_color: null,
        selected_size: null,
      },
      {
        cart_id: cart.id,
        user_id: cart.userId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: productPrice,
        total_price: item.quantity * productPrice,
      },
      {
        cart_id: cart.id,
        user_id: cart.userId,
        product_id: item.productId,
        quantity: item.quantity,
      },
      {
        cart_id: cart.id,
        product_id: item.productId,
        quantity: item.quantity,
      }
    );
  }

  let lastError: { message?: string } | null = null;
  for (const payload of payloads) {
    const { error } = await supabase.from('cart_items').insert(payload);
    if (!error) {
      return { success: true };
    }
    lastError = error;
  }

  console.error('Error inserting cart item:', lastError);
  return { success: false, error: 'Failed to add item: ' + (lastError?.message || 'Unknown error') };
}

async function updateExistingCartItem(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  itemId: string,
  quantity: number,
  productPrice: number,
  existingHasPriceFields: boolean
): Promise<{ success: boolean; error?: string }> {
  const updatePayload: Record<string, unknown> = {
    quantity,
    updated_at: new Date().toISOString(),
  };

  if (existingHasPriceFields) {
    updatePayload.total_price = quantity * productPrice;
  }

  const { error } = await supabase.from('cart_items').update(updatePayload).eq('id', itemId);
  if (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: 'Failed to update cart item' };
  }

  return { success: true };
}

/**
 * Get or create user's cart
 */
export async function getCart(): Promise<{ success: boolean; data?: Cart; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const cart = await resolveCart(supabase, user.id);
    if (!cart) {
      return { success: false, error: 'Failed to create cart' };
    }

    const items = await fetchCartItems(supabase, cart);
    const totals = computeTotals(items);

    return {
      success: true,
      data: {
        id: cart.id,
        items,
        subtotal: totals.subtotal,
        taxAmount: totals.tax_amount,
        shippingCharges: totals.shipping_charges,
        totalAmount: totals.total_amount,
        discountAmount: totals.discount_amount,
      },
    };
  } catch (error) {
    console.error('Error getting cart:', error);
    return { success: false, error: 'Failed to get cart' };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(item: CartItem): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const cart = await resolveCart(supabase, user.id);
    if (!cart) {
      return { success: false, error: 'Failed to create or get cart' };
    }

    const { data: product } = await supabase
      .from('products')
      .select('id, price, stock_quantity')
      .eq('id', item.productId)
      .single();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.stock_quantity < item.quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const { data: existingItem } = await findExistingItem(supabase, cart, item.productId);

    if (existingItem) {
      const nextQuantity = existingItem.quantity + item.quantity;
      const result = await updateExistingCartItem(
        supabase,
        existingItem.id,
        nextQuantity,
        Number(product.price),
        existingItem.unit_price !== null && existingItem.unit_price !== undefined
      );
      if (!result.success) {
        return result;
      }
    } else {
      const result = await insertCartItem(supabase, cart, item, Number(product.price));
      if (!result.success) {
        return result;
      }
    }

    await updateCartTotals(cart);

    revalidatePath('/shop/cart');
    revalidatePath('/shop');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('*, product:products(stock_quantity, price)')
      .eq('id', itemId)
      .single();

    if (!cartItem) {
      return { success: false, error: 'Item not found' };
    }

    if (cartItem.product.stock_quantity < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const result = await updateExistingCartItem(
      supabase,
      itemId,
      quantity,
      Number(cartItem.unit_price ?? cartItem.product.price),
      cartItem.unit_price !== null && cartItem.unit_price !== undefined
    );
    if (!result.success) {
      return result;
    }

    const cart = await resolveCart(supabase, user.id);
    if (cart) {
      await updateCartTotals(cart);
    }

    revalidatePath('/shop/cart');
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: 'Failed to update cart item' };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) {
      console.error('Error deleting cart item:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }

    const cart = await resolveCart(supabase, user.id);
    if (cart) {
      await updateCartTotals(cart);
    }

    revalidatePath('/shop/cart');
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const cart = await resolveCart(supabase, user.id);
    if (!cart) {
      return { success: true };
    }

    const deleteQuery =
      cart.mode === 'user_id'
        ? supabase.from('cart_items').delete().eq('user_id', cart.userId)
        : supabase.from('cart_items').delete().eq('cart_id', cart.id);

    const { error } = await deleteQuery;
    if (error) {
      console.error('Error clearing cart items:', error);
      return { success: false, error: 'Failed to clear cart' };
    }

    await updateCartTotals(cart);

    revalidatePath('/shop/cart');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}

/**
 * Get cart item count
 */
export async function getCartItemCount(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: true, count: 0 };

    const cart = await resolveCart(supabase, user.id);
    if (!cart) return { success: true, count: 0 };

    let countQuery = supabase.from('cart_items').select('*', { count: 'exact', head: true });
    if (cart.mode === 'user_id') {
      countQuery = countQuery.eq('user_id', cart.userId);
    } else {
      countQuery = countQuery.eq('cart_id', cart.id);
    }

    const { count, error } = await countQuery;

    if (error) {
      console.error('Error getting cart count:', error);
      return { success: false, count: 0, error: 'Failed to get cart count' };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error getting cart count:', error);
    return { success: false, count: 0, error: 'Failed to get cart count' };
  }
}
