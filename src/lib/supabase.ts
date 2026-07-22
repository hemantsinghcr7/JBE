import { createClient } from "@supabase/supabase-js";

// Lazy singleton — created on first use, not at module evaluation time.
// This prevents the build-time crash when env vars are absent (e.g. Vercel
// static analysis runs before env vars are injected into the build context).
let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    _client = createClient(url, key);
  }
  return _client;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
