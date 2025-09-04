-- LocalGigs Database Schema
-- This file contains the complete database schema for the LocalGigs application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_text VARCHAR(255),
  skills TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_tasks_completed INTEGER DEFAULT 0,
  total_gigs_completed INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  location_text VARCHAR(255),
  reward DECIMAL(10,2),
  reward_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'hourly', 'negotiable'
  urgency VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  skills_required TEXT[] DEFAULT '{}',
  posted_by_user_id UUID REFERENCES public.users(id) NOT NULL,
  assigned_to_user_id UUID REFERENCES public.users(id),
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
  is_paid BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gigs table
CREATE TABLE public.gigs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  location_text VARCHAR(255),
  pay_rate DECIMAL(10,2),
  pay_type VARCHAR(20) DEFAULT 'hourly', -- 'hourly', 'fixed', 'commission'
  skills_required TEXT[] DEFAULT '{}',
  experience_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'expert'
  posted_by_user_id UUID REFERENCES public.users(id) NOT NULL,
  assigned_to_user_id UUID REFERENCES public.users(id),
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
  is_remote BOOLEAN DEFAULT FALSE,
  application_deadline TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  estimated_duration VARCHAR(50),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table (for both tasks and gigs)
CREATE TABLE public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  applicant_id UUID REFERENCES public.users(id) NOT NULL,
  task_id UUID REFERENCES public.tasks(id),
  gig_id UUID REFERENCES public.gigs(id),
  message TEXT,
  proposed_rate DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'withdrawn'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT application_type_check CHECK (
    (task_id IS NOT NULL AND gig_id IS NULL) OR 
    (task_id IS NULL AND gig_id IS NOT NULL)
  )
);

-- Skill Swaps table
CREATE TABLE public.skill_swaps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  offered_skill VARCHAR(100) NOT NULL,
  requested_skill VARCHAR(100) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  location_text VARCHAR(255),
  posted_by_user_id UUID REFERENCES public.users(id) NOT NULL,
  matched_with_user_id UUID REFERENCES public.users(id),
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'matched', 'in_progress', 'completed', 'cancelled'
  estimated_duration VARCHAR(50),
  is_remote BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table
CREATE TABLE public.connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.users(id) NOT NULL,
  user2_id UUID REFERENCES public.users(id) NOT NULL,
  connection_type VARCHAR(20) DEFAULT 'peer', -- 'peer', 'mentor', 'mentee'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CONSTRAINT no_self_connection CHECK (user1_id != user2_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  recipient_id UUID REFERENCES public.users(id) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file'
  task_id UUID REFERENCES public.tasks(id),
  gig_id UUID REFERENCES public.gigs(id),
  skill_swap_id UUID REFERENCES public.skill_swaps(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES public.users(id) NOT NULL,
  reviewee_id UUID REFERENCES public.users(id) NOT NULL,
  task_id UUID REFERENCES public.tasks(id),
  gig_id UUID REFERENCES public.gigs(id),
  skill_swap_id UUID REFERENCES public.skill_swaps(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT review_type_check CHECK (
    (task_id IS NOT NULL AND gig_id IS NULL AND skill_swap_id IS NULL) OR 
    (task_id IS NULL AND gig_id IS NOT NULL AND skill_swap_id IS NULL) OR
    (task_id IS NULL AND gig_id IS NULL AND skill_swap_id IS NOT NULL)
  )
);

-- Payments table (for Stripe integration)
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  payer_id UUID REFERENCES public.users(id) NOT NULL,
  payee_id UUID REFERENCES public.users(id) NOT NULL,
  task_id UUID REFERENCES public.tasks(id),
  gig_id UUID REFERENCES public.gigs(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'cancelled'
  platform_fee DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_location ON public.users USING GIST (location);
CREATE INDEX idx_users_skills ON public.users USING GIN (skills);
CREATE INDEX idx_tasks_location ON public.tasks USING GIST (location);
CREATE INDEX idx_tasks_skills ON public.tasks USING GIN (skills_required);
CREATE INDEX idx_tasks_status ON public.tasks (status);
CREATE INDEX idx_tasks_posted_by ON public.tasks (posted_by_user_id);
CREATE INDEX idx_gigs_location ON public.gigs USING GIST (location);
CREATE INDEX idx_gigs_skills ON public.gigs USING GIN (skills_required);
CREATE INDEX idx_gigs_status ON public.gigs (status);
CREATE INDEX idx_gigs_posted_by ON public.gigs (posted_by_user_id);
CREATE INDEX idx_applications_applicant ON public.applications (applicant_id);
CREATE INDEX idx_applications_task ON public.applications (task_id);
CREATE INDEX idx_applications_gig ON public.applications (gig_id);
CREATE INDEX idx_skill_swaps_location ON public.skill_swaps USING GIST (location);
CREATE INDEX idx_skill_swaps_status ON public.skill_swaps (status);
CREATE INDEX idx_connections_user1 ON public.connections (user1_id);
CREATE INDEX idx_connections_user2 ON public.connections (user2_id);
CREATE INDEX idx_messages_sender ON public.messages (sender_id);
CREATE INDEX idx_messages_recipient ON public.messages (recipient_id);
CREATE INDEX idx_reviews_reviewee ON public.reviews (reviewee_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Anyone can view open tasks" ON public.tasks FOR SELECT USING (status = 'open' OR posted_by_user_id = auth.uid() OR assigned_to_user_id = auth.uid());
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = posted_by_user_id);
CREATE POLICY "Task owners can update tasks" ON public.tasks FOR UPDATE USING (auth.uid() = posted_by_user_id);

-- Gigs policies
CREATE POLICY "Anyone can view open gigs" ON public.gigs FOR SELECT USING (status = 'open' OR posted_by_user_id = auth.uid() OR assigned_to_user_id = auth.uid());
CREATE POLICY "Users can create gigs" ON public.gigs FOR INSERT WITH CHECK (auth.uid() = posted_by_user_id);
CREATE POLICY "Gig owners can update gigs" ON public.gigs FOR UPDATE USING (auth.uid() = posted_by_user_id);

-- Applications policies
CREATE POLICY "Users can view their applications" ON public.applications FOR SELECT USING (auth.uid() = applicant_id OR EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND posted_by_user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.gigs WHERE id = gig_id AND posted_by_user_id = auth.uid()));
CREATE POLICY "Users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users can update their applications" ON public.applications FOR UPDATE USING (auth.uid() = applicant_id);

-- Skill swaps policies
CREATE POLICY "Anyone can view open skill swaps" ON public.skill_swaps FOR SELECT USING (status = 'open' OR posted_by_user_id = auth.uid() OR matched_with_user_id = auth.uid());
CREATE POLICY "Users can create skill swaps" ON public.skill_swaps FOR INSERT WITH CHECK (auth.uid() = posted_by_user_id);
CREATE POLICY "Skill swap owners can update" ON public.skill_swaps FOR UPDATE USING (auth.uid() = posted_by_user_id);

-- Connections policies
CREATE POLICY "Users can view their connections" ON public.connections FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create connections" ON public.connections FOR INSERT WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update their connections" ON public.connections FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Payments policies
CREATE POLICY "Users can view their payments" ON public.payments FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- Functions for updating user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user rating when a review is added
CREATE TRIGGER update_user_rating_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_swaps_updated_at BEFORE UPDATE ON public.skill_swaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
