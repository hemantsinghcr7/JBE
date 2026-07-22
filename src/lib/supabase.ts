import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — instantiated on first call, not at module evaluation time.
// Prevents the build-time crash ("supabaseUrl is required") that occurs when
// Next.js collects page config before env vars are injected into the worker.
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }
    _client = createClient(url, key);
  }
  return _client;
}
