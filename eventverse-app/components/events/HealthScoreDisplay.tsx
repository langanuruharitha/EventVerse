import type { EventWithStats } from '@/types/events';
import { calculateHealthScore, getHealthStatusMessage } from '@/lib/events/health-score';

interface HealthScoreDisplayProps {
  event: EventWithStats;
}

export default function HealthScoreDisplay({ event }: HealthScoreDisplayProps) {
  const { overall, breakdown, status, statusColor, statusIcon } = calculateHealthScore(event);
  const statusMessage = getHealthStatusMessage(overall);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Event Health Score</h2>

      {/* Overall Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`text-5xl font-bold ${statusColor.split(' ')[0]}`}>
            {overall}%
          </div>
          <p className="text-sm text-gray-600 mt-1">{statusMessage}</p>
        </div>
        <div className={`text-6xl ${statusColor.split(' ')[0]}`}>
          {statusIcon}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${overall}%` }}
        />
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Score Breakdown</h3>

        {/* Budget */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-sm text-gray-700">Budget Allocated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(breakdown.budget / 25) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
              {breakdown.budget}/25
            </span>
          </div>
        </div>

        {/* Vendors */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <span className="text-sm text-gray-700">Vendors Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(breakdown.vendors / 30) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
              {breakdown.vendors}/30
            </span>
          </div>
        </div>

        {/* Shopping */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <span className="text-sm text-gray-700">Shopping Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${(breakdown.shopping / 20) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
              {breakdown.shopping}/20
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span className="text-sm text-gray-700">Tasks Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${(breakdown.timeline / 15) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
              {breakdown.timeline}/15
            </span>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span className="text-sm text-gray-700">Guest Management</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500"
                style={{ width: `${(breakdown.guests / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
              {breakdown.guests}/10
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-6 p-3 rounded-lg ${statusColor}`}>
        <p className="text-sm font-medium text-center capitalize">
          Status: {status.replace('_', ' ')}
        </p>
      </div>
    </div>
  );
}
