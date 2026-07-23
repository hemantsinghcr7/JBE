// Hand-maintained database types.
// Replace with generated types once Supabase CLI is configured:
//   npx supabase gen types typescript --project-id ofhmnochmsxafouphhth > src/types/database.ts

// Mirrors the internal GenericRelationship type from @supabase/postgrest-js.
// Defined here because supabase-js does not re-export it publicly.
type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type MetalType =
  | "Alternator/Starter Motor"
  | "Aluminium Cast"
  | "Aluminium Cuttings"
  | "Aluminium Domestic"
  | "Aluminium Extruded"
  | "Aluminium Wheels"
  | "Brass – Clean"
  | "Brass – Contaminated"
  | "Copper – Burnt/Tinned"
  | "Copper Candy"
  | "Copper Domestic"
  | "Copper Millberry"
  | "Electric Fridge Compressor"
  | "Electric Motors Large"
  | "Electric Motors Small"
  | "Insulated Copper Wire – Low Grade"
  | "Insulated Copper Wire – Medium Grade"
  | "Radiator – Brass/Copper Clean"
  | "Radiator – Brass/Copper Contaminated"
  | "Radiators – Aluminium/Copper 5% Contamination"
  | "Radiators – Aluminium/Copper Clean"
  | "Other";
export type PurchaseStatus = "draft" | "complete";
export type PaymentType = "cash" | "credit";
export type RateTiming = "before" | "after";

// ── DB row shapes (columns only, no join fields) ──────────────────────────────

export interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface PurchaseRow {
  id: string;
  customer_id: string;
  purchase_date: string;
  status: PurchaseStatus;
  notes: string | null;
  created_at: string;
}

export interface PurchaseItemRow {
  id: string;
  purchase_id: string;
  metal_type: MetalType;
  gross_weight: number;
  sacks_count: number;
  deduction_weight: number;
  net_weight: number;  // generated always: gross_weight - deduction_weight
  rate: number;
  amount: number;      // generated always: net_weight * rate
  rate_timing: RateTiming;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  purchase_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_date: string;
  notes: string | null;
  created_at: string;
}

// ── Enriched types used in the UI (rows + joined relations) ───────────────────

export type PurchaseWithCustomer = PurchaseRow & {
  customer: Pick<CustomerRow, "name"> | null;
};

export type PurchaseDetail = PurchaseRow & {
  customer: CustomerRow | null;
  items: PurchaseItemRow[];
  payments: PaymentRow[];
};

// ── Supabase Database generic ─────────────────────────────────────────────────
// Must satisfy createClient<Database>'s internal GenericSchema constraint.
// GenericRelationship is imported from supabase-js so the shape matches exactly.

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: CustomerRow;
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
        };
        Update: Partial<CustomerRow>;
        Relationships: GenericRelationship[];
      };
      purchases: {
        Row: PurchaseRow;
        Insert: {
          id?: string;
          customer_id: string;
          purchase_date?: string;
          status?: PurchaseStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<PurchaseRow>;
        Relationships: GenericRelationship[];
      };
      purchase_items: {
        Row: PurchaseItemRow;
        Insert: {
          id?: string;
          purchase_id: string;
          metal_type: MetalType;
          gross_weight: number;
          sacks_count?: number;
          deduction_weight?: number;
          // net_weight and amount are generated columns — excluded from Insert
          rate: number;
          rate_timing?: RateTiming;
          created_at?: string;
        };
        Update: Partial<Omit<PurchaseItemRow, "net_weight" | "amount">>;
        Relationships: GenericRelationship[];
      };
      payments: {
        Row: PaymentRow;
        Insert: {
          id?: string;
          purchase_id: string;
          amount: number;
          payment_type: PaymentType;
          payment_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<PaymentRow>;
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
