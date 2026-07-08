import { createClient } from "@supabase/supabase-js";

// Fall back to harmless placeholders so evaluating this module never throws
// when env vars are absent (e.g. Vercel Preview builds). Real values are
// present in development and production; NEXT_PUBLIC_* values are inlined at
// build time for the browser client.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
