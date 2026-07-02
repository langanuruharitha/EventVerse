import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/budget/[id] - Get budget details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: budgetId } = await params;

    // Get budget with event details
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select(`
        *,
        events:event_id (
          event_name,
          event_date,
          event_type
        )
      `)
      .eq('id', budgetId)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    // Get categories
    const { data: categories } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('budget_id', budgetId)
      .order('allocated_amount', { ascending: false });

    // Get expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('budget_id', budgetId)
      .order('created_at', { ascending: false });

    // Get alerts
    const { data: alerts } = await supabase
      .from('budget_alerts')
      .select('*')
      .eq('budget_id', budgetId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      budget,
      categories: categories || [],
      expenses: expenses || [],
      alerts: alerts || []
    });

  } catch (error) {
    console.error('Budget detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/budget/[id] - Update budget
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: budgetId } = await params;
    const body = await request.json();

    const { data: budget, error } = await supabase
      .from('budgets')
      .update(body)
      .eq('id', budgetId)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error);
      return NextResponse.json(
        { error: 'Failed to update budget' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      budget,
      message: 'Budget updated successfully' 
    });

  } catch (error) {
    console.error('Budget update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/budget/[id] - Delete budget
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: budgetId } = await params;

    // Delete budget (cascade will handle related records)
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId);

    if (error) {
      console.error('Error deleting budget:', error);
      return NextResponse.json(
        { error: 'Failed to delete budget' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Budget deleted successfully' 
    });

  } catch (error) {
    console.error('Budget delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
