import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/events/actions';
import Link from 'next/link';

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
  const result = await getEvent(id);

  if (!result.success || !result.data) {
    if (result.error === 'Not authenticated') {
      redirect('/auth/signin');
    }
    notFound();
  }

  const event = result.data;
  const eventTypeInfo = EVENT_TYPES_MAP[event.event_type] || { name: 'Event', icon: '🎉' };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back link */}
        <Link
          href="/events/my-events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
        >
          ← Back to My Events
        </Link>

        {/* Success Banner */}
        <div className="bg-[#F0FFF4] border border-[#B5DCC5] rounded p-6 text-center shadow-sm">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold text-[#1A5C35] mb-1">
            Your Event Plan
          </h2>
          <p className="text-xs text-[#2C6E49] italic">
            Complete personalized plan generated for &quot;{event.event_name}&quot;
          </p>
        </div>

        {/* Event Summary (Regal Ornate Container) */}
        <div
          className="rounded border border-[#DDD0BB] p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1F1E1B 0%, #131211 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          {/* Subtle gold decoration */}
          <div className="absolute top-2 left-2 text-[#C5A880]/30 text-xs">❦</div>
          <div className="absolute top-2 right-2 text-[#C5A880]/30 text-xs">❦</div>

          <div className="relative space-y-4">
            <div className="text-5xl">{eventTypeInfo.icon}</div>
            <h2 className="text-3xl font-bold tracking-tight text-[#FAF6F0]">{event.event_name}</h2>
            <p className="text-[#C5A880] text-sm italic font-medium">
              {new Date(event.event_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-[#C5A880]/20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans mb-1">Guests</div>
              <div className="font-bold text-2xl text-white font-sans">{event.guest_count}</div>
            </div>
            <div className="text-center">
              <div className="text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans mb-1">Budget</div>
              <div className="font-bold text-2xl text-white font-sans">
                ₹{event.total_budget.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans mb-1">Total Tasks</div>
              <div className="font-bold text-2xl text-white font-sans">{event.total_tasks || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans mb-1">Shopping Items</div>
              <div className="font-bold text-2xl text-white font-sans">{event.total_shopping_items || 0}</div>
            </div>
          </div>
        </div>

        {/* Action Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Checklist', href: `/events/eventdetail/${event.id}/tasks`, icon: '📋' },
            { label: 'Decorations', href: `/events/eventdetail/${event.id}/decoration`, icon: '🎨' },
            { label: 'Guest List', href: `/events/eventdetail/${event.id}/guests`, icon: '👥' },
            { label: 'Budget Tracker', href: `/dashboard/budget`, icon: '💰' },
            { label: 'Shopping List', href: `/events/eventdetail/${event.id}/shopping`, icon: '🛒' },
          ].map((act, i) => (
            <Link
              key={i}
              href={act.href}
              className="flex flex-col items-center justify-center p-4 bg-white border border-[#DDD0BB] hover:border-[#8A1C2C] rounded shadow-sm hover:shadow transition-all group text-decoration-none"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{act.icon}</div>
              <span className="text-[10px] font-bold text-[#1F1E1B] uppercase tracking-wider font-sans text-center">{act.label}</span>
            </Link>
          ))}
        </div>

        {/* Budget Breakdown */}
        {event.ai_blueprint?.budgetBreakdown && event.ai_blueprint.budgetBreakdown.length > 0 && (
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>💰</span> Budget Allocation breakdown
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {event.ai_blueprint.budgetBreakdown.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#FAF6F0]/40 border border-[#DDD0BB]/30 rounded">
                  <div>
                    <div className="font-bold text-[#1F1E1B] text-sm">{item.category}</div>
                    <div className="text-[10px] text-[#1F1E1B]/50 font-sans mt-0.5">
                      {((item.amount / event.total_budget) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#8A1C2C] font-sans">
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
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>📅</span> Milestone Timeline
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {event.ai_blueprint.timeline.map((milestone: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="text-sm font-bold text-[#8A1C2C]">
                      Week {milestone.weeks_before}
                    </div>
                    <div className="text-[10px] text-[#1F1E1B]/40 uppercase font-sans">before</div>
                  </div>
                  <div className="flex-1 border-l-2 border-[#C5A880]/30 pl-4 space-y-1">
                    <div className="font-bold text-sm text-[#1F1E1B]">{milestone.milestone_name}</div>
                    <div className="text-xs text-[#1F1E1B]/70 italic leading-relaxed">{milestone.description}</div>
                    {milestone.tasks && milestone.tasks.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-3 list-disc text-[11px] text-[#1F1E1B]/50 leading-relaxed font-sans">
                        {milestone.tasks.map((task: string, taskIndex: number) => (
                          <li key={taskIndex}>{task}</li>
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
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>🛒</span> Shopping List Planner
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.ai_blueprint.shoppingList.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#FAF6F0]/40 border border-[#DDD0BB]/30 rounded">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#1F1E1B] text-sm truncate">{item.item_name}</div>
                      <div className="text-[10px] text-[#1F1E1B]/50 font-sans mt-0.5">
                        Qty: {item.quantity} • {item.category}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-sm text-[#8A1C2C] font-sans">
                        ₹{item.estimated_price.toLocaleString('en-IN')}
                      </div>
                      <span className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mt-1 border ${
                        item.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-800' :
                        item.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800' :
                        'bg-green-500/10 border-green-500/20 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vendor Recommendations */}
        {event.ai_blueprint?.vendorRecommendations && event.ai_blueprint.vendorRecommendations.length > 0 && (
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>🏪</span> Recommended Services
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.ai_blueprint.vendorRecommendations.map((vendor: any, index: number) => (
                  <div key={index} className="border border-[#DDD0BB] rounded p-5 bg-[#FAF6F0]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-[#1F1E1B]">{vendor.category}</div>
                      <div className="font-bold text-[#8A1C2C] font-sans text-base">
                        ₹{vendor.estimated_cost.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#1F1E1B]/50 italic font-sans">{vendor.vendor_type}</div>
                    {vendor.tips && vendor.tips.length > 0 && (
                      <ul className="space-y-1.5 border-t border-[#DDD0BB]/20 pt-3 text-[11px] text-[#1F1E1B]/60 leading-relaxed font-sans">
                        {vendor.tips.map((tip: string, tipIndex: number) => (
                          <li key={tipIndex} className="flex items-start gap-1.5">
                            <span className="text-[#C5A880]">✦</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decoration Ideas */}
        {event.ai_blueprint?.decorationIdeas && (
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>🎨</span> Creative Decoration Blueprints
              </h3>
            </div>
            <div className="p-6 text-xs text-[#1F1E1B]/70 italic whitespace-pre-line leading-relaxed">
              {event.ai_blueprint.decorationIdeas}
            </div>
          </div>
        )}

        {/* Food Suggestions */}
        {event.ai_blueprint?.foodSuggestions && (
          <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8]">
              <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>🍽️</span> Banquet Menu Curations
              </h3>
            </div>
            <div className="p-6 text-xs text-[#1F1E1B]/70 italic whitespace-pre-line leading-relaxed">
              {event.ai_blueprint.foodSuggestions}
            </div>
          </div>
        )}

        {/* Helpful Tips */}
        {event.ai_blueprint?.tips && event.ai_blueprint.tips.length > 0 && (
          <div className="bg-[#FFFDF8] border-2 border-double border-[#C5A880] rounded p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <span>💡</span> Orchestration Guidance & Tips
            </h3>
            <ul className="space-y-2.5 text-xs text-[#1F1E1B]/70 italic leading-relaxed">
              {event.ai_blueprint.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#C5A880]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
