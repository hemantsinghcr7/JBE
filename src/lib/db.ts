/**
 * Typed database access layer.
 *
 * All Supabase calls go through createDb(client). Components never import
 * from `@/lib/supabase` directly. This gives us:
 *   - Proper return types without fighting Supabase's generic inference
 *   - One place to swap the DB client if we ever move off Supabase
 *   - A session-aware client passed in per call site, so RLS policies gated
 *     on auth.role() = 'authenticated' see the signed-in user correctly —
 *     Server Components pass createSupabaseServerComponent(), Client
 *     Components pass createSupabaseBrowser()
 *
 * The `as unknown as X` cast in each function is the only place we cross the
 * type boundary — the rest of the codebase gets clean types.
 *
 * When the Supabase CLI is configured, replace with generated types:
 *   npx supabase gen types typescript --project-id ofhmnochmsxafouphhth > src/types/database.ts
 * and remove the casts in this file.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CustomerRow,
  PurchaseRow,
  PurchaseItemRow,
  PaymentRow,
  PurchaseWithCustomer,
  PurchaseDetail,
} from "@/types/database";

export function createDb(client: SupabaseClient) {
  return {
    // ── Customers ─────────────────────────────────────────────────────────
    customers: {
      list: async () => {
        const { data, error } = await client.from("customers").select("*").order("name");
        return { data: (data ?? []) as CustomerRow[], error };
      },

      get: async (id: string) => {
        const { data, error } = await client.from("customers").select("*").eq("id", id).single();
        return { data: data as CustomerRow | null, error };
      },

      insert: async (row: { name: string; phone?: string | null; address?: string | null }) => {
        const { error } = await client.from("customers").insert(row as unknown as object);
        return { error };
      },
    },

    // ── Purchases ─────────────────────────────────────────────────────────
    purchases: {
      list: async () => {
        const { data, error } = await client
          .from("purchases")
          .select("*, customer:customers(name)")
          .order("purchase_date", { ascending: false })
          .order("created_at", { ascending: false });
        return { data: (data ?? []) as PurchaseWithCustomer[], error };
      },

      byCustomer: async (customerId: string) => {
        const { data, error } = await client
          .from("purchases")
          .select("*")
          .eq("customer_id", customerId)
          .order("purchase_date", { ascending: false });
        return { data: (data ?? []) as PurchaseRow[], error };
      },

      get: async (id: string) => {
        const { data, error } = await client
          .from("purchases")
          .select("*, customer:customers(*), items:purchase_items(*), payments(*)")
          .eq("id", id)
          .single();
        return { data: data as PurchaseDetail | null, error };
      },

      insert: async (row: {
        customer_id: string;
        purchase_date?: string;
        status?: "draft" | "complete";
        notes?: string | null;
      }) => {
        const { data, error } = await client
          .from("purchases")
          .insert(row as unknown as object)
          .select()
          .single();
        return { data: data as PurchaseRow | null, error };
      },

      updateStatus: async (id: string, status: "draft" | "complete") => {
        const { error } = await client
          .from("purchases")
          .update({ status } as unknown as object)
          .eq("id", id);
        return { error };
      },

      stats: async () => {
        const { data, error } = await client.from("purchases").select("id, status, purchase_date");
        return { data: (data ?? []) as Pick<PurchaseRow, "id" | "status" | "purchase_date">[], error };
      },
    },

    // ── Purchase items ───────────────────────────────────────────────────
    purchaseItems: {
      insertMany: async (
        rows: {
          purchase_id: string;
          metal_type: PurchaseItemRow["metal_type"];
          gross_weight: number;
          sacks_count?: number;
          deduction_weight?: number;
          rate: number;
          rate_timing?: PurchaseItemRow["rate_timing"];
        }[]
      ) => {
        const { error } = await client.from("purchase_items").insert(rows as unknown as object[]);
        return { error };
      },
    },

    // ── Stock ─────────────────────────────────────────────────────────────
    stock: {
      // Returns total received net weight (kg) grouped by metal type, across all purchases.
      // "Stock" here means total inbound — we have no dispatch table yet.
      byMetal: async (): Promise<{ data: StockByMetal; error: unknown }> => {
        const { data, error } = await client.from("purchase_items").select("metal_type, net_weight");

        if (error || !data) return { data: {}, error };

        const totals: StockByMetal = {};
        for (const row of data as { metal_type: string; net_weight: number | null }[]) {
          const key = row.metal_type ?? "Other";
          totals[key] = (totals[key] ?? 0) + (row.net_weight ?? 0);
        }
        return { data: totals, error: null };
      },
    },

    // ── Payments ──────────────────────────────────────────────────────────
    payments: {
      insert: async (row: {
        purchase_id: string;
        amount: number;
        payment_type: PaymentRow["payment_type"];
        payment_date?: string;
        notes?: string | null;
      }) => {
        const { error } = await client.from("payments").insert(row as unknown as object);
        return { error };
      },
    },
  };
}

export type Db = ReturnType<typeof createDb>;
export type StockByMetal = Record<string, number>; // metal_type → total net_weight (kg)
