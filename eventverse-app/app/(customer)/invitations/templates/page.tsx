'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

function InvitationTemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventType = searchParams.get('type') || 'birthday';
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, [eventType]);

  const fetchTemplates = async () => {
    setLoading(true);
    const supabase = createBrowserClient();
    
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('category', eventType)
      .order('rating_average', { ascending: false });
    
    if (error) {
      console.error('Error fetching templates:', error);
    }
    
    setTemplates(data || []);
    setLoading(false);
  };

  const handleTemplateSelect = (template: any) => {
    // Navigate to card creation with template ID
    router.push(`/invitations/create/card?templateId=${template.id}&type=${eventType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invitations
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Templates
          </h1>
          <p className="text-pink-100">
            Choose a template and customize it for your event
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Event Type Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['birthday', 'wedding', 'anniversary', 'corporate'].map((type) => (
            <Link
              key={type}
              href={`/invitations/templates?type=${type}`}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                eventType === type
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type === 'birthday' && '🎂'} 
              {type === 'wedding' && '💍'} 
              {type === 'anniversary' && '💐'} 
              {type === 'corporate' && '🏢'} 
              {' '}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Link>
          ))}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length > 0 ? (
          <div>
            {/* Custom Design Option */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start from Scratch</h2>
              <button
                onClick={() => router.push(`/invitations/create/card?type=${eventType}`)}
                className="w-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-8 hover:shadow-xl transition-all border-2 border-dashed border-pink-300 text-left"
              >
                <div className="flex items-center gap-4">
                  <Sparkles className="w-12 h-12 text-pink-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Custom Design</h3>
                    <p className="text-gray-600">Create your own design with AI assistance</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Template Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Choose a Template ({templates.length} available)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all group text-left"
                  >
                    {/* Template Preview */}
                    <div className="h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 relative">
                      {template.thumbnail_url ? (
                        <img
                          src={template.thumbnail_url}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          {eventType === 'birthday' && '🎂'}
                          {eventType === 'wedding' && '💍'}
                          {eventType === 'anniversary' && '💐'}
                          {eventType === 'corporate' && '🏢'}
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <p className="text-lg font-bold mb-2">Click to Customize</p>
                          <p className="text-sm">Edit details for your event</p>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-2">
                        {template.name}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 capitalize">{template.style}</span>
                        {template.is_premium && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">
                            Premium
                          </span>
                        )}
                      </div>
                      
                      {template.rating_average > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {template.rating_average.toFixed(1)}
                          </span>
                          {template.usage_count > 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({template.usage_count} uses)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Templates Yet</h3>
            <p className="text-gray-600 mb-6">
              Templates for {eventType} events will be added soon.
            </p>
            <button
              onClick={() => router.push(`/invitations/create/card?type=${eventType}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
            >
              <Sparkles className="w-5 h-5" />
              Create Custom Design
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvitationTemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <InvitationTemplatesContent />
    </Suspense>
  );
}
