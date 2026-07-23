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

      // Scrap received (kg) this week/month/all-time, plus account totals —
      // powers the customer profile page.
      summary: async (customerId: string): Promise<{ data: CustomerSummary; error: unknown }> => {
        const empty: CustomerSummary = {
          weekKg: 0,
          monthKg: 0,
          allTimeKg: 0,
          totalValue: 0,
          totalPaid: 0,
          outstanding: 0,
        };

        const { data: purchaseRows, error: pErr } = await client
          .from("purchases")
          .select("id, purchase_date")
          .eq("customer_id", customerId);
        if (pErr) return { data: empty, error: pErr };

        const purchases = (purchaseRows ?? []) as Pick<PurchaseRow, "id" | "purchase_date">[];
        const purchaseIds = purchases.map((p) => p.id);
        if (purchaseIds.length === 0) return { data: empty, error: null };

        const [{ data: itemRows }, { data: paymentRows }] = await Promise.all([
          client.from("purchase_items").select("purchase_id, net_weight, amount").in("purchase_id", purchaseIds),
          client.from("payments").select("purchase_id, amount").in("purchase_id", purchaseIds),
        ]);

        const dateById = new Map(purchases.map((p) => [p.id, p.purchase_date]));
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

        let weekKg = 0, monthKg = 0, allTimeKg = 0, totalValue = 0;
        for (const item of (itemRows ?? []) as { purchase_id: string; net_weight: number | null; amount: number | null }[]) {
          const date = dateById.get(item.purchase_id);
          const kg = item.net_weight ?? 0;
          allTimeKg += kg;
          totalValue += item.amount ?? 0;
          if (date && date >= monthStart) monthKg += kg;
          if (date && date >= weekAgo) weekKg += kg;
        }

        const totalPaid = ((paymentRows ?? []) as { amount: number }[]).reduce((s, p) => s + p.amount, 0);
        const outstanding = Math.max(0, totalValue - totalPaid);

        return { data: { weekKg, monthKg, allTimeKg, totalValue, totalPaid, outstanding }, error: null };
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

      recent: async (limit: number) => {
        const { data, error } = await client
          .from("purchases")
          .select("*, customer:customers(name), items:purchase_items(amount)")
          .order("purchase_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(limit);
        return { data: (data ?? []) as PurchaseWithCustomer[], error };
      },

      // Cash position for the Overview page: money still owed to sellers,
      // paid today, purchase value this week, and an all-time average.
      financialSummary: async (): Promise<{ data: FinancialSummary; error: unknown }> => {
        const empty: FinancialSummary = { outstanding: 0, paidToday: 0, valueThisWeek: 0, avgPurchaseSize: 0 };

        const [{ data: purchaseRows, error: pErr }, { data: itemRows }, { data: paymentRows }] = await Promise.all([
          client.from("purchases").select("id, purchase_date"),
          client.from("purchase_items").select("purchase_id, amount"),
          client.from("payments").select("purchase_id, amount, payment_date"),
        ]);
        if (pErr) return { data: empty, error: pErr };

        const purchases = (purchaseRows ?? []) as Pick<PurchaseRow, "id" | "purchase_date">[];
        const dateById = new Map(purchases.map((p) => [p.id, p.purchase_date]));

        const amountByPurchase = new Map<string, number>();
        for (const item of (itemRows ?? []) as { purchase_id: string; amount: number | null }[]) {
          amountByPurchase.set(item.purchase_id, (amountByPurchase.get(item.purchase_id) ?? 0) + (item.amount ?? 0));
        }

        const today = new Date().toISOString().slice(0, 10);
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

        const paidByPurchase = new Map<string, number>();
        let paidToday = 0;
        for (const pay of (paymentRows ?? []) as { purchase_id: string; amount: number; payment_date: string }[]) {
          paidByPurchase.set(pay.purchase_id, (paidByPurchase.get(pay.purchase_id) ?? 0) + pay.amount);
          if (pay.payment_date === today) paidToday += pay.amount;
        }

        let outstanding = 0, valueThisWeek = 0, totalValue = 0;
        for (const [purchaseId, amount] of amountByPurchase) {
          const paid = paidByPurchase.get(purchaseId) ?? 0;
          outstanding += Math.max(0, amount - paid);
          totalValue += amount;
          const date = dateById.get(purchaseId);
          if (date && date >= weekAgo) valueThisWeek += amount;
        }

        const avgPurchaseSize = purchases.length > 0 ? totalValue / purchases.length : 0;

        return { data: { outstanding, paidToday, valueThisWeek, avgPurchaseSize }, error: null };
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

export type FinancialSummary = {
  outstanding: number;
  paidToday: number;
  valueThisWeek: number;
  avgPurchaseSize: number;
};

export type CustomerSummary = {
  weekKg: number;
  monthKg: number;
  allTimeKg: number;
  totalValue: number;
  totalPaid: number;
  outstanding: number;
};
