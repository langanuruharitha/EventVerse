'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EventWithStats } from '@/types/events';
import { calculateHealthScore, getHealthStatusMessage } from '@/lib/events/health-score';

interface EventCardProps {
  event: EventWithStats;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { overall, status, statusColor, statusIcon } = calculateHealthScore(event);
  const statusMessage = getHealthStatusMessage(overall);

  const eventDate = new Date(event.event_date);
  const daysUntil = event.days_until_event || 0;

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      birthday: '🎂',
      wedding: '💍',
      engagement: '💕',
      'baby-shower': '👶',
      anniversary: '💐',
      housewarming: '🏠',
      corporate: '🏢',
      festival: '🎆',
    };
    return icons[type] || '🎉';
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/events/${event.id}/delete`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Event deleted successfully!');
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete event');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative">
      <Link href={`/events/eventdetail/${event.id}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{getEventIcon(event.event_type)}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{event.event_name}</h3>
                <p className="text-sm text-gray-500 capitalize">{event.event_type.replace('-', ' ')}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {statusIcon} {overall}%
            </span>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-700">
                {eventDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">👥</span>
              <span className="text-gray-700">{event.guest_count} guests</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">💰</span>
              <span className="text-gray-700">
                ₹{event.total_budget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">⏰</span>
              <span className="text-gray-700">
                {daysUntil > 0 ? `${daysUntil} days left` : 'Today!'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{overall}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span>
              {event.completed_tasks || 0}/{event.total_tasks || 0} tasks
            </span>
            <span>
              {event.purchased_items || 0}/{event.total_shopping_items || 0} items
            </span>
            <span className="capitalize text-xs px-2 py-1 bg-gray-100 rounded">
              {event.status}
            </span>
          </div>
        </div>
      </Link>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all ${
          showDeleteConfirm
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
        } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={showDeleteConfirm ? 'Click again to confirm delete' : 'Delete event'}
      >
        {isDeleting ? (
          <div className="animate-spin">⏳</div>
        ) : showDeleteConfirm ? (
          <span className="text-sm font-bold px-2">Confirm?</span>
        ) : (
          <span className="text-lg">🗑️</span>
        )}
      </button>

      {/* Cancel Button (shows when confirm is active) */}
      {showDeleteConfirm && !isDeleting && (
        <button
          onClick={handleCancelDelete}
          className="absolute top-4 right-20 z-10 p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-all text-sm"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
