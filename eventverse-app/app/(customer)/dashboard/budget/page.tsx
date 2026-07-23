'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, AlertCircle, DollarSign, Lightbulb, Calendar, PieChart } from 'lucide-react';
import ExpenseForm from '@/components/budget/ExpenseForm';
import BudgetCreationWizard from '@/components/budget/BudgetCreationWizard';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Budget {
  id: string;
  event_id: string;
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
  status: string;
  event?: {
    event_name: string;
    event_date: string;
  };
}

interface BudgetCategory {
  id: string;
  category_name: string;
  allocated_amount: number;
  spent_amount: number;
  remaining_amount: number;
  allocated_percentage: number;
}

interface Expense {
  id: string;
  expense_name: string;
  amount: number;
  expense_date: string;
  status: string;
  category_id: string;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetWizard, setShowBudgetWizard] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (selectedBudget) {
      fetchBudgetDetails(selectedBudget.id);
    }
  }, [selectedBudget]);

  const fetchBudgets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Fetch budgets with event details
      const { data: budgetsData, error } = await supabase
        .from('budgets')
        .select(`
          *,
          events:event_id (
            event_name,
            event_date
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBudgets(budgetsData || []);
      
      // Auto-select first budget if available
      if (budgetsData && budgetsData.length > 0) {
        setSelectedBudget(budgetsData[0]);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetDetails = async (budgetId: string) => {
    try {
      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('budget_id', budgetId)
        .order('allocated_amount', { ascending: false });

      if (catError) throw catError;
      setCategories(categoriesData || []);

      // Fetch recent expenses
      const { data: expensesData, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (expError) throw expError;
      setRecentExpenses(expensesData || []);

    } catch (error) {
      console.error('Error fetching budget details:', error);
    }
  };

  const getSpentPercentage = (spent: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((spent / total) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600 bg-red-50';
    if (percentage >= 90) return 'text-orange-600 bg-orange-50';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate Budget Health Score
  const calculateBudgetHealth = (spent: number, total: number) => {
    if (total === 0) return { score: 100, label: 'Excellent', color: 'green', emoji: '🟢' };
    
    const percentage = (spent / total) * 100;
    
    if (percentage > 100) {
      // Over budget - critical
      const overBy = percentage - 100;
      const score = Math.max(0, 59 - Math.floor(overBy));
      return { score, label: 'Critical', color: 'red', emoji: '🔴' };
    } else if (percentage >= 90) {
      // 90-100% - warning
      const score = Math.floor(60 + (100 - percentage) * 2);
      return { score, label: 'Warning', color: 'yellow', emoji: '🟡' };
    } else if (percentage >= 75) {
      // 75-90% - good
      const score = Math.floor(80 + (90 - percentage));
      return { score, label: 'Good', color: 'blue', emoji: '🔵' };
    } else {
      // Under 75% - excellent
      const score = Math.floor(95 + (75 - percentage) / 15);
      return { score: Math.min(100, score), label: 'Excellent', color: 'green', emoji: '🟢' };
    }
  };

  // AI Budget Optimizer
  const getAIRecommendations = (spent: number, total: number, categories: BudgetCategory[]) => {
    const recommendations: Array<{ text: string; savings: number; icon: string }> = [];
    const percentage = (spent / total) * 100;

    if (percentage > 100) {
      const overBy = spent - total;
      recommendations.push({
        text: `⚠️ You are exceeding your budget by ${formatCurrency(overBy)}`,
        savings: 0,
        icon: '⚠️'
      });
    }

    // Check overspending categories
    categories.forEach(cat => {
      const catPercent = (cat.spent_amount / cat.allocated_amount) * 100;
      if (catPercent > 90 && cat.allocated_amount > 5000) {
        recommendations.push({
          text: `Consider reducing ${cat.category_name} expenses`,
          savings: Math.floor(cat.allocated_amount * 0.15),
          icon: '💡'
        });
      }
    });

    // General suggestions
    if (percentage > 85) {
      recommendations.push({
        text: 'Look for vendor discounts and package deals',
        savings: Math.floor(total * 0.1),
        icon: '🎁'
      });
      recommendations.push({
        text: 'Consider DIY options for decorations',
        savings: Math.floor(total * 0.05),
        icon: '🎨'
      });
    }

    return recommendations;
  };

  // Get module breakdown (simulated based on categories)
  const getModuleBreakdown = (categories: BudgetCategory[]) => {
    const moduleMap: { [key: string]: { icon: string; total: number; percentage: number } } = {};
    const total = categories.reduce((sum, cat) => sum + cat.spent_amount, 0);

    categories.forEach(cat => {
      let icon = '📦';
      const name = cat.category_name.toLowerCase();
      
      if (name.includes('venue') || name.includes('hall')) icon = '🏛️';
      else if (name.includes('food') || name.includes('catering')) icon = '🍽️';
      else if (name.includes('decoration') || name.includes('decor')) icon = '🎨';
      else if (name.includes('cake')) icon = '🎂';
      else if (name.includes('entertainment') || name.includes('music') || name.includes('dj')) icon = '🎭';
      else if (name.includes('invitation') || name.includes('card')) icon = '💌';
      else if (name.includes('gift') || name.includes('return')) icon = '🎁';
      else if (name.includes('photo') || name.includes('video')) icon = '📸';

      const percentage = total > 0 ? (cat.spent_amount / total) * 100 : 0;
      
      moduleMap[cat.category_name] = {
        icon,
        total: cat.spent_amount,
        percentage
      };
    });

    return moduleMap;
  };

  const handleExpenseAdded = (newExpense: Expense) => {
    // Refresh budget data
    fetchBudgets();
    if (selectedBudget) {
      fetchBudgetDetails(selectedBudget.id);
    }
    setShowExpenseForm(false);
  };

  const handleViewAllExpenses = async () => {
    if (!selectedBudget) {
      alert('Please select a budget first');
      return;
    }

    try {
      const { data: allExpenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('budget_id', selectedBudget.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Create a modal or navigate to expenses page
      const expensesList = allExpenses?.map((exp: Expense) => 
        `${exp.expense_name}: ${formatCurrency(exp.amount)} (${new Date(exp.expense_date).toLocaleDateString()})`
      ).join('\n');

      alert(`All Expenses:\n\n${expensesList || 'No expenses found'}`);
      
    } catch (error) {
      console.error('Error fetching all expenses:', error);
      alert('Failed to fetch expenses');
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedBudget) {
      alert('Please select a budget first');
      return;
    }

    try {
      // Fetch all data needed for report
      const { data: allExpenses, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('budget_id', selectedBudget.id)
        .order('expense_date', { ascending: true });

      if (expError) throw expError;

      const { data: budgetCats, error: catError } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('budget_id', selectedBudget.id);

      if (catError) throw catError;

      // Generate CSV report
      const csvHeader = 'Date,Category,Expense Name,Amount,Status\n';
      const csvRows = allExpenses?.map((exp: any) => {
        const category = budgetCats?.find((cat: any) => cat.id === exp.category_id);
        return `${exp.expense_date},"${category?.category_name || 'N/A'}","${exp.expense_name}",${exp.amount},${exp.status}`;
      }).join('\n') || '';

      const csvContent = csvHeader + csvRows;
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-report-${selectedBudget.event?.event_name || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  const checkForEvents = async () => {
    const { data: eventsData } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    return (eventsData && eventsData.length > 0);
  };

  const createSimpleBudget = async (budgetAmount: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get first event
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, event_type, guest_count')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (!eventsData) {
        alert('Please create an event first!');
        router.push('/events/new');
        return;
      }

      const budget = parseFloat(budgetAmount);
      const estimated = budget * 0.85;

      // Create budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          event_id: eventsData.id,
          total_budget: budget,
          estimated_cost: estimated,
          spent_amount: 0,
          remaining_amount: budget,
          status: 'active'
        })
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Create default categories
      const categories = [
        { name: 'Venue', percentage: 25 },
        { name: 'Food & Catering', percentage: 30 },
        { name: 'Decoration', percentage: 15 },
        { name: 'Entertainment', percentage: 15 },
        { name: 'Miscellaneous', percentage: 15 }
      ];

      const categoryInserts = categories.map(cat => ({
        budget_id: budgetData.id,
        category_name: cat.name,
        allocated_amount: (budget * cat.percentage) / 100,
        allocated_percentage: cat.percentage,
        spent_amount: 0,
        remaining_amount: (budget * cat.percentage) / 100
      }));

      await supabase.from('budget_categories').insert(categoryInserts);

      // Refresh
      fetchBudgets();
      alert('Budget created successfully! 🎉');
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">💰</div>
          <p className="text-xl text-gray-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="text-center py-16">
            <div className="text-8xl mb-6">💰</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Budgets Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by creating a budget for one of your events to track expenses and stay on top of your spending.
            </p>
            <Button
              onClick={async () => {
                // Simple approach: redirect to create event, then they can create budget
                const hasEvents = await checkForEvents();
                if (hasEvents) {
                  // If user has events, show a simple prompt
                  const budgetAmount = prompt('Enter your total budget (₹):', '50000');
                  if (budgetAmount) {
                    await createSimpleBudget(budgetAmount);
                  }
                } else {
                  // Redirect to create event first
                  router.push('/events/new');
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const spentPercentage = selectedBudget 
    ? getSpentPercentage(selectedBudget.spent_amount, selectedBudget.total_budget)
    : 0;

  const budgetHealth = selectedBudget 
    ? calculateBudgetHealth(selectedBudget.spent_amount, selectedBudget.total_budget)
    : { score: 100, label: 'Excellent', color: 'green', emoji: '🟢' };

  const aiRecommendations = selectedBudget && categories.length > 0
    ? getAIRecommendations(selectedBudget.spent_amount, selectedBudget.total_budget, categories)
    : [];

  const moduleBreakdown = categories.length > 0 ? getModuleBreakdown(categories) : {};

  // Prepare chart data
  const pieChartData = categories.map(cat => ({
    name: cat.category_name,
    value: cat.spent_amount,
    percentage: cat.allocated_percentage
  }));

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-[#2C1810]">
                Budget Tracker
              </h1>
              <p className="text-sm text-[#1F1E1B]/70 italic">
                Manage your event expenses, allocate funds, and optimize your budget.
              </p>
            </div>
            <div>
              <Button
                onClick={() => setShowBudgetWizard(true)}
                className="py-3 px-6 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                  color: '#FAF0E0',
                  boxShadow: '0 4px 16px rgba(138,28,44,0.2)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Budget
              </Button>
            </div>
          </div>
        </div>

        {/* Budget Selector */}
        {budgets.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event Budget
            </label>
            <select
              value={selectedBudget?.id || ''}
              onChange={(e) => {
                const budget = budgets.find(b => b.id === e.target.value);
                setSelectedBudget(budget || null);
              }}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.event?.event_name || 'Unnamed Event'} - {formatCurrency(budget.total_budget)}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBudget && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Budget */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(selectedBudget.total_budget)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spent Amount */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Spent Amount</p>
                      <p className="text-3xl font-bold text-red-600">
                        {formatCurrency(selectedBudget.spent_amount)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{spentPercentage}% of budget</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remaining */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Remaining</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(selectedBudget.remaining_amount)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{100 - spentPercentage}% left</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Health Score & AI Optimizer Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Budget Health Score */}
              <Card className="bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{budgetHealth.emoji}</span>
                    Budget Health Score
                  </CardTitle>
                  <CardDescription>Overall financial health of your event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={
                            budgetHealth.color === 'green' ? '#10b981' :
                            budgetHealth.color === 'blue' ? '#3b82f6' :
                            budgetHealth.color === 'yellow' ? '#f59e0b' :
                            '#ef4444'
                          }
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${budgetHealth.score * 3.51} 351`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{budgetHealth.score}%</span>
                      </div>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold mb-2 ${
                        budgetHealth.color === 'green' ? 'text-green-600' :
                        budgetHealth.color === 'blue' ? 'text-blue-600' :
                        budgetHealth.color === 'yellow' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {budgetHealth.label}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {budgetHealth.label === 'Excellent' && 'Your spending is well under control!'}
                        {budgetHealth.label === 'Good' && 'You\'re on track, keep monitoring.'}
                        {budgetHealth.label === 'Warning' && 'Approaching budget limit, be cautious.'}
                        {budgetHealth.label === 'Critical' && 'Over budget! Immediate action needed.'}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          budgetHealth.color === 'green' ? 'bg-green-100 text-green-700' :
                          budgetHealth.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          budgetHealth.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {spentPercentage}% Used
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {formatCurrency(selectedBudget?.remaining_amount || 0)} Left
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Budget Optimizer */}
              <Card className="bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    AI Budget Optimizer
                  </CardTitle>
                  <CardDescription>Smart suggestions to optimize your spending</CardDescription>
                </CardHeader>
                <CardContent>
                  {aiRecommendations.length > 0 ? (
                    <div className="space-y-3">
                      {aiRecommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                          <span className="text-xl">{rec.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">{rec.text}</p>
                            {rec.savings > 0 && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                💰 Potential savings: {formatCurrency(rec.savings)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <p className="text-sm font-medium text-purple-900 flex items-center gap-2">
                          <span>✨</span>
                          Total Potential Savings: {formatCurrency(
                            aiRecommendations.reduce((sum, rec) => sum + rec.savings, 0)
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <span className="text-4xl mb-2 block">🎉</span>
                      <p className="text-gray-600">Great job! Your budget is well managed.</p>
                      <p className="text-sm text-gray-500 mt-1">No optimization suggestions at the moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Budget Distribution
                  </CardTitle>
                  <CardDescription>Spending breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <p>No data available for chart</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Module Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Module-wise Spending</CardTitle>
                  <CardDescription>Expenses organized by event modules</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(moduleBreakdown).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(moduleBreakdown).map(([name, data]) => (
                        <div key={name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 font-medium text-gray-900">
                              <span className="text-xl">{data.icon}</span>
                              {name}
                            </span>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(data.total)}</p>
                              <p className="text-xs text-gray-500">{data.percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${Math.min(data.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No module data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Expense Timeline */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Expense Timeline
                </CardTitle>
                <CardDescription>Track when your money is being spent</CardDescription>
              </CardHeader>
              <CardContent>
                {recentExpenses.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300"></div>
                    
                    <div className="space-y-6">
                      {recentExpenses.map((expense, idx) => (
                        <div key={expense.id} className="relative flex items-start gap-6 group">
                          {/* Timeline dot */}
                          <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                            expense.status === 'paid' ? 'bg-green-100' :
                            expense.status === 'pending' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <span className="text-2xl">
                              {expense.status === 'paid' ? '✓' : 
                               expense.status === 'pending' ? '⏳' : '📅'}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 group-hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{expense.expense_name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                expense.status === 'paid' ? 'bg-green-100 text-green-700' :
                                expense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {expense.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                {new Date(expense.expense_date).toLocaleDateString('en-IN', { 
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-xl font-bold text-purple-600">{formatCurrency(expense.amount)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">📅</span>
                    <p className="text-gray-600">No expenses recorded yet</p>
                    <p className="text-sm text-gray-500 mt-2">Your expense timeline will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Progress Bar */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Budget Progress</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(spentPercentage)}`}>
                    {spentPercentage >= 100 ? 'Over Budget' : 
                     spentPercentage >= 90 ? 'Near Limit' : 
                     spentPercentage >= 75 ? 'Caution' : 
                     'On Track'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      spentPercentage >= 100 ? 'bg-red-600' :
                      spentPercentage >= 90 ? 'bg-orange-500' :
                      spentPercentage >= 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formatCurrency(selectedBudget.spent_amount)} of {formatCurrency(selectedBudget.total_budget)} spent
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Categories</CardTitle>
                  <CardDescription>Spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categories.length > 0 ? (
                    <div className="space-y-4">
                      {categories.map((category) => {
                        const catPercentage = getSpentPercentage(category.spent_amount, category.allocated_amount);
                        return (
                          <div key={category.id}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{category.category_name}</span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(category.spent_amount)} / {formatCurrency(category.allocated_amount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  catPercentage >= 100 ? 'bg-red-500' :
                                  catPercentage >= 90 ? 'bg-orange-500' :
                                  'bg-purple-500'
                                }`}
                                style={{ width: `${Math.min(catPercentage, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{catPercentage}% used</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No categories yet</p>
                      <p className="text-sm mt-2">Categories will appear here once you set up your budget</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentExpenses.length > 0 ? (
                    <div className="space-y-4">
                      {recentExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{expense.expense_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(expense.expense_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              expense.status === 'paid' ? 'bg-green-100 text-green-700' :
                              expense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {expense.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No expenses recorded yet</p>
                      <p className="text-sm mt-2">Start tracking your event expenses here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowExpenseForm(true)}
                className="py-3 px-6 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                  color: '#FAF0E0',
                  boxShadow: '0 4px 16px rgba(138,28,44,0.2)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleViewAllExpenses()}
                className="px-5 py-3 rounded text-xs font-semibold uppercase tracking-wider border border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0] transition-all"
              >
                View All Expenses
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleGenerateReport()}
                className="px-5 py-3 rounded text-xs font-semibold uppercase tracking-wider border border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0] transition-all"
              >
                Generate Report
              </Button>
            </div>

            {/* Expense Form Modal */}
            {showExpenseForm && (
              <ExpenseForm
                budgetId={selectedBudget.id}
                categories={categories}
                onSubmit={handleExpenseAdded}
                onCancel={() => setShowExpenseForm(false)}
              />
            )}
          </>
        )}

        {/* Budget Creation Wizard */}
        {showBudgetWizard && (
          <BudgetCreationWizard
            onClose={() => setShowBudgetWizard(false)}
            onComplete={(budgetId) => {
              setShowBudgetWizard(false);
              fetchBudgets(); // Refresh to show new budget
            }}
          />
        )}
      </div>
    </div>
  );
}
