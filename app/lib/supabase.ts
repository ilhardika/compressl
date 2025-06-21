import { createClient } from "@supabase/supabase-js";

// For development, we'll use placeholder values if env vars aren't available
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Check if we have the required environment variables
const hasEnvVariables =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a conditional Supabase client
export const supabase = hasEnvVariables
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null; // Return null if environment variables are missing

// Helper function to safely use Supabase
export function useSupabase() {
  if (!supabase) {
    console.warn(
      "Supabase client not initialized - please check your environment variables"
    );
    return null;
  }
  return supabase;
}
