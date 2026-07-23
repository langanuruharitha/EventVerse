// app/(customer)/design-studio/page.tsx
'use client';

import { useState } from 'react';
import { Palette, Cake, Hand, Wand2 } from 'lucide-react';
import DecorationDesigner from '@/components/design-studio/DecorationDesigner';
import CakeDesigner from '@/components/design-studio/CakeDesigner';
import MehndiDesigner from '@/components/design-studio/MehndiDesigner';

export default function DesignStudioPage() {
  const [activeTab, setActiveTab] = useState<'decoration' | 'cake' | 'mehndi'>('decoration');

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header (Ornate Frame) */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 sm:p-10 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAF6F0] border border-[#C5A880]/30 rounded-full mb-1">
              <Wand2 className="w-8 h-8 text-[#8A1C2C]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C1810]">
              AI Design Studio
            </h1>
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A880]" />
              <span className="text-xs text-[#C5A880]">❦</span>
              <div className="h-px w-16 bg-gradient-to-r from-[#C5A880] to-transparent" />
            </div>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic max-w-xl mx-auto">
              "Create bespoke decorations, cake blueprints, and mehndi designs styled by advanced AI."
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { id: 'decoration', label: 'Decoration Design', icon: <Palette className="w-5 h-5" /> },
            { id: 'cake', label: 'Cake Design', icon: <Cake className="w-5 h-5" /> },
            { id: 'mehndi', label: 'Mehndi Design', icon: <Hand className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center px-6 py-3.5 rounded border text-sm font-semibold uppercase tracking-wider transition-all duration-300"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)' : '#FFFDF8',
                color: activeTab === tab.id ? '#FAF0E0' : '#7A6652',
                borderColor: activeTab === tab.id ? '#8A1C2C' : '#DDD0BB',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(138,28,44,0.2)' : 'none',
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Active Tool */}
        <div className="bg-white rounded border border-[#DDD0BB] shadow-sm p-6 sm:p-8">
          {activeTab === 'decoration' && <DecorationDesigner />}
          {activeTab === 'cake' && <CakeDesigner />}
          {activeTab === 'mehndi' && <MehndiDesigner />}
        </div>
      </div>
    </div>
  );
}
