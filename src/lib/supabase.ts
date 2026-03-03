import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('SUPABASE ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in environment variables.');
}

// We use a fallback only to prevent the app from crashing entirely, 
// but we ensure it's a valid-looking URL format to avoid "Failed to fetch" 
// if the user is just testing the UI.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-please-set-your-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
