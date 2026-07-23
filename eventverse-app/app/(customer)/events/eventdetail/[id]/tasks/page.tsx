'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TasksPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/tasks`);
      const data = await response.json();
      if (data.success) setTasks(data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {} as Record<string, any[]>);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const categoryIcon = (cat: string) => {
    const map: Record<string, string> = {
      Venue: '🏛️', Catering: '🍽️', Decoration: '🎨',
      Photography: '📸', Entertainment: '🎭',
    };
    return map[cat] || '📌';
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href={`/events/eventdetail/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
        >
          ← Back to Event
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2C1810]">📋 Event Task Checklist</h1>
              <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">
                Track every milestone of your celebration
              </p>
            </div>
            <div className="text-right font-sans">
              <div className="text-2xl font-bold text-[#8A1C2C]">{completedCount}/{tasks.length}</div>
              <div className="text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider">Tasks Done</div>
            </div>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider font-sans mb-1.5">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-[#EDE0CC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8A1C2C] to-[#C5A880] transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-[#DDD0BB] rounded p-12 text-center shadow-sm">
            <div className="text-3xl mb-3">⏳</div>
            <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading your task registry...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && tasks.length === 0 && (
          <div className="bg-white border border-[#DDD0BB] rounded p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-sm text-[#1F1E1B]/50 italic">No tasks have been generated for this event yet.</p>
          </div>
        )}

        {/* Tasks by Category */}
        {!loading && Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0] flex items-center gap-2">
              <span className="text-base">{categoryIcon(category)}</span>
              <h2 className="text-sm font-bold text-[#2C1810] uppercase tracking-wide">{category}</h2>
              <span className="ml-auto text-[10px] text-[#1F1E1B]/40 font-sans">
                {(categoryTasks as any[]).filter(t => t.status === 'completed').length}/{(categoryTasks as any[]).length} done
              </span>
            </div>

            <div className="divide-y divide-[#FAF6F0]">
              {(categoryTasks as any[]).map((task) => (
                <div
                  key={task.id}
                  className={`p-4 transition-colors ${task.status === 'completed' ? 'bg-[#F0FFF4]/30' : 'hover:bg-[#FAF6F0]/60'}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTask(task.id, task.status)}
                      className="mt-0.5 h-4 w-4 rounded border-[#DDD0BB] accent-[#8A1C2C] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold leading-snug ${
                          task.status === 'completed'
                            ? 'text-[#1A5C35] line-through opacity-60'
                            : 'text-[#1F1E1B]'
                        }`}
                      >
                        {task.task_name}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-[#1F1E1B]/50 italic mt-0.5">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {task.due_date && (
                          <span className="text-[10px] text-[#1F1E1B]/40 font-sans">
                            📅 {new Date(task.due_date).toLocaleDateString('en-IN')}
                          </span>
                        )}
                        {task.priority && (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border font-sans ${
                              task.priority === 'high'
                                ? 'bg-red-500/10 border-red-500/20 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-800'
                            }`}
                          >
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
