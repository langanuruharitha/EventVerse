// components/decoration/DecorationPlanDisplay.tsx
'use client';

import { useState } from 'react';
import { Palette, CheckCircle, Circle, DollarSign, Clock, Sparkles, Download } from 'lucide-react';
import { downloadSpecSheet } from '@/lib/utils/download-helper';

interface Props {
  plan: any;
  eventId: string;
  onUpdate: () => void;
}

export default function DecorationPlanDisplay({ plan, eventId, onUpdate }: Props) {
  const [activeArea, setActiveArea] = useState<string>('all');

  const areas = ['entrance', 'stage', 'dining', 'ceiling', 'walls'];
  
  const getAreaIcon = (area: string) => {
    const icons: any = {
      entrance: '🚪',
      stage: '🎭',
      dining: '🍽️',
      ceiling: '✨',
      walls: '🖼️',
    };
    return icons[area] || '📦';
  };

  const items = plan.decoration_items || [];
  const filteredItems = activeArea === 'all'
    ? items
    : items.filter((item: any) => item.category === activeArea);

  const totalCost = items.reduce((sum: number, item: any) => sum + (item.estimated_cost || 0), 0);
  const completedItems = items.filter((item: any) => item.status === 'completed').length;

  const handleExportBlueprint = () => {
    const details: Record<string, any> = {
      'Plan Name': plan.plan_name,
      'Budget Range': `₹${plan.budget_range?.toLocaleString('en-IN')}`,
      'Estimated Total Cost': `₹${totalCost?.toLocaleString('en-IN')}`,
      'Setup Time': `${plan.setup_time_hours || 0} Hours`,
      'Total Items': items.length,
      'Completed Items': `${completedItems} of ${items.length}`,
      'Selected Colors': plan.selected_colors ? Object.values(plan.selected_colors).join(', ') : 'Default Palette',
      'Decoration Items Checklist': items.map((i: any) => `[${i.status.toUpperCase()}] ${i.item_name} (${i.category}) - ₹${i.estimated_cost || 0} - ${i.description || ''}`)
    };

    const filename = `${(plan.plan_name || 'decoration-plan').toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.txt`;
    downloadSpecSheet(plan.plan_name || 'Decoration Event Plan', 'Theme Plan', details, filename);
  };

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{plan.plan_name}</h2>
            <p className="text-purple-100">
              {plan.ai_generated && (
                <span className="inline-flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Generated Plan
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleExportBlueprint}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center shadow"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Blueprint
          </button>
        </div>

        {/* Color Palette */}
        {plan.selected_colors && (
          <div className="mt-6">
            <p className="text-purple-100 text-sm mb-2">Color Palette</p>
            <div className="flex space-x-2">
              {Object.values(plan.selected_colors).map((color: any, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-lg border-2 border-white shadow-lg"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(plan.budget_range / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(plan.estimated_cost / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Setup Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {plan.setup_time_hours}h
              </p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.length > 0 ? Math.round((completedItems / items.length) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Area Filter */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveArea('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeArea === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Areas ({items.length})
          </button>
          {areas.map(area => {
            const areaItems = items.filter((item: any) => item.category === area);
            return (
              <button
                key={area}
                onClick={() => setActiveArea(area)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeArea === area
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getAreaIcon(area)} {area.charAt(0).toUpperCase() + area.slice(1)} ({areaItems.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Checklist */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Decoration Items Checklist</h3>
          <p className="text-gray-600 text-sm mt-1">
            {completedItems} of {items.length} items completed
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No items found for this area
            </div>
          ) : (
            filteredItems.map((item: any) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={async () => {
                      // Toggle item status
                      const newStatus = item.status === 'completed' ? 'planned' : 'completed';
                      // Update in database
                      const supabase = (await import('@/lib/supabase/client')).createBrowserClient();
                      await supabase
                        .from('decoration_items')
                        .update({ status: newStatus })
                        .eq('id', item.id);
                      onUpdate();
                    }}
                    className="mt-1"
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500 fill-current" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.item_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-xs text-gray-500">
                            {item.sourcing_type === 'diy' ? '🛠️ DIY' : 
                             item.sourcing_type === 'rental' ? '🔄 Rental' : '🛒 Purchase'}
                          </span>
                          {item.difficulty_level && (
                            <span className="text-xs text-gray-500">
                              Difficulty: {item.difficulty_level}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.estimated_cost?.toLocaleString('en-IN')}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'sourced' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {item.diy_instructions && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">DIY Instructions:</p>
                        <p className="text-xs text-blue-800">{item.diy_instructions}</p>
                        {item.materials_needed && item.materials_needed.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-blue-900 mb-1">Materials:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.materials_needed.map((material: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
