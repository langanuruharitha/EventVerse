'use client';

import { useState } from 'react';
import { Sparkles, X, Check, TrendingDown } from 'lucide-react';

interface AIBudgetOptimizerProps {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: any[];
}

interface Recommendation {
  id: string;
  type: 'warning' | 'suggestion' | 'tip';
  title: string;
  description: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
}

export default function AIBudgetOptimizer({
  totalBudget,
  spentAmount,
  remainingAmount,
  categories,
}: AIBudgetOptimizerProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [acceptedRecs, setAcceptedRecs] = useState<Set<string>>(new Set());

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const spentPercentage = (spentAmount / totalBudget) * 100;
      const recs: Recommendation[] = [];

      // Check if over budget or close to limit
      if (spentPercentage >= 100) {
        const overAmount = spentAmount - totalBudget;
        recs.push({
          id: '1',
          type: 'warning',
          title: `You are ₹${overAmount.toLocaleString('en-IN')} over budget`,
          description: 'Consider reducing expenses in non-essential categories or increasing your budget allocation.',
          savings: overAmount,
          priority: 'high',
        });
      } else if (spentPercentage >= 90) {
        recs.push({
          id: '2',
          type: 'warning',
          title: 'Approaching budget limit',
          description: 'You\'ve used 90% of your budget. Review remaining expenses carefully.',
          savings: 0,
          priority: 'high',
        });
      }

      // Check category-wise spending
      const overSpentCategories = categories.filter(cat => 
        cat.spent_amount > cat.allocated_amount
      );

      if (overSpentCategories.length > 0) {
        overSpentCategories.forEach((cat, idx) => {
          const excess = cat.spent_amount - cat.allocated_amount;
          recs.push({
            id: `cat-${idx}`,
            type: 'suggestion',
            title: `${cat.category_name} is over budget`,
            description: `Reduce ${cat.category_name} spending by ₹${excess.toLocaleString('en-IN')} or reallocate from other categories.`,
            savings: excess,
            priority: 'medium',
          });
        });
      }

      // General optimization tips
      recs.push({
        id: '3',
        type: 'tip',
        title: 'Choose Standard Venue Package',
        description: 'Switching from Premium to Standard venue package can save approximately 20% on venue costs.',
        savings: totalBudget * 0.06, // 20% of 30% venue allocation
        priority: 'medium',
      });

      recs.push({
        id: '4',
        type: 'tip',
        title: 'Optimize Decoration Budget',
        description: 'Use DIY decorations for 30% of items. Can reduce decoration costs by ₹3,000-₹5,000.',
        savings: 4000,
        priority: 'low',
      });

      recs.push({
        id: '5',
        type: 'tip',
        title: 'Bulk Order Return Gifts',
        description: 'Order return gifts in bulk to get 15-25% discount from suppliers.',
        savings: totalBudget * 0.01,
        priority: 'low',
      });

      recs.push({
        id: '6',
        type: 'suggestion',
        title: 'Negotiate with Vendors',
        description: 'Contact 2-3 vendors for competitive quotes. Can save 10-15% on average.',
        savings: totalBudget * 0.12,
        priority: 'medium',
      });

      setRecommendations(recs);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleAccept = (id: string) => {
    const newAccepted = new Set(acceptedRecs);
    if (newAccepted.has(id)) {
      newAccepted.delete(id);
    } else {
      newAccepted.add(id);
    }
    setAcceptedRecs(newAccepted);
  };

  const getTotalSavings = () => {
    return recommendations
      .filter(r => acceptedRecs.has(r.id))
      .reduce((sum, r) => sum + r.savings, 0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'tip': return '✨';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      case 'tip': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Budget Optimizer</h3>
            <p className="text-sm text-gray-600">Get smart recommendations to optimize your spending</p>
          </div>
        </div>
        
        {recommendations.length === 0 ? (
          <button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Recommendations
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setRecommendations([])}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {recommendations.length > 0 && (
        <>
          <div className="space-y-3 mb-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`border-2 ${getTypeColor(rec.type)} rounded-lg p-4 ${
                  acceptedRecs.has(rec.id) ? 'ring-2 ring-green-400' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      {rec.savings > 0 && (
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Potential Savings</div>
                          <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            ₹{rec.savings.toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    <button
                      onClick={() => toggleAccept(rec.id)}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                        acceptedRecs.has(rec.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {acceptedRecs.has(rec.id) ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Accepted
                        </span>
                      ) : (
                        'Accept Recommendation'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {acceptedRecs.size > 0 && (
            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total Potential Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{getTotalSavings().toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    From {acceptedRecs.size} accepted {acceptedRecs.size === 1 ? 'recommendation' : 'recommendations'}
                  </div>
                </div>
                <div className="text-5xl">🎯</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
