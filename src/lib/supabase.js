import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database table names
export const TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
  GIGS: 'gigs',
  CONNECTIONS: 'connections',
  APPLICATIONS: 'applications',
  SKILL_SWAPS: 'skill_swaps',
  MESSAGES: 'messages',
  REVIEWS: 'reviews'
};
