'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, DollarSign, Eye, Star, CheckCircle2, Calendar, 
  ArrowUpRight, Users, Award, ShieldCheck 
} from 'lucide-react';

export default function VendorAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'30days' | '6months' | '1year'>('30days');

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Growth Analytics & Performance Center 📈</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track customer profile views, lead conversion rates, and revenue forecasts
          </p>
        </div>

        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm text-xs font-semibold">
          {[
            { id: '30days', label: 'Last 30 Days' },
            { id: '6months', label: '6 Months' },
            { id: '1year', label: '1 Year' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id as any)}
              className={`px-3 py-1.5 rounded transition ${
                timeframe === t.id ? 'bg-[#8A1C2C] text-[#FAF0E0]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Profile Views</span>
            <Eye className="w-4 h-4 text-[#8A1C2C]" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-serif">1,482</p>
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last period
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Quote Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-serif">68.2%</p>
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Top 5% among vendors
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Monthly Earnings</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-serif">₹3,45,000</p>
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% growth
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Client Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-serif">4.9 / 5.0</p>
          <p className="text-xs text-gray-500 font-semibold">Based on 48 reviews</p>
        </div>
      </div>

      {/* Monthly Revenue Chart Graphic */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 font-serif">Monthly Revenue Breakdown & Booking Demand</h3>

        <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 border-b border-gray-100 pb-4">
          {[
            { month: 'Jan', val: '65%', amt: '₹1.8L' },
            { month: 'Feb', val: '80%', amt: '₹2.4L' },
            { month: 'Mar', val: '45%', amt: '₹1.2L' },
            { month: 'Apr', val: '90%', amt: '₹3.1L' },
            { month: 'May', val: '75%', amt: '₹2.6L' },
            { month: 'Jun', val: '100%', amt: '₹3.45L' },
          ].map((bar) => (
            <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-bold text-[#8A1C2C]">{bar.amt}</span>
              <div
                style={{ height: bar.val }}
                className="w-full bg-gradient-to-t from-[#8A1C2C] to-[#C5A880] rounded-t-lg transition-all"
              />
              <span className="text-xs font-bold text-gray-500 uppercase">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
