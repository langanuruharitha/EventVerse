'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { editableTemplatesList } from '@/lib/templates/editable-templates';

function TemplateGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<'birthday' | 'wedding' | 'anniversary' | 'corporate'>('birthday');
  
  // Check URL parameter for category
  useEffect(() => {
    const category = searchParams.get('category') as 'birthday' | 'wedding' | 'anniversary' | 'corporate';
    if (category && ['birthday', 'wedding', 'anniversary', 'corporate'].includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);
  
  const filteredTemplates = editableTemplatesList.filter(t => t.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/invitations"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invitations
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Choose Your Template
          </h1>
          <p className="text-purple-100">
            Select a template and customize it for your event
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {(['birthday', 'wedding', 'anniversary', 'corporate'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category === 'birthday' && '🎂'} 
              {category === 'wedding' && '💍'} 
              {category === 'anniversary' && '💐'} 
              {category === 'corporate' && '🏢'} 
              {' '}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div>
          {/* Custom Design Option */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start from Scratch</h2>
            <button
              onClick={() => router.push(`/invitations/create/card?type=${selectedCategory}`)}
              className="w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 hover:shadow-xl transition-all border-2 border-dashed border-purple-300 text-left"
            >
              <div className="flex items-center gap-4">
                <Sparkles className="w-12 h-12 text-purple-600" />
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
              Choose a Template ({filteredTemplates.length} available)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => router.push(`/invitations/editor/${template.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all group text-left"
                >
                  {/* Template Preview */}
                  <div className="h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 relative flex items-center justify-center">
                    {/* Placeholder - In production, show actual template preview */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {selectedCategory === 'birthday' && '🎂'}
                        {selectedCategory === 'wedding' && '💍'}
                        {selectedCategory === 'anniversary' && '💐'}
                        {selectedCategory === 'corporate' && '🏢'}
                      </div>
                      <p className="text-sm text-gray-600 px-4">{template.name}</p>
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-lg font-bold mb-2">Click to Customize</p>
                        <p className="text-sm">Edit & Generate</p>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-2">
                      {template.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 capitalize">{template.category}</span>
                      {template.isPremium && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateGalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading templates...</p>
        </div>
      </div>
    }>
      <TemplateGalleryContent />
    </Suspense>
  );
}
