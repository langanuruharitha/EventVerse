import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/budget - List all budgets for user
export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get budgets with event details
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select(`
        *,
        events:event_id (
          event_name,
          event_date,
          event_type
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching budgets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch budgets' },
        { status: 500 }
      );
    }

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Budget API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/budget - Create new budget
export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      event_id, 
      total_budget, 
      template_id, 
      categories 
    } = body;

    // Validate required fields
    if (!event_id || !total_budget) {
      return NextResponse.json(
        { error: 'Event ID and total budget are required' },
        { status: 400 }
      );
    }

    // Check if budget already exists for this event
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('id')
      .eq('event_id', event_id)
      .single();

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this event' },
        { status: 400 }
      );
    }

    // Create budget
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .insert({
        event_id,
        user_id: user.id,
        total_budget,
        template_id,
        spent_amount: 0,
        remaining_amount: total_budget,
        status: 'active',
        currency: 'INR'
      })
      .select()
      .single();

    if (budgetError) {
      console.error('Error creating budget:', budgetError);
      return NextResponse.json(
        { error: 'Failed to create budget' },
        { status: 500 }
      );
    }

    // If template provided, create categories from template
    if (template_id && categories && categories.length > 0) {
      const categoryInserts = categories.map((cat: any) => ({
        budget_id: budget.id,
        category_name: cat.category_name,
        allocated_amount: (total_budget * cat.percentage) / 100,
        allocated_percentage: cat.percentage,
        spent_amount: 0,
        remaining_amount: (total_budget * cat.percentage) / 100
      }));

      const { error: catError } = await supabase
        .from('budget_categories')
        .insert(categoryInserts);

      if (catError) {
        console.error('Error creating categories:', catError);
      }
    }

    return NextResponse.json({ 
      budget,
      message: 'Budget created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Budget creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
