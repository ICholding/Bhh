/**
 * Supabase Client - Single Source of Truth
 * Exports singleton Supabase client with proper configuration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Runtime validation: throw early if required environment variables are missing
const getEnvVariable = (viteKey: string, nextKey: string, variableName: string): string => {
  // Try Vite environment variable first
  let value: string | undefined = import.meta.env?.[viteKey];
  
  // Fallback to Next.js environment variable for compatibility
  if (!value && typeof process !== 'undefined') {
    value = process.env?.[nextKey];
  }
  
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${viteKey} (or ${nextKey} for Next.js). ` +
      `Please set ${viteKey} in your .env file. Check .env.example for reference.`
    );
  }
  
  return value;
};

// Get Supabase URL with validation
const SUPABASE_URL = getEnvVariable(
  'VITE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'Supabase URL'
);

// Get Supabase Anon Key with validation
const SUPABASE_ANON_KEY = getEnvVariable(
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'Supabase Anon Key'
);

// Create singleton Supabase client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export function to get Supabase client (for compatibility with different patterns)
export const getSupabase = (): SupabaseClient => {
  return supabase;
};
