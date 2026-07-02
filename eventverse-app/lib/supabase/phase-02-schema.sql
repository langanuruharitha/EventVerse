-- ============================================
-- Phase 02: Core Event Planning & AI Integration
-- Database Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. EVENT TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  color_theme VARCHAR(50),
  default_budget_ranges JSONB,
  typical_duration_hours INT,
  common_requirements TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default event types
INSERT INTO event_types (name, slug, icon, description, color_theme, default_budget_ranges, typical_duration_hours, display_order) VALUES
('Birthday Party', 'birthday', '🎂', 'Celebrate birthdays with style', 'purple', '{"min": 10000, "max": 500000}', 4, 1),
('Wedding Ceremony', 'wedding', '💍', 'Complete wedding planning', 'pink', '{"min": 100000, "max": 5000000}', 8, 2),
('Engagement Party', 'engagement', '💕', 'Beautiful engagement celebrations', 'rose', '{"min": 50000, "max": 1000000}', 4, 3),
('Baby Shower', 'baby-shower', '👶', 'Welcome the little one', 'blue', '{"min": 15000, "max": 200000}', 3, 4),
('Anniversary', 'anniversary', '💐', 'Celebrate love and togetherness', 'gold', '{"min": 20000, "max": 300000}', 4, 5),
('Housewarming', 'housewarming', '🏠', 'New home celebrations', 'green', '{"min": 15000, "max": 150000}', 3, 6),
('Corporate Event', 'corporate', '🏢', 'Professional corporate events', 'navy', '{"min": 50000, "max": 2000000}', 6, 7),
('Festival Celebration', 'festival', '🎆', 'Traditional festival events', 'orange', '{"min": 20000, "max": 500000}', 6, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Event Info
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INT NOT NULL CHECK (guest_count > 0 AND guest_count <= 10000),
  
  -- Budget
  total_budget DECIMAL(12,2) NOT NULL CHECK (total_budget > 0),
  spent_amount DECIMAL(12,2) DEFAULT 0.00,
  remaining_budget DECIMAL(12,2),
  
  -- Event Details
  theme VARCHAR(100),
  venue_types TEXT[],
  location_preference VARCHAR(255),
  event_timing VARCHAR(50),
  color_scheme JSONB,
  special_requirements TEXT,
  selected_addons TEXT[],
  
  -- Status & Health
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  completion_percentage INT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  health_score DECIMAL(5,2) DEFAULT 0.00 CHECK (health_score >= 0 AND health_score <= 100),
  health_breakdown JSONB,
  
  -- AI Generated Content
  ai_blueprint JSONB,
  ai_suggestions JSONB,
  blueprint_version INT DEFAULT 1,
  ai_model_version VARCHAR(50),
  ai_generation_time_ms INT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Automatically calculate remaining_budget
CREATE OR REPLACE FUNCTION calculate_remaining_budget()
RETURNS TRIGGER AS $$
BEGIN
  NEW.remaining_budget := NEW.total_budget - COALESCE(NEW.spent_amount, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_remaining_budget
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION calculate_remaining_budget();

-- Indexes for events table
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);

-- ============================================
-- 3. EVENT TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  
  category VARCHAR(100),
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  assigned_to UUID REFERENCES users(id),
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  notes TEXT,
  
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_tasks_event ON event_tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tasks_status ON event_tasks(status);
CREATE INDEX IF NOT EXISTS idx_event_tasks_due ON event_tasks(due_date);

-- ============================================
-- 4. EVENT TIMELINE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  
  milestone_name VARCHAR(255) NOT NULL,
  milestone_date DATE NOT NULL,
  milestone_time TIME,
  description TEXT,
  category VARCHAR(100),
  
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  display_order INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_timeline_event ON event_timeline(event_id);
CREATE INDEX IF NOT EXISTS idx_event_timeline_date ON event_timeline(milestone_date);

-- ============================================
-- 5. AI INTERACTIONS LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  interaction_type VARCHAR(100) NOT NULL CHECK (interaction_type IN ('blueprint_generation', 'suggestion_request', 'optimization', 'chat', 'alternative_plan')),
  
  input_data JSONB NOT NULL,
  ai_response JSONB,
  model_version VARCHAR(50),
  tokens_used INT,
  response_time_ms INT,
  
  user_feedback VARCHAR(50) CHECK (user_feedback IN ('helpful', 'not_helpful', 'partially_helpful')),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_event ON ai_interactions(event_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created ON ai_interactions(created_at);

-- ============================================
-- 6. EVENT SHOPPING ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  
  category VARCHAR(100) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  estimated_price DECIMAL(10,2),
  actual_price DECIMAL(10,2),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMP,
  purchase_link TEXT,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shopping_items_event ON event_shopping_items(event_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON event_shopping_items(category);
CREATE INDEX IF NOT EXISTS idx_shopping_items_purchased ON event_shopping_items(is_purchased);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_shopping_items ENABLE ROW LEVEL SECURITY;

-- Event Types: Public read, admin write
CREATE POLICY "Event types are viewable by everyone" ON event_types FOR SELECT USING (true);
CREATE POLICY "Event types are insertable by admins" ON event_types FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
CREATE POLICY "Event types are updatable by admins" ON event_types FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Events: Users can only access their own events
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Event Tasks: Access through event ownership
CREATE POLICY "Users can view tasks for their events" ON event_tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_tasks.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can create tasks for their events" ON event_tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_tasks.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can update tasks for their events" ON event_tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_tasks.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can delete tasks for their events" ON event_tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_tasks.event_id AND events.user_id = auth.uid())
);

-- Event Timeline: Access through event ownership
CREATE POLICY "Users can view timeline for their events" ON event_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_timeline.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can create timeline for their events" ON event_timeline FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_timeline.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can update timeline for their events" ON event_timeline FOR UPDATE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_timeline.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can delete timeline for their events" ON event_timeline FOR DELETE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_timeline.event_id AND events.user_id = auth.uid())
);

-- AI Interactions: Users can only see their own
CREATE POLICY "Users can view their own AI interactions" ON ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create AI interactions" ON ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shopping Items: Access through event ownership
CREATE POLICY "Users can view shopping items for their events" ON event_shopping_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_shopping_items.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can create shopping items for their events" ON event_shopping_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_shopping_items.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can update shopping items for their events" ON event_shopping_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_shopping_items.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "Users can delete shopping items for their events" ON event_shopping_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_shopping_items.event_id AND events.user_id = auth.uid())
);

-- ============================================
-- UPDATED_AT TRIGGER FOR ALL TABLES
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPFUL VIEWS FOR DASHBOARDS
-- ============================================

-- View: Event Overview with Stats
CREATE OR REPLACE VIEW event_overview AS
SELECT 
  e.id,
  e.user_id,
  e.event_name,
  e.event_type,
  e.event_date,
  e.guest_count,
  e.total_budget,
  e.spent_amount,
  e.remaining_budget,
  e.health_score,
  e.status,
  e.completion_percentage,
  (SELECT COUNT(*) FROM event_tasks WHERE event_id = e.id) as total_tasks,
  (SELECT COUNT(*) FROM event_tasks WHERE event_id = e.id AND status = 'completed') as completed_tasks,
  (SELECT COUNT(*) FROM event_shopping_items WHERE event_id = e.id) as total_shopping_items,
  (SELECT COUNT(*) FROM event_shopping_items WHERE event_id = e.id AND is_purchased = true) as purchased_items,
  (e.event_date - CURRENT_DATE) as days_until_event
FROM events e;

-- ============================================
-- COMPLETED!
-- ============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
