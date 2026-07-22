import { createBrowserClient } from "@supabase/ssr";

// Browser client — use this in client components for auth (sign-in, sign-out).
// For data queries, continue to use src/lib/db.ts.
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
