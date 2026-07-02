'use server';

import { createServerClient } from '@/lib/supabase/server';
import { geminiService } from '@/lib/ai/gemini-service';
import { calculateHealthScore } from '@/lib/events/health-score';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type {
  CreateEventFormData,
  Event,
  EventWithStats,
  APIResponse,
  EventType,
} from '@/types/events';

/**
 * Get all event types
 */
export async function getEventTypes(): Promise<APIResponse<EventType[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching event types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch event types',
    };
  }
}

/**
 * Create a new event with AI blueprint generation
 */
export async function createEvent(
  formData: CreateEventFormData
): Promise<APIResponse<{ eventId: string }>> {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    console.log('🎯 Creating event for user:', user.id);
    console.log('📝 Event data:', formData);

    // Generate AI blueprint
    console.log('🤖 Generating AI blueprint...');
    const startTime = Date.now();

    const aiResult = await geminiService.generateEventBlueprint({
      event_type: formData.event_type,
      guest_count: formData.guest_count,
      total_budget: formData.total_budget,
      event_date: formData.event_date.toISOString().split('T')[0],
      theme: formData.theme,
      venue_types: formData.venue_types,
      location: formData.location_preference,
      event_timing: formData.event_timing,
      special_requirements: formData.special_requirements,
      selected_addons: formData.selected_addons,
    });

    console.log(`✅ AI blueprint generated in ${aiResult.responseTimeMs}ms`);

    // Create event record
    const eventData = {
      user_id: user.id,
      event_name: formData.event_name,
      event_type: formData.event_type,
      event_date: formData.event_date.toISOString().split('T')[0],
      event_time: formData.event_time || null,
      guest_count: formData.guest_count,
      total_budget: formData.total_budget,
      theme: formData.theme || null,
      venue_types: formData.venue_types || null,
      location_preference: formData.location_preference || null,
      event_timing: formData.event_timing || null,
      color_scheme: formData.color_scheme || null,
      special_requirements: formData.special_requirements || null,
      selected_addons: formData.selected_addons || null,
      ai_blueprint: aiResult.blueprint,
      ai_model_version: 'gemini-pro',
      ai_generation_time_ms: aiResult.responseTimeMs,
      status: 'planning',
      completion_percentage: 0,
    };

    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (eventError) throw eventError;

    console.log('✅ Event created:', event.id);

    // Log AI interaction
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      event_id: event.id,
      interaction_type: 'blueprint_generation',
      input_data: formData,
      ai_response: aiResult.blueprint,
      model_version: 'gemini-pro',
      tokens_used: aiResult.tokensUsed,
      response_time_ms: aiResult.responseTimeMs,
      success: true,
    });

    // Create initial tasks from AI blueprint
    if (aiResult.blueprint.tasks && aiResult.blueprint.tasks.length > 0) {
      const tasks = aiResult.blueprint.tasks.map((task) => {
        const eventDate = new Date(formData.event_date);
        const dueDate = new Date(eventDate);
        dueDate.setDate(dueDate.getDate() - task.weeks_before * 7);

        return {
          event_id: event.id,
          category: task.category,
          task_name: task.task_name,
          description: task.description,
          priority: task.priority,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending',
        };
      });

      await supabase.from('event_tasks').insert(tasks);
      console.log(`✅ Created ${tasks.length} tasks`);
    }

    // Create timeline milestones
    if (aiResult.blueprint.timeline && aiResult.blueprint.timeline.length > 0) {
      const milestones = aiResult.blueprint.timeline.map((milestone, index) => {
        const eventDate = new Date(formData.event_date);
        const milestoneDate = new Date(eventDate);
        milestoneDate.setDate(milestoneDate.getDate() - milestone.weeks_before * 7);

        return {
          event_id: event.id,
          milestone_name: milestone.milestone_name,
          milestone_date: milestoneDate.toISOString().split('T')[0],
          description: milestone.description,
          category: milestone.category,
          display_order: index,
        };
      });

      await supabase.from('event_timeline').insert(milestones);
      console.log(`✅ Created ${milestones.length} timeline milestones`);
    }

    // Create shopping list items
    if (aiResult.blueprint.shoppingList && aiResult.blueprint.shoppingList.length > 0) {
      const shoppingItems = aiResult.blueprint.shoppingList.map((item) => ({
        event_id: event.id,
        category: item.category,
        item_name: item.item_name,
        quantity: item.quantity,
        estimated_price: item.estimated_price,
        priority: item.priority,
        purchase_link: item.where_to_buy || null,
      }));

      await supabase.from('event_shopping_items').insert(shoppingItems);
      console.log(`✅ Created ${shoppingItems.length} shopping items`);
    }

    revalidatePath('/events');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: { eventId: event.id },
      message: 'Event created successfully!',
    };
  } catch (error) {
    console.error('❌ Error creating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
    };
  }
}

/**
 * Get user's events
 */
export async function getUserEvents(): Promise<APIResponse<EventWithStats[]>> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('event_overview')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events',
    };
  }
}

/**
 * Get a single event with stats
 */
export async function getEvent(eventId: string): Promise<APIResponse<EventWithStats>> {
  try {
    console.log('🔍 getEvent called for ID:', eventId);
    
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ User not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    console.log('✅ User authenticated:', user.id);

    // Query events table directly for maximum reliability
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    console.log('📊 Query result:', { 
      hasData: !!eventData, 
      hasError: !!eventError,
      errorCode: eventError?.code,
      errorMessage: eventError?.message 
    });

    if (eventError) {
      console.error('❌ Database error:', JSON.stringify(eventError, null, 2));
      throw eventError;
    }

    if (!eventData) {
      console.error('❌ No event data returned for ID:', eventId);
      throw new Error('Event not found');
    }

    console.log('✅ Event data fetched, has ai_blueprint:', !!eventData.ai_blueprint);

    // Calculate days until event
    const eventDate = new Date(eventData.event_date);
    const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    // Get task stats
    const { data: tasks } = await supabase
      .from('event_tasks')
      .select('status')
      .eq('event_id', eventId);

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter((t) => t.status === 'completed').length || 0;

    // Get shopping stats
    const { data: shopping } = await supabase
      .from('event_shopping_items')
      .select('is_purchased')
      .eq('event_id', eventId);

    const totalItems = shopping?.length || 0;
    const purchasedItems = shopping?.filter((i) => i.is_purchased).length || 0;

    // Build EventWithStats object
    const data: EventWithStats = {
      ...eventData,
      completed_tasks: completedTasks,
      total_tasks: totalTasks,
      purchased_items: purchasedItems,
      total_shopping_items: totalItems,
      spent_amount: 0,
      remaining_budget: eventData.total_budget,
      days_until_event: daysUntil,
      health_score: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100,
    };

    console.log('✅ Successfully fetched event:', eventId);
    console.log('📊 Stats - Tasks:', totalTasks, 'Shopping:', totalItems, 'Blueprint:', !!data.ai_blueprint);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in getEvent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch event',
    };
  }
}

/**
 * Update event
 */
export async function updateEvent(
  eventId: string,
  updates: Partial<Event>
): Promise<APIResponse<Event>> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/events');
    revalidatePath('/dashboard');

    return { success: true, data, message: 'Event updated successfully' };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event',
    };
  }
}

/**
 * Delete event
 */
export async function deleteEvent(eventId: string): Promise<APIResponse<null>> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/events');
    revalidatePath('/dashboard');

    return { success: true, data: null, message: 'Event deleted successfully' };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
    };
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
): Promise<APIResponse<null>> {
  try {
    const supabase = await createServerClient();

    const updates: any = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('event_tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) throw error;

    revalidatePath('/events');

    return { success: true, data: null, message: 'Task updated successfully' };
  } catch (error) {
    console.error('Error updating task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update task',
    };
  }
}

/**
 * Update shopping item purchased status
 */
export async function updateShoppingItemStatus(
  itemId: string,
  isPurchased: boolean
): Promise<APIResponse<null>> {
  try {
    const supabase = await createServerClient();

    const updates: any = { is_purchased: isPurchased };
    if (isPurchased) {
      updates.purchased_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('event_shopping_items')
      .update(updates)
      .eq('id', itemId);

    if (error) throw error;

    revalidatePath('/events');

    return {
      success: true,
      data: null,
      message: isPurchased ? 'Item marked as purchased' : 'Item marked as not purchased',
    };
  } catch (error) {
    console.error('Error updating shopping item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update shopping item',
    };
  }
}
