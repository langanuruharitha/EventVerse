import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST /api/budget/expense - Add new expense
export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      budget_id,
      category_id,
      expense_name,
      amount,
      expense_date,
      vendor_name,
      payment_method,
      notes,
      status = 'paid'
    } = body;

    // Validate required fields
    if (!budget_id || !category_id || !expense_name || !amount) {
      return NextResponse.json(
        { error: 'Budget ID, category, name, and amount are required' },
        { status: 400 }
      );
    }

    // Create expense
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        budget_id,
        category_id,
        expense_name,
        amount,
        expense_date: expense_date || new Date().toISOString(),
        vendor_name,
        payment_method,
        notes,
        status,
        created_by: user.id
      })
      .select()
      .single();

    if (expenseError) {
      console.error('Error creating expense:', expenseError);
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      );
    }

    // Update budget amounts
    const { data: budget, error: budgetFetchError } = await supabase
      .from('budgets')
      .select('spent_amount, remaining_amount, total_budget')
      .eq('id', budget_id)
      .single();

    if (!budgetFetchError && budget) {
      const newSpent = budget.spent_amount + amount;
      const newRemaining = budget.total_budget - newSpent;

      await supabase
        .from('budgets')
        .update({
          spent_amount: newSpent,
          remaining_amount: newRemaining,
          status: newRemaining < 0 ? 'overbudget' : 'active'
        })
        .eq('id', budget_id);
    }

    // Update category amounts
    const { data: category, error: categoryFetchError } = await supabase
      .from('budget_categories')
      .select('spent_amount, remaining_amount, allocated_amount')
      .eq('id', category_id)
      .single();

    if (!categoryFetchError && category) {
      const newCatSpent = category.spent_amount + amount;
      const newCatRemaining = category.allocated_amount - newCatSpent;

      await supabase
        .from('budget_categories')
        .update({
          spent_amount: newCatSpent,
          remaining_amount: newCatRemaining
        })
        .eq('id', category_id);

      // Create alert if category is near or over budget
      const spentPercentage = (newCatSpent / category.allocated_amount) * 100;
      if (spentPercentage >= 90) {
        await supabase
          .from('budget_alerts')
          .insert({
            budget_id,
            alert_type: spentPercentage >= 100 ? 'category_exceeded' : 'category_warning',
            severity: spentPercentage >= 100 ? 'high' : 'medium',
            message: `Category spending at ${Math.round(spentPercentage)}%`,
            threshold_percentage: 90,
            current_percentage: spentPercentage
          });
      }
    }

    return NextResponse.json({ 
      expense,
      message: 'Expense added successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Expense creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
