// Event-related TypeScript types

export interface EventType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color_theme: string;
  default_budget_ranges: {
    min: number;
    max: number;
  };
  typical_duration_hours: number;
  common_requirements?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  event_name: string;
  event_type: string;
  event_date: string; // ISO date string
  event_time?: string;
  guest_count: number;
  total_budget: number;
  spent_amount: number;
  remaining_budget: number;
  theme?: string;
  venue_types?: string[];
  location_preference?: string;
  event_timing?: string;
  color_scheme?: {
    primary?: string;
    secondary?: string;
  };
  special_requirements?: string;
  selected_addons?: string[];
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  completion_percentage: number;
  health_score: number;
  health_breakdown?: HealthBreakdown;
  ai_blueprint?: AIBlueprint;
  ai_suggestions?: any;
  blueprint_version: number;
  ai_model_version?: string;
  ai_generation_time_ms?: number;
  created_at: string;
  updated_at: string;
}

export interface HealthBreakdown {
  budget: number;        // 0-25 points
  vendors: number;       // 0-30 points
  shopping: number;      // 0-20 points
  timeline: number;      // 0-15 points
  guests: number;        // 0-10 points
}

export interface BudgetCategory {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface AIBlueprint {
  budgetBreakdown: BudgetCategory[];
  tasks: TaskSuggestion[];
  timeline: TimelineMilestone[];
  shoppingList: ShoppingItem[];
  vendorRecommendations: VendorRecommendation[];
  decorationIdeas: string;
  foodSuggestions: string;
  tips: string[];
}

export interface TaskSuggestion {
  category: string;
  task_name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  weeks_before: number;
}

export interface TimelineMilestone {
  milestone_name: string;
  weeks_before: number;
  description: string;
  category: string;
  tasks: string[];
}

export interface ShoppingItem {
  category: string;
  item_name: string;
  quantity: number;
  estimated_price: number;
  priority: 'low' | 'medium' | 'high';
  where_to_buy?: string;
}

export interface VendorRecommendation {
  category: string;
  vendor_type: string;
  estimated_cost: number;
  tips: string[];
}

export interface EventTask {
  id: string;
  event_id: string;
  category: string;
  task_name: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
}

export interface EventTimeline {
  id: string;
  event_id: string;
  milestone_name: string;
  milestone_date: string;
  milestone_time?: string;
  description?: string;
  category: string;
  is_completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
}

export interface EventShoppingItem {
  id: string;
  event_id: string;
  category: string;
  item_name: string;
  quantity: number;
  estimated_price?: number;
  actual_price?: number;
  priority: 'low' | 'medium' | 'high';
  is_purchased: boolean;
  purchased_at?: string;
  purchase_link?: string;
  notes?: string;
  created_at: string;
}

export interface AIInteraction {
  id: string;
  user_id: string;
  event_id?: string;
  interaction_type: 'blueprint_generation' | 'suggestion_request' | 'optimization' | 'chat' | 'alternative_plan';
  input_data: any;
  ai_response?: any;
  model_version: string;
  tokens_used?: number;
  response_time_ms?: number;
  user_feedback?: 'helpful' | 'not_helpful' | 'partially_helpful';
  success: boolean;
  error_message?: string;
  created_at: string;
}

// Form data interfaces
export interface CreateEventFormData {
  event_name: string;
  event_type: string;
  event_date: Date;
  event_time?: string;
  guest_count: number;
  total_budget: number;
  theme?: string;
  venue_types?: string[];
  location_preference?: string;
  event_timing?: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day';
  color_scheme?: {
    primary?: string;
    secondary?: string;
  };
  special_requirements?: string;
  selected_addons?: string[];
}

// AI Generation input
export interface AIBlueprintInput {
  event_type: string;
  guest_count: number;
  total_budget: number;
  event_date: string;
  theme?: string;
  venue_types?: string[];
  location?: string;
  event_timing?: string;
  special_requirements?: string;
  selected_addons?: string[];
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EventWithStats extends Event {
  total_tasks?: number;
  completed_tasks?: number;
  total_shopping_items?: number;
  purchased_items?: number;
  days_until_event?: number;
}
