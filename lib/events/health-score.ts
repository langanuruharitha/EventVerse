import type { Event, EventWithStats, HealthBreakdown } from '@/types/events';

/**
 * Calculate the health score for an event
 * Health score is based on 5 factors:
 * 1. Budget Allocated (25 points)
 * 2. Vendors Booked (30 points)
 * 3. Shopping Completed (20 points)
 * 4. Timeline Adherence (15 points)
 * 5. Guest Management (10 points)
 */
export function calculateHealthScore(event: EventWithStats): {
  overall: number;
  breakdown: HealthBreakdown;
  status: 'just_started' | 'in_progress' | 'on_track' | 'almost_ready';
  statusColor: string;
  statusIcon: string;
} {
  const breakdown: HealthBreakdown = {
    budget: calculateBudgetScore(event),
    vendors: calculateVendorScore(event),
    shopping: calculateShoppingScore(event),
    timeline: calculateTimelineScore(event),
    guests: calculateGuestScore(event),
  };

  const overall = Math.min(100, Math.max(0,
    breakdown.budget +
    breakdown.vendors +
    breakdown.shopping +
    breakdown.timeline +
    breakdown.guests
  ));

  // Determine status based on overall score
  let status: 'just_started' | 'in_progress' | 'on_track' | 'almost_ready';
  let statusColor: string;
  let statusIcon: string;

  if (overall < 25) {
    status = 'just_started';
    statusColor = 'text-red-600 bg-red-50';
    statusIcon = '🔴';
  } else if (overall < 50) {
    status = 'in_progress';
    statusColor = 'text-yellow-600 bg-yellow-50';
    statusIcon = '🟡';
  } else if (overall < 75) {
    status = 'on_track';
    statusColor = 'text-green-600 bg-green-50';
    statusIcon = '🟢';
  } else {
    status = 'almost_ready';
    statusColor = 'text-blue-600 bg-blue-50';
    statusIcon = '🎯';
  }

  return {
    overall: Math.round(overall),
    breakdown,
    status,
    statusColor,
    statusIcon,
  };
}

/**
 * Calculate budget allocation score (0-25 points)
 */
function calculateBudgetScore(event: EventWithStats): number {
  // Check if AI blueprint exists with budget breakdown
  if (!event.ai_blueprint?.budgetBreakdown) {
    return 0;
  }

  // If budget is allocated, give full points
  const hasCategories = event.ai_blueprint.budgetBreakdown.length > 0;
  const totalAllocated = event.ai_blueprint.budgetBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
  
  if (hasCategories && totalAllocated > 0) {
    return 25; // Full points for having budget breakdown
  }

  return 0;
}

/**
 * Calculate vendor booking score (0-30 points)
 */
function calculateVendorScore(event: EventWithStats): number {
  // For MVP, check if vendor recommendations exist
  if (!event.ai_blueprint?.vendorRecommendations) {
    return 0;
  }

  const vendorCount = event.ai_blueprint.vendorRecommendations.length;
  
  // Give points based on number of vendor categories
  // Typical event needs 4-5 vendor categories (photographer, caterer, decorator, venue, entertainment)
  const maxVendors = 5;
  const score = Math.min(30, (vendorCount / maxVendors) * 30);

  return Math.round(score);
}

/**
 * Calculate shopping completion score (0-20 points)
 */
function calculateShoppingScore(event: EventWithStats): number {
  const totalItems = event.total_shopping_items || 0;
  const purchasedItems = event.purchased_items || 0;

  if (totalItems === 0) {
    // No shopping list yet, give partial points if AI generated one
    if (event.ai_blueprint?.shoppingList && event.ai_blueprint.shoppingList.length > 0) {
      return 5; // 5 points for having a shopping list
    }
    return 0;
  }

  // Calculate percentage of items purchased
  const completionRate = purchasedItems / totalItems;
  return Math.round(completionRate * 20);
}

/**
 * Calculate timeline adherence score (0-15 points)
 */
function calculateTimelineScore(event: EventWithStats): number {
  const totalTasks = event.total_tasks || 0;
  const completedTasks = event.completed_tasks || 0;

  if (totalTasks === 0) {
    // No tasks yet, give partial points if AI generated timeline
    if (event.ai_blueprint?.timeline && event.ai_blueprint.timeline.length > 0) {
      return 3; // 3 points for having a timeline
    }
    return 0;
  }

  // Calculate task completion rate
  const completionRate = completedTasks / totalTasks;
  
  // Also consider days until event
  const daysUntil = event.days_until_event || 0;
  
  // If event is far away (>30 days), don't penalize too much for incomplete tasks
  let timelineScore = completionRate * 15;
  
  if (daysUntil > 30 && completionRate < 0.5) {
    // If event is far away, give some grace
    timelineScore = Math.max(timelineScore, 5);
  } else if (daysUntil < 7 && completionRate < 0.8) {
    // If event is close and tasks not mostly done, penalize
    timelineScore = Math.min(timelineScore, 10);
  }

  return Math.round(timelineScore);
}

/**
 * Calculate guest management score (0-10 points)
 */
function calculateGuestScore(event: EventWithStats): number {
  // For MVP, simply check if guest count is set
  if (event.guest_count > 0) {
    return 10; // Full points for having guest count
  }

  return 0;
}

/**
 * Get health score recommendations based on current score
 */
export function getHealthRecommendations(event: EventWithStats): string[] {
  const { breakdown } = calculateHealthScore(event);
  const recommendations: string[] = [];

  // Budget recommendations
  if (breakdown.budget < 15) {
    recommendations.push('📊 Review and finalize your budget allocation across categories');
  }

  // Vendor recommendations
  if (breakdown.vendors < 15) {
    recommendations.push('🏪 Start researching and booking essential vendors (photographer, caterer, venue)');
  }

  // Shopping recommendations
  if (breakdown.shopping < 10) {
    recommendations.push('🛒 Begin shopping for party supplies and decoration items');
  }

  // Timeline recommendations
  if (breakdown.timeline < 8) {
    recommendations.push('📅 Complete pending tasks from your timeline to stay on track');
  }

  // Days until event warnings
  const daysUntil = event.days_until_event || 0;
  if (daysUntil < 14 && breakdown.vendors < 20) {
    recommendations.push('⚠️ Event is less than 2 weeks away! Confirm all vendor bookings immediately');
  }

  if (daysUntil < 7 && breakdown.shopping < 15) {
    recommendations.push('⚠️ Less than a week left! Complete your shopping as soon as possible');
  }

  // If doing well
  if (breakdown.budget + breakdown.vendors + breakdown.shopping + breakdown.timeline > 70) {
    recommendations.push('🎉 Great progress! Keep up the momentum for a successful event');
  }

  return recommendations;
}

/**
 * Get status message based on health score
 */
export function getHealthStatusMessage(overall: number): string {
  if (overall < 25) {
    return 'Just getting started! Create your plan and begin preparations.';
  } else if (overall < 50) {
    return 'Making progress! Continue working through your checklist.';
  } else if (overall < 75) {
    return 'Looking good! You\'re on track for a successful event.';
  } else {
    return 'Almost ready! Final touches and you\'re all set!';
  }
}
