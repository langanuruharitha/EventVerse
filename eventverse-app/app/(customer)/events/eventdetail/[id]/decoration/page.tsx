// app/(customer)/events/eventdetail/[id]/decoration/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Sparkles, Palette, CheckSquare, ArrowLeft } from 'lucide-react';
import ThemeGallery from '@/components/decoration/ThemeGallery';
import DecorationGeneratorForm from '@/components/decoration/DecorationGeneratorForm';
import DecorationPlanDisplay from '@/components/decoration/DecorationPlanDisplay';

export default function DecorationPlanningPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'generate' | 'myplan'>('browse');
  const [existingPlan, setExistingPlan] = useState<any>(null);

  useEffect(() => {
    fetchEventAndPlan();
  }, [eventId]);

  const fetchEventAndPlan = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: eventData, error: eventError } = await supabase
        .from('events').select('*').eq('id', eventId).single();
      if (eventError) throw eventError;
      setEvent(eventData);

      const { data: planData } = await supabase
        .from('decoration_plans')
        .select(`*, decoration_items (*)`)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (planData) {
        setExistingPlan(planData);
        setActiveTab('myplan');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading decoration planner...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'browse' as const, label: 'Browse Themes', icon: <Palette className="w-3.5 h-3.5" /> },
    { key: 'generate' as const, label: 'AI Generate', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ...(existingPlan ? [{ key: 'myplan' as const, label: 'My Plan', icon: <CheckSquare className="w-3.5 h-3.5" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header Bar */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-[#FAF6F0] rounded border border-transparent hover:border-[#DDD0BB] transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A1C2C]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                <span>🎨</span> Decoration Planner
              </h1>
              <p className="text-[10px] text-[#1F1E1B]/40 italic font-sans mt-0.5">
                {event?.event_name || 'Your Event'} — Curated decoration planning
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 border-b border-[#EDE0CC]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 pb-2.5 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'text-[#8A1C2C] border-[#8A1C2C]'
                    : 'text-[#1F1E1B]/50 border-transparent hover:text-[#1F1E1B]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && <ThemeGallery />}

        {activeTab === 'generate' && (
          <DecorationGeneratorForm
            eventId={eventId}
            event={event}
            onPlanGenerated={(plan) => {
              setExistingPlan(plan);
              setActiveTab('myplan');
              fetchEventAndPlan();
            }}
          />
        )}

        {activeTab === 'myplan' && existingPlan && (
          <DecorationPlanDisplay
            plan={existingPlan}
            eventId={eventId}
            onUpdate={fetchEventAndPlan}
          />
        )}
      </div>
    </div>
  );
}
