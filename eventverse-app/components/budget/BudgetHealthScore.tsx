'use client';

interface BudgetHealthScoreProps {
  spentPercentage: number;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
}

export default function BudgetHealthScore({
  spentPercentage,
  totalBudget,
  spentAmount,
  remainingAmount,
}: BudgetHealthScoreProps) {
  // Calculate health score
  const calculateHealthScore = () => {
    if (spentPercentage <= 0) return 100;
    if (spentPercentage >= 100) {
      // Over budget - score decreases based on how much over
      const overPercentage = spentPercentage - 100;
      return Math.max(0, 60 - overPercentage);
    }
    if (spentPercentage >= 90) return 70 + ((100 - spentPercentage) * 2);
    if (spentPercentage >= 75) return 80 + ((90 - spentPercentage) * 0.67);
    return 95 - (spentPercentage * 0.2);
  };

  const healthScore = Math.round(calculateHealthScore());

  const getHealthStatus = () => {
    if (healthScore >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: '💚' };
    if (healthScore >= 75) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: '💙' };
    if (healthScore >= 60) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '💛' };
    return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50', icon: '❤️' };
  };

  const status = getHealthStatus();

  const getAdvice = () => {
    if (healthScore >= 90) {
      return "Great job! You're well within budget and managing expenses effectively.";
    }
    if (healthScore >= 75) {
      return "Good progress! Keep monitoring expenses to stay on track.";
    }
    if (healthScore >= 60) {
      return "Be cautious! You're approaching your budget limit. Consider reviewing expenses.";
    }
    return "Alert! You're over budget or very close. Immediate action recommended.";
  };

  return (
    <div className={`${status.bg} border-2 border-${status.color.replace('text-', '')} rounded-2xl p-6 mb-8`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{status.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Budget Health Score</h3>
              <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{getAdvice()}</p>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Spent:</span>
              <span className="font-semibold text-gray-900 ml-2">{spentPercentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Remaining:</span>
              <span className="font-semibold text-gray-900 ml-2">{100 - spentPercentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Days Left:</span>
              <span className="font-semibold text-gray-900 ml-2">-</span>
            </div>
          </div>
        </div>

        <div className="ml-8">
          <div className="relative w-32 h-32">
            {/* Circular progress */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - healthScore / 100)}`}
                className={status.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${status.color}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
