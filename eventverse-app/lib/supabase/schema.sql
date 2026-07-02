-- EventVerse Phase 01 Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  address JSONB,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Profiles
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_name VARCHAR(255) NOT NULL,
  business_category VARCHAR(100),
  business_description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  portfolio_images TEXT[],
  years_in_business INT,
  certifications TEXT[],
  service_areas TEXT[],
  price_range VARCHAR(50),
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  verification_status VARCHAR(50) DEFAULT 'pending',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50),
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_user ON vendor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_category ON vendor_profiles(business_category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for vendor_profiles
CREATE POLICY "Vendors manage own profile" ON vendor_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view active vendors" ON vendor_profiles
  FOR SELECT USING (is_active = true AND verification_status = 'approved');

-- RLS Policies for system_settings (admin only)
CREATE POLICY "Only admins can manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
