// app/(customer)/design-studio/page.tsx
'use client';

import { useState } from 'react';
import { Palette, Cake, Hand, Sparkles, Upload, Wand2 } from 'lucide-react';
import DecorationDesigner from '@/components/design-studio/DecorationDesigner';
import CakeDesigner from '@/components/design-studio/CakeDesigner';
import MehndiDesigner from '@/components/design-studio/MehndiDesigner';

export default function DesignStudioPage() {
  const [activeTab, setActiveTab] = useState<'decoration' | 'cake' | 'mehndi'>('decoration');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-3">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Design Studio
            </h1>
            <p className="text-gray-600 text-lg">
              Create stunning designs with AI - Decoration, Cakes & Mehndi
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('decoration')}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activeTab === 'decoration'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <Palette className="w-6 h-6 mr-3" />
              Decoration Design
            </button>

            <button
              onClick={() => setActiveTab('cake')}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activeTab === 'cake'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <Cake className="w-6 h-6 mr-3" />
              Cake Design
            </button>

            <button
              onClick={() => setActiveTab('mehndi')}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                activeTab === 'mehndi'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <Hand className="w-6 h-6 mr-3" />
              Mehndi Design
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'decoration' && <DecorationDesigner />}
        {activeTab === 'cake' && <CakeDesigner />}
        {activeTab === 'mehndi' && <MehndiDesigner />}
      </div>
    </div>
  );
}
