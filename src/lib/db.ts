/**
 * Typed database access layer.
 *
 * All Supabase calls go through this file. Components import from here, not
 * from `@/lib/supabase` directly. This gives us:
 *   - Proper return types without fighting Supabase's generic inference
 *   - One place to swap the DB client if we ever move off Supabase
 *   - Easy to mock in tests
 *
 * The `as unknown as X` cast in each function is the only place we cross the
 * type boundary — the rest of the codebase gets clean types.
 *
 * When the Supabase CLI is configured, replace with generated types:
 *   npx supabase gen types typescript --project-id ofhmnochmsxafouphhth > src/types/database.ts
 * and remove the casts in this file.
 */

import { supabase } from "./supabase";
import type {
  CustomerRow,
  PurchaseRow,
  PurchaseItemRow,
  PaymentRow,
  PurchaseWithCustomer,
  PurchaseDetail,
} from "@/types/database";

// ── Customers ─────────────────────────────────────────────────────────────────

export const customers = {
  list: async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("name");
    return { data: (data ?? []) as CustomerRow[], error };
  },

  get: async (id: string) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as CustomerRow | null, error };
  },

  insert: async (row: { name: string; phone?: string | null; address?: string | null }) => {
    const { error } = await supabase
      .from("customers")
      .insert(row as unknown as Record<string, unknown>);
    return { error };
  },
};

// ── Purchases ─────────────────────────────────────────────────────────────────

export const purchases = {
  list: async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select("*, customer:customers(name)")
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false });
    return { data: (data ?? []) as PurchaseWithCustomer[], error };
  },

  get: async (id: string) => {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from("purchases")
      .insert(row as unknown as Record<string, unknown>)
      .select()
      .single();
    return { data: data as PurchaseRow | null, error };
  },

  updateStatus: async (id: string, status: "draft" | "complete") => {
    const { error } = await supabase
      .from("purchases")
      .update({ status } as unknown as Record<string, unknown>)
      .eq("id", id);
    return { error };
  },

  stats: async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select("id, status, purchase_date");
    return { data: (data ?? []) as Pick<PurchaseRow, "id" | "status" | "purchase_date">[], error };
  },
};

// ── Purchase items ────────────────────────────────────────────────────────────

export const purchaseItems = {
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
    const { error } = await supabase
      .from("purchase_items")
      .insert(rows as unknown as Record<string, unknown>[]);
    return { error };
  },
};

// ── Stock ─────────────────────────────────────────────────────────────────────

export type StockByMetal = Record<string, number>; // metal_type → total net_weight (kg)

export const stock = {
  // Returns total received net weight (kg) grouped by metal type, across all purchases.
  // "Stock" here means total inbound — we have no dispatch table yet.
  byMetal: async (): Promise<{ data: StockByMetal; error: unknown }> => {
    const { data, error } = await supabase
      .from("purchase_items")
      .select("metal_type, net_weight");

    if (error || !data) return { data: {}, error };

    const totals: StockByMetal = {};
    for (const row of data as { metal_type: string; net_weight: number | null }[]) {
      const key = row.metal_type ?? "OTHER";
      totals[key] = (totals[key] ?? 0) + (row.net_weight ?? 0);
    }
    return { data: totals, error: null };
  },
};

// ── Payments ──────────────────────────────────────────────────────────────────

export const payments = {
  insert: async (row: {
    purchase_id: string;
    amount: number;
    payment_type: PaymentRow["payment_type"];
    payment_date?: string;
    notes?: string | null;
  }) => {
    const { error } = await supabase
      .from("payments")
      .insert(row as unknown as Record<string, unknown>);
    return { error };
  },
};
