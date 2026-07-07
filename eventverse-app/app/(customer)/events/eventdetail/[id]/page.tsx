import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/events/actions';
import Link from 'next/link';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EVENT_TYPES_MAP: Record<string, { name: string; icon: string }> = {
  'birthday': { name: 'Birthday Party', icon: '🎂' },
  'wedding': { name: 'Wedding Ceremony', icon: '💍' },
  'engagement': { name: 'Engagement Party', icon: '💕' },
  'baby-shower': { name: 'Baby Shower', icon: '👶' },
  'anniversary': { name: 'Anniversary', icon: '💐' },
  'housewarming': { name: 'Housewarming', icon: '🏠' },
  'corporate': { name: 'Corporate Event', icon: '🏢' },
  'festival': { name: 'Festival Celebration', icon: '🎆' },
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  console.log('📍 Event detail page - ID:', id);
  
  const result = await getEvent(id);
  
  console.log('📊 Event fetch result:', { 
    success: result.success, 
    hasData: !!result.data,
    error: result.error,
    hasBlueprint: result.data?.ai_blueprint ? true : false
  });

  if (!result.success || !result.data) {
    console.error('❌ Failed to get event:', result.error);
    if (result.error === 'Not authenticated') {
      redirect('/auth/signin');
    }
    notFound();
  }

  const event = result.data;
  const eventTypeInfo = EVENT_TYPES_MAP[event.event_type] || { name: 'Event', icon: '🎉' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/events/my-events"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
        >
          ← Back to My Events
        </Link>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Your Event Plan
          </h2>
          <p className="text-green-700">
            Complete personalized plan for "{event.event_name}"
          </p>
        </div>

        {/* Event Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{eventTypeInfo.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{event.event_name}</h2>
            <p className="text-purple-100">
              {new Date(event.event_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-purple-200 text-sm">Guests</div>
              <div className="font-bold text-2xl">{event.guest_count}</div>
            </div>
            <div className="text-center">
              <div className="text-purple-200 text-sm">Budget</div>
              <div className="font-bold text-2xl">
                ₹{event.total_budget.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-purple-200 text-sm">Tasks</div>
              <div className="font-bold text-2xl">{event.total_tasks || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-purple-200 text-sm">Shopping Items</div>
              <div className="font-bold text-2xl">{event.total_shopping_items || 0}</div>
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        {event.ai_blueprint?.budgetBreakdown && event.ai_blueprint.budgetBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              💰 Budget Breakdown
            </h3>
            <div className="space-y-4">
              {event.ai_blueprint.budgetBreakdown.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-500">
                      {((item.amount / event.total_budget) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {event.ai_blueprint?.timeline && event.ai_blueprint.timeline.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📅 Timeline & Milestones
            </h3>
            <div className="space-y-6">
              {event.ai_blueprint.timeline.map((milestone: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="text-lg font-bold text-purple-600">
                      Week {milestone.weeks_before}
                    </div>
                    <div className="text-xs text-gray-500">before</div>
                  </div>
                  <div className="flex-1 border-l-4 border-purple-200 pl-4">
                    <div className="font-bold text-lg text-gray-900">{milestone.milestone_name}</div>
                    <div className="text-gray-600 mt-1">{milestone.description}</div>
                    {milestone.tasks && milestone.tasks.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {milestone.tasks.map((task: string, taskIndex: number) => (
                          <li key={taskIndex} className="text-sm text-gray-500 flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping List */}
        {event.ai_blueprint?.shoppingList && event.ai_blueprint.shoppingList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🛒 Shopping List
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.ai_blueprint.shoppingList.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.item_name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} • {item.category}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-purple-600">
                      ₹{item.estimated_price.toLocaleString('en-IN')}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded mt-1 ${
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : item.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Recommendations */}
        {event.ai_blueprint?.vendorRecommendations && event.ai_blueprint.vendorRecommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🏪 Vendor Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.ai_blueprint.vendorRecommendations.map((vendor: any, index: number) => (
                <div key={index} className="border-2 border-purple-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-lg text-gray-900">{vendor.category}</div>
                    <div className="font-bold text-xl text-purple-600">
                      ₹{vendor.estimated_cost.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{vendor.vendor_type}</div>
                  {vendor.tips && vendor.tips.length > 0 && (
                    <ul className="space-y-2">
                      {vendor.tips.map((tip: string, tipIndex: number) => (
                        <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-lg">💡</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decoration Ideas */}
        {event.ai_blueprint?.decorationIdeas && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🎨 Decoration Ideas
            </h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.ai_blueprint.decorationIdeas}
            </div>
          </div>
        )}

        {/* Food Suggestions */}
        {event.ai_blueprint?.foodSuggestions && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🍽️ Food Menu Suggestions
            </h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.ai_blueprint.foodSuggestions}
            </div>
          </div>
        )}

        {/* Helpful Tips */}
        {event.ai_blueprint?.tips && event.ai_blueprint.tips.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-2">
              💡 Helpful Tips
            </h3>
            <ul className="space-y-3">
              {event.ai_blueprint.tips.map((tip: string, index: number) => (
                <li key={index} className="text-gray-700 flex items-start gap-3">
                  <span className="text-yellow-600 text-xl">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            href={`/events/eventdetail/${event.id}/tasks`}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
          >
            📋 Task Checklist
          </Link>
          <Link
            href={`/events/eventdetail/${event.id}/decoration`}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            🎨 Decoration Planner
          </Link>
          <Link
            href={`/events/eventdetail/${event.id}/guests`}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            👥 Guest List
          </Link>
          <Link
            href={`/dashboard/budget`}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            💰 Budget Tracker
          </Link>
          <Link
            href={`/events/eventdetail/${event.id}/shopping`}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            🛒 Shopping List
          </Link>
        </div>
      </div>
    </div>
  );
}
