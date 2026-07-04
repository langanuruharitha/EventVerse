'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Calendar, Users, DollarSign, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  guest_count: number;
}

interface CategoryAllocation {
  name: string;
  percentage: number;
  icon: string;
}

const EVENT_TYPE_TEMPLATES: Record<string, CategoryAllocation[]> = {
  birthday: [
    { name: 'Venue', percentage: 25, icon: '🏛️' },
    { name: 'Food & Catering', percentage: 30, icon: '🍽️' },
    { name: 'Decoration', percentage: 15, icon: '🎨' },
    { name: 'Cake', percentage: 8, icon: '🎂' },
    { name: 'Entertainment', percentage: 10, icon: '🎭' },
    { name: 'Return Gifts', percentage: 7, icon: '🎁' },
    { name: 'Photography', percentage: 5, icon: '📸' }
  ],
  wedding: [
    { name: 'Venue', percentage: 25, icon: '🏛️' },
    { name: 'Catering', percentage: 30, icon: '🍽️' },
    { name: 'Decoration', percentage: 12, icon: '🎨' },
    { name: 'Photography', percentage: 10, icon: '📸' },
    { name: 'Entertainment', percentage: 8, icon: '🎭' },
    { name: 'Attire & Jewelry', percentage: 8, icon: '👗' },
    { name: 'Invitations', percentage: 3, icon: '💌' },
    { name: 'Miscellaneous', percentage: 4, icon: '📦' }
  ],
  corporate: [
    { name: 'Venue', percentage: 30, icon: '🏢' },
    { name: 'Catering', percentage: 25, icon: '🍽️' },
    { name: 'AV Equipment', percentage: 15, icon: '🎤' },
    { name: 'Branding', percentage: 10, icon: '🎨' },
    { name: 'Speakers', percentage: 10, icon: '👨‍💼' },
    { name: 'Miscellaneous', percentage: 10, icon: '📦' }
  ],
  default: [
    { name: 'Venue', percentage: 25, icon: '🏛️' },
    { name: 'Food', percentage: 30, icon: '🍽️' },
    { name: 'Decoration', percentage: 15, icon: '🎨' },
    { name: 'Entertainment', percentage: 15, icon: '🎭' },
    { name: 'Miscellaneous', percentage: 15, icon: '📦' }
  ]
};

interface BudgetCreationWizardProps {
  onClose: () => void;
  onComplete: (budgetId: string) => void;
}

export default function BudgetCreationWizard({ onClose, onComplete }: BudgetCreationWizardProps) {
  const [step, setStep] = useState(1); // 1: Select Event, 2: Budget Details, 3: Review & Create
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Budget form data
  const [totalBudget, setTotalBudget] = useState('50000');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [categories, setCategories] = useState<CategoryAllocation[]>([]);
  
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      // Auto-calculate suggested budget based on guest count and event type
      const basePerPerson = selectedEvent.event_type === 'wedding' ? 500 : 300;
      const suggested = selectedEvent.guest_count * basePerPerson;
      setTotalBudget(suggested.toString());
      
      // Load category template
      const template = EVENT_TYPE_TEMPLATES[selectedEvent.event_type] || EVENT_TYPE_TEMPLATES.default;
      setCategories(template);
      
      // Estimate cost (85% of total budget as initial estimate)
      setEstimatedCost((suggested * 0.85).toString());
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Fetch events that don't have budgets yet
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, event_name, event_type, event_date, guest_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Filter out events that already have budgets
      const { data: budgetsData } = await supabase
        .from('budgets')
        .select('event_id');

      const eventsWithBudgets = new Set(budgetsData?.map(b => b.event_id) || []);
      const eventsWithoutBudgets = eventsData?.filter(e => !eventsWithBudgets.has(e.id)) || [];

      setEvents(eventsWithoutBudgets);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!selectedEvent) return;
    
    setCreating(true);
    try {
      const budget = parseFloat(totalBudget);
      const estimated = estimatedCost ? parseFloat(estimatedCost) : budget * 0.85;

      // Create budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          event_id: selectedEvent.id,
          total_budget: budget,
          estimated_cost: estimated,
          spent_amount: 0,
          remaining_amount: budget,
          status: 'active'
        })
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Create categories
      const categoryInserts = categories.map(cat => ({
        budget_id: budgetData.id,
        category_name: cat.name,
        allocated_amount: (budget * cat.percentage) / 100,
        allocated_percentage: cat.percentage,
        spent_amount: 0,
        remaining_amount: (budget * cat.percentage) / 100
      }));

      const { error: categoriesError } = await supabase
        .from('budget_categories')
        .insert(categoryInserts);

      if (categoriesError) throw categoriesError;

      // Success!
      onComplete(budgetData.id);
      
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="animate-spin text-6xl mb-4">💰</div>
            <p className="text-gray-600">Loading your events...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Create Budget</h2>
            <p className="text-sm text-purple-100">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              Select Event
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              Budget Details
            </span>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              Review
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Step 1: Select Event */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900">Select an Event</h3>
                <p className="text-gray-600">Choose an event to create a budget for</p>
              </div>

              {events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setStep(2);
                      }}
                      className={`p-6 border-2 rounded-xl text-left transition-all hover:border-purple-500 hover:shadow-lg ${
                        selectedEvent?.id === event.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{event.event_name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.event_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.guest_count} guests
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                              {event.event_type}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h4>
                  <p className="text-gray-600 mb-6">
                    All your events already have budgets, or you haven't created any events yet.
                  </p>
                  <Button
                    onClick={() => router.push('/events/new')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Create New Event
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Budget Details */}
          {step === 2 && selectedEvent && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Event Details</h4>
                <p className="text-sm text-purple-800">
                  <strong>{selectedEvent.event_name}</strong> • {selectedEvent.guest_count} guests • {new Date(selectedEvent.event_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Suggested: {formatCurrency(selectedEvent.guest_count * (selectedEvent.event_type === 'wedding' ? 500 : 300))} based on guest count
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="42000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-calculate (85% of total budget)
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Budget Allocation by Category</h4>
                <div className="space-y-3">
                  {categories.map((cat, idx) => {
                    const amount = (parseFloat(totalBudget) * cat.percentage) / 100;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{cat.name}</p>
                            <p className="text-xs text-gray-500">{cat.percentage}% of budget</p>
                          </div>
                        </div>
                        <p className="font-semibold text-purple-600">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && selectedEvent && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900">Review Your Budget</h3>
                <p className="text-gray-600">Everything looks good? Let's create it!</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Name:</span>
                      <span className="font-semibold">{selectedEvent.event_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Type:</span>
                      <span className="font-semibold capitalize">{selectedEvent.event_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">{new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Count:</span>
                      <span className="font-semibold">{selectedEvent.guest_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Total Budget:</span>
                      <span className="font-bold text-purple-600">{formatCurrency(parseFloat(totalBudget))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-semibold">
                        {formatCurrency(estimatedCost ? parseFloat(estimatedCost) : parseFloat(totalBudget) * 0.85)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categories:</span>
                      <span className="font-semibold">{categories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>✨ What happens next:</strong> Your budget will be created with {categories.length} categories. 
                  You can add expenses, track spending, and see AI-powered recommendations to stay on budget!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-4 flex-shrink-0">
          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              disabled={creating}
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedEvent}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateBudget}
              disabled={creating}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            >
              {creating ? (
                <>
                  <div className="animate-spin mr-2">⏳</div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Create Budget
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
