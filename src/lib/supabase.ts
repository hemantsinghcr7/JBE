import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// No Database generic here — hand-rolled types don't satisfy Supabase's internal
// GenericSchema constraint cleanly. Type safety is provided by src/lib/db.ts
// which wraps every query and returns explicitly typed results.
//
// To switch to generated types (recommended for Phase 2+):
//   npx supabase gen types typescript --project-id ofhmnochmsxafouphhth > src/types/database.ts
// Then add `import type { Database } from "@/types/database"` and pass it here.
export const supabase = createClient(url, key);
