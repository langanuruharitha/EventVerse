-- =====================================================
-- PHASE 07: MEMORY VAULT & ADMIN SYSTEMS
-- EventVerse Complete Database Schema
-- =====================================================
-- This schema implements:
-- 1. Memory Vault (AI-powered photo/video organization)
-- 2. Facial Recognition & Smart Albums
-- 3. Comprehensive Admin Panel
-- 4. Platform Analytics & Reporting
-- 5. Content Moderation System
-- 6. System Monitoring & Alerts
-- =====================================================

-- =====================================================
-- SECTION 1: MEMORY VAULT TABLES
-- =====================================================

-- Memory Albums (Photo/Video Collections)
CREATE TABLE IF NOT EXISTS memory_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  album_name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  
  -- Album Types
  album_type VARCHAR(50) DEFAULT 'custom',
  -- custom, auto_generated, pre_event, during_event, post_event, smart_album
  is_smart_album BOOLEAN DEFAULT FALSE,
  smart_criteria JSONB, -- AI-based categorization rules
  
  -- Privacy & Sharing
  privacy_setting VARCHAR(50) DEFAULT 'private',
  -- private, shared_with_guests, public, password_protected
  share_token VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  expires_at TIMESTAMP,
  
  -- Permissions
  allow_guest_upload BOOLEAN DEFAULT FALSE,
  allow_download BOOLEAN DEFAULT TRUE,
  allow_comments BOOLEAN DEFAULT TRUE,
  
  -- Statistics
  photo_count INT DEFAULT 0,
  video_count INT DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  view_count INT DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Memory Items (Photos/Videos/Documents)
CREATE TABLE IF NOT EXISTS memory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES memory_albums(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  -- File Details
  file_type VARCHAR(20) NOT NULL, -- photo, video, document
  file_name VARCHAR(255) NOT NULL,
  original_file_name VARCHAR(255),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  
  -- Media Metadata
  resolution VARCHAR(50), -- 1920x1080
  duration INT, -- for videos in seconds
  taken_at TIMESTAMP,
  camera_info JSONB, -- {make, model, settings}
  location JSONB, -- {lat, lng, address}
  
  -- Content
  caption TEXT,
  alt_text TEXT,
  tags TEXT[],
  
  -- AI Analysis Results
  ai_analysis JSONB,
  -- {
  --   faces: [{coordinates, confidence}],
  --   objects: [{name, confidence}],
  --   scene: "outdoor",
  --   mood: "happy",
  --   colors: ["#FF0000", "#00FF00"],
  --   labels: ["wedding", "party", "decoration"]
  -- }
  content_flags JSONB,
  -- {adult: false, violence: false, appropriate: true, confidence: 0.99}
  
  -- User Interaction
  is_favorite BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  
  -- Upload Info
  uploaded_by UUID REFERENCES users(id),
  upload_method VARCHAR(50), -- web, mobile, bulk, guest
  uploaded_at TIMESTAMP DEFAULT NOW(),
  
  -- Processing Status
  processing_status VARCHAR(50) DEFAULT 'processing',
  -- processing, completed, failed, deleted
  processing_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Facial Recognition Data
CREATE TABLE IF NOT EXISTS memory_faces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_item_id UUID REFERENCES memory_items(id) ON DELETE CASCADE,
  
  -- Face Detection Results
  face_coordinates JSONB NOT NULL,
  -- {x: 100, y: 150, width: 80, height: 100}
  confidence_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
  
  -- Face Identity
  guest_id UUID REFERENCES guests(id),
  suggested_guest_id UUID REFERENCES guests(id),
  face_encoding TEXT, -- AI face encoding for matching (base64 encoded)
  
  -- Manual Tagging
  manual_tag_name VARCHAR(255),
  tagged_by UUID REFERENCES users(id),
  tagged_at TIMESTAMP,
  
  -- Verification Status
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memory Comments & Reactions
CREATE TABLE IF NOT EXISTS memory_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_item_id UUID REFERENCES memory_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Comment Content
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES memory_comments(id),
  
  -- Reaction Type
  reaction_type VARCHAR(20), -- like, love, laugh, wow, sad, angry
  
  -- Moderation
  is_approved BOOLEAN DEFAULT TRUE,
  moderation_status VARCHAR(50) DEFAULT 'approved',
  -- approved, pending, rejected, flagged
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Memory Shares & Access Tokens
CREATE TABLE IF NOT EXISTS memory_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES memory_albums(id) ON DELETE CASCADE,
  
  -- Share Configuration
  share_token VARCHAR(255) UNIQUE NOT NULL,
  share_type VARCHAR(50), -- album, selected_items
  shared_items UUID[], -- specific memory_item IDs if not full album
  
  -- Access Control
  password_hash VARCHAR(255),
  expires_at TIMESTAMP,
  max_downloads INT,
  download_count INT DEFAULT 0,
  
  -- Permissions
  can_download BOOLEAN DEFAULT TRUE,
  can_comment BOOLEAN DEFAULT FALSE,
  can_upload BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  view_count INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  last_accessed_at TIMESTAMP,
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Print Orders (Physical Photo Prints)
CREATE TABLE IF NOT EXISTS memory_print_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  
  -- Order Identification
  order_number VARCHAR(50) UNIQUE NOT NULL,
  selected_items UUID[] NOT NULL, -- memory_item IDs
  
  -- Print Specifications
  print_specifications JSONB NOT NULL,
  -- {
  --   size: "4x6", "5x7", "8x10", "11x14",
  --   quantity: 10,
  --   paper_type: "glossy", "matte", "lustre",
  --   finish: "standard", "premium",
  --   print_service: "vendor_name"
  -- }
  
  -- Pricing
  item_cost DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(12,2) NOT NULL,
  
  -- Order Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, processing, printed, shipped, delivered, cancelled, refunded
  
  -- Fulfillment Details
  print_vendor VARCHAR(100),
  vendor_order_id VARCHAR(255),
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  actual_delivery DATE,
  
  -- Shipping Address
  shipping_address JSONB,
  -- {name, address_line1, address_line2, city, state, zip, country, phone}
  
  -- Notes & Communication
  customer_notes TEXT,
  vendor_notes TEXT,
  
  -- Timestamps
  ordered_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECTION 2: ADMIN PANEL TABLES
-- =====================================================

-- Admin Users & Permissions
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Role & Department
  role VARCHAR(50) NOT NULL, -- super_admin, admin, moderator, analyst, support
  department VARCHAR(100), -- operations, content, finance, support, technical
  
  -- Permissions (Granular Access Control)
  permissions JSONB NOT NULL DEFAULT '{}',
  -- {
  --   "users": ["read", "write", "delete"],
  --   "vendors": ["read", "approve"],
  --   "content": ["moderate", "delete"],
  --   "analytics": ["read"],
  --   "system": ["read", "write"]
  -- }
  
  -- Status & Activity
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  login_count INT DEFAULT 0,
  
  -- Security
  ip_whitelist TEXT[],
  requires_2fa BOOLEAN DEFAULT TRUE,
  session_timeout_minutes INT DEFAULT 480, -- 8 hours
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform Analytics (Aggregated Metrics)
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Time Period
  metric_date DATE DEFAULT CURRENT_DATE,
  metric_hour INT, -- 0-23 for hourly metrics
  granularity VARCHAR(20) DEFAULT 'daily',
  -- hourly, daily, weekly, monthly, yearly
  
  -- Metric Classification
  metric_type VARCHAR(100) NOT NULL,
  -- users_active, users_new, events_created, events_completed,
  -- revenue_total, orders_count, bookings_count, photos_uploaded, etc.
  category VARCHAR(100), -- users, events, revenue, content, system
  subcategory VARCHAR(100),
  
  -- Metric Values
  metric_value DECIMAL(15,2) NOT NULL,
  metric_count INT,
  metric_data JSONB, -- Additional structured data
  
  -- Comparison Data
  previous_period_value DECIMAL(15,2),
  growth_percentage DECIMAL(6,2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content Moderation Queue
CREATE TABLE IF NOT EXISTS content_moderation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content Reference
  content_type VARCHAR(50) NOT NULL,
  -- user_profile, vendor_profile, product, venue, review, photo, comment, event
  content_id UUID NOT NULL,
  content_data JSONB, -- Snapshot of content for review
  
  -- Report Details
  reported_by UUID REFERENCES users(id),
  report_reason VARCHAR(100),
  -- inappropriate, spam, copyright, harassment, violence, adult_content, misleading
  report_description TEXT,
  
  -- AI Moderation Results
  ai_flagged BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(5,4), -- 0.0000 to 1.0000
  ai_flags JSONB,
  -- {
  --   adult: {flagged: false, confidence: 0.02},
  --   violence: {flagged: false, confidence: 0.01},
  --   inappropriate: {flagged: true, confidence: 0.95}
  -- }
  
  -- Admin Review
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, in_review, approved, rejected, escalated, resolved
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMP,
  admin_notes TEXT,
  action_taken VARCHAR(100),
  -- none, content_removed, user_warned, user_suspended, user_banned, content_edited
  
  -- Priority & Urgency
  priority VARCHAR(20) DEFAULT 'medium',
  -- low, medium, high, critical
  auto_action_taken BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System Notifications & Announcements
CREATE TABLE IF NOT EXISTS system_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Notification Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50),
  -- system, security, performance, business, maintenance, update
  severity VARCHAR(20) DEFAULT 'info',
  -- debug, info, warning, error, critical
  
  -- Targeting
  target_type VARCHAR(50) DEFAULT 'all_admins',
  -- all_admins, specific_role, specific_user, all_users, user_segment
  target_criteria JSONB,
  -- {roles: ["admin", "moderator"], user_ids: [...], user_segment: "premium"}
  
  -- Status & Visibility
  is_active BOOLEAN DEFAULT TRUE,
  is_urgent BOOLEAN DEFAULT FALSE,
  is_dismissible BOOLEAN DEFAULT TRUE,
  
  -- Scheduling
  scheduled_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Delivery Channels
  delivery_channels TEXT[], -- email, sms, push, in_app, slack
  
  -- Tracking
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  read_count INT DEFAULT 0,
  dismissed_count INT DEFAULT 0,
  
  -- Actions (Optional)
  action_button_text VARCHAR(100),
  action_button_url TEXT,
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Feature Flags & Configuration
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Flag Identification
  flag_key VARCHAR(255) UNIQUE NOT NULL,
  flag_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Configuration
  is_enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INT DEFAULT 0, -- 0-100 for gradual rollouts
  
  -- Targeting Rules
  target_users JSONB,
  -- {
  --   user_types: ["premium", "enterprise"],
  --   user_ids: ["uuid1", "uuid2"],
  --   excluded_user_ids: ["uuid3"],
  --   regions: ["US", "IN"],
  --   min_account_age_days: 30
  -- }
  
  -- Environment
  environment VARCHAR(50) DEFAULT 'production',
  -- development, staging, production, all
  
  -- Dependencies
  depends_on_flags TEXT[], -- Other flag_keys that must be enabled
  conflicts_with_flags TEXT[], -- Flags that cannot be enabled simultaneously
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  last_modified_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System Health Monitoring
CREATE TABLE IF NOT EXISTS system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Health Check Details
  check_type VARCHAR(100) NOT NULL,
  -- database, api, storage, email, payment, ai_services, memory_vault
  service_name VARCHAR(100),
  
  -- Health Status
  status VARCHAR(20) NOT NULL, -- healthy, degraded, unhealthy, unknown
  response_time_ms INT,
  
  -- Metrics
  cpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  disk_usage DECIMAL(5,2),
  active_connections INT,
  
  -- Error Details
  error_message TEXT,
  error_details JSONB,
  
  -- Timestamps
  checked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Activity Logs (Audit Trail)
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  severity VARCHAR(20) DEFAULT 'info'; -- debug, info, warning, error, critical
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  category VARCHAR(50); -- auth, content, financial, system, user_action
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  affected_user_id UUID REFERENCES users(id);
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  admin_user_id UUID REFERENCES admin_users(id);
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  before_state JSONB; -- State before the action
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  after_state JSONB; -- State after the action
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  session_id VARCHAR(255);
ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS
  request_id VARCHAR(255);

-- =====================================================
-- SECTION 3: INDEXES FOR PERFORMANCE
-- =====================================================

-- Memory Vault Indexes
CREATE INDEX IF NOT EXISTS idx_memory_albums_event ON memory_albums(event_id);
CREATE INDEX IF NOT EXISTS idx_memory_albums_created_by ON memory_albums(created_by);
CREATE INDEX IF NOT EXISTS idx_memory_albums_type ON memory_albums(album_type);

CREATE INDEX IF NOT EXISTS idx_memory_items_album ON memory_items(album_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_event ON memory_items(event_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_uploaded_by ON memory_items(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_memory_items_status ON memory_items(processing_status);
CREATE INDEX IF NOT EXISTS idx_memory_items_taken_at ON memory_items(taken_at);

CREATE INDEX IF NOT EXISTS idx_memory_faces_item ON memory_faces(memory_item_id);
CREATE INDEX IF NOT EXISTS idx_memory_faces_guest ON memory_faces(guest_id);

CREATE INDEX IF NOT EXISTS idx_memory_comments_item ON memory_comments(memory_item_id);
CREATE INDEX IF NOT EXISTS idx_memory_comments_user ON memory_comments(user_id);

-- Admin Panel Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_type ON platform_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_category ON platform_analytics(category);

CREATE INDEX IF NOT EXISTS idx_content_moderation_status ON content_moderation(status);
CREATE INDEX IF NOT EXISTS idx_content_moderation_type ON content_moderation(content_type);
CREATE INDEX IF NOT EXISTS idx_content_moderation_priority ON content_moderation(priority);
CREATE INDEX IF NOT EXISTS idx_content_moderation_reviewed_by ON content_moderation(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_system_notifications_target ON system_notifications(target_type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_active ON system_notifications(is_active);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled);

CREATE INDEX IF NOT EXISTS idx_system_health_service ON system_health_logs(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON system_health_logs(status);
CREATE INDEX IF NOT EXISTS idx_system_health_checked_at ON system_health_logs(checked_at);

-- =====================================================
-- SECTION 4: SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample admin user (if users table has data)
-- Note: Run this after user signup or adjust user_id
-- INSERT INTO admin_users (user_id, role, department, permissions) VALUES
-- (
--   (SELECT id FROM users LIMIT 1),
--   'super_admin',
--   'operations',
--   '{
--     "users": ["read", "write", "delete"],
--     "vendors": ["read", "write", "approve", "delete"],
--     "content": ["read", "moderate", "delete"],
--     "analytics": ["read", "export"],
--     "system": ["read", "write", "configure"]
--   }'::jsonb
-- );

-- Insert sample feature flags
INSERT INTO feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) VALUES
('memory_vault_enabled', 'Memory Vault Feature', 'Enable AI-powered photo organization', TRUE, 100),
('facial_recognition_enabled', 'Facial Recognition', 'Enable face detection and tagging', TRUE, 50),
('print_orders_enabled', 'Print Orders', 'Enable physical photo print ordering', TRUE, 100),
('admin_analytics_v2', 'Admin Analytics V2', 'New analytics dashboard', FALSE, 0),
('ai_content_moderation', 'AI Content Moderation', 'Automatic content moderation', TRUE, 100)
ON CONFLICT (flag_key) DO NOTHING;

-- =====================================================
-- SECTION 5: HELPER FUNCTIONS
-- =====================================================

-- Function to update album statistics
CREATE OR REPLACE FUNCTION update_album_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE memory_albums
    SET 
      photo_count = photo_count + CASE WHEN NEW.file_type = 'photo' THEN 1 ELSE 0 END,
      video_count = video_count + CASE WHEN NEW.file_type = 'video' THEN 1 ELSE 0 END,
      total_size_bytes = total_size_bytes + NEW.file_size,
      updated_at = NOW()
    WHERE id = NEW.album_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE memory_albums
    SET 
      photo_count = photo_count - CASE WHEN OLD.file_type = 'photo' THEN 1 ELSE 0 END,
      video_count = video_count - CASE WHEN OLD.file_type = 'video' THEN 1 ELSE 0 END,
      total_size_bytes = total_size_bytes - OLD.file_size,
      updated_at = NOW()
    WHERE id = OLD.album_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update album stats
DROP TRIGGER IF EXISTS trigger_update_album_stats ON memory_items;
CREATE TRIGGER trigger_update_album_stats
AFTER INSERT OR DELETE ON memory_items
FOR EACH ROW EXECUTE FUNCTION update_album_stats();

-- =====================================================
-- END OF PHASE 07 SCHEMA
-- =====================================================

COMMENT ON TABLE memory_albums IS 'Photo/video albums with AI-powered organization';
COMMENT ON TABLE memory_items IS 'Individual photos, videos, and documents';
COMMENT ON TABLE memory_faces IS 'Facial recognition data for photos';
COMMENT ON TABLE admin_users IS 'Admin panel users with role-based permissions';
COMMENT ON TABLE platform_analytics IS 'Aggregated platform metrics and KPIs';
COMMENT ON TABLE content_moderation IS 'Content moderation queue and review system';
COMMENT ON TABLE feature_flags IS 'Feature flag management for gradual rollouts';
