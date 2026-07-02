import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client components — uses @supabase/ssr so auth tokens
// are stored in cookies (shared with Server Components / Server Actions).
export function createBrowserClient() {
  return createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Shared singleton for convenience (backward compat for debug/test pages)
export const supabase = createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
