'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { BudgetCategory } from '@/types/events';

interface BudgetBreakdownProps {
  budgetBreakdown: BudgetCategory[];
  totalBudget: number;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1'];

export default function BudgetBreakdown({ budgetBreakdown, totalBudget }: BudgetBreakdownProps) {
  const chartData = budgetBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Budget Breakdown</h2>

      {/* Pie Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Budget List */}
      <div className="space-y-3">
        {budgetBreakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">
                ₹{item.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">Total Budget</span>
          <span className="text-lg font-bold text-purple-600">
            ₹{totalBudget.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
