// app/(customer)/events/eventdetail/[id]/decoration/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Sparkles, Palette, CheckSquare, TrendingUp, ArrowLeft } from 'lucide-react';
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

      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Check if decoration plan exists
      const { data: planData, error: planError } = await supabase
        .from('decoration_plans')
        .select(`
          *,
          decoration_items (*)
        `)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading decoration planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Palette className="w-8 h-8 text-purple-600 mr-3" />
                  Decoration Planner
                </h1>
                <p className="text-gray-600 mt-1">
                  {event?.event_name || 'Your Event'} - AI-powered decoration planning
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-3 px-4 font-medium transition-all ${
                activeTab === 'browse'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Browse Themes
              </span>
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`pb-3 px-4 font-medium transition-all ${
                activeTab === 'generate'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </span>
            </button>
            {existingPlan && (
              <button
                onClick={() => setActiveTab('myplan')}
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'myplan'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  My Plan
                </span>
              </button>
            )}
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
