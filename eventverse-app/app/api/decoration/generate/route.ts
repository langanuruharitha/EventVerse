// app/api/decoration/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateDecorationPlan, DecorationInput } from '@/lib/ai/decoration-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      eventId,
      eventType,
      theme,
      venueType,
      colors,
      budget,
      guestCount,
      style,
      preferences,
    } = body;

    // Validate required fields
    if (!eventId || !eventType || !venueType || !colors || !budget || !guestCount || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify event belongs to user
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, user_id')
      .eq('id', eventId)
      .single();

    if (eventError || !event || event.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    // Prepare input for AI generator
    const input: DecorationInput = {
      eventType,
      theme,
      venueType,
      colors,
      budget,
      guestCount,
      style,
      preferences,
    };

    // Generate decoration plan using AI
    const decorationPlan = await generateDecorationPlan(input);

    // Save decoration plan to database
    const { data: savedPlan, error: saveError } = await supabase
      .from('decoration_plans')
      .insert({
        event_id: eventId,
        plan_name: `${decorationPlan.theme.name} - ${eventType}`,
        ai_generated: true,
        generation_prompt: JSON.stringify(input),
        selected_colors: decorationPlan.theme.colorPalette,
        venue_type: venueType,
        budget_range: budget,
        decoration_areas: decorationPlan.areas,
        color_scheme: decorationPlan.moodBoard.colorSwatches,
        estimated_cost: decorationPlan.costBreakdown.total,
        setup_time_hours: decorationPlan.timeline.totalSetupHours,
        diy_complexity: preferences?.diyFriendly ? 'easy' : 'medium',
        status: 'draft',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving decoration plan:', saveError);
      return NextResponse.json(
        { error: 'Failed to save decoration plan' },
        { status: 500 }
      );
    }

    // Save decoration items
    if (savedPlan && decorationPlan.itemChecklist.length > 0) {
      const items = decorationPlan.itemChecklist.map(item => ({
        plan_id: savedPlan.id,
        category: item.category,
        item_name: item.itemName,
        description: item.description,
        quantity: item.quantity,
        estimated_cost: item.estimatedCost,
        sourcing_type: item.sourcingType,
        diy_instructions: item.diyInstructions || null,
        materials_needed: item.materialsNeeded || null,
        difficulty_level: item.difficultyLevel || 'medium',
        time_required_minutes: item.timeRequired || 60,
        status: 'planned',
      }));

      const { error: itemsError } = await supabase
        .from('decoration_items')
        .insert(items);

      if (itemsError) {
        console.error('Error saving decoration items:', itemsError);
      }
    }

    // Return complete decoration plan
    return NextResponse.json({
      success: true,
      plan: decorationPlan,
      savedPlanId: savedPlan.id,
    });

  } catch (error) {
    console.error('Error generating decoration plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
