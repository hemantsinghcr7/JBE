// Groups the granular MetalType material list (see src/types/database.ts) into
// the 3 major metals JBE trades, plus a catch-all. Used by the Overview stock
// position and the /dashboard/stock/[category] drill-down pages so both stay
// in sync with a single source of truth.

export type MetalCategory = "Aluminium" | "Copper" | "Brass" | "Other";

export const CATEGORY_ORDER: MetalCategory[] = ["Aluminium", "Copper", "Brass", "Other"];

export const CATEGORY_SLUGS: Record<MetalCategory, string> = {
  Aluminium: "aluminium",
  Copper: "copper",
  Brass: "brass",
  Other: "other",
};

export const CATEGORY_COLORS: Record<MetalCategory, string> = {
  Aluminium: "#7fa3d6",
  Copper: "#c07a45",
  Brass: "#c2a24e",
  Other: "#8a9bb0",
};

export function categorySlugToName(slug: string): MetalCategory | null {
  const found = CATEGORY_ORDER.find((c) => CATEGORY_SLUGS[c] === slug);
  return found ?? null;
}

// Exact matches for every material currently in MetalType, plus the legacy
// AL/CU/BR/OTHER short codes still present in rows recorded before the
// material list was expanded.
const EXACT_MAP: Record<string, MetalCategory> = {
  "Aluminium Cast": "Aluminium",
  "Aluminium Cuttings": "Aluminium",
  "Aluminium Domestic": "Aluminium",
  "Aluminium Extruded": "Aluminium",
  "Aluminium Wheels": "Aluminium",
  "Radiators – Aluminium/Copper 5% Contamination": "Aluminium",
  "Radiators – Aluminium/Copper Clean": "Aluminium",
  "AL": "Aluminium",

  "Copper – Burnt/Tinned": "Copper",
  "Copper Candy": "Copper",
  "Copper Domestic": "Copper",
  "Copper Millberry": "Copper",
  "Insulated Copper Wire – Low Grade": "Copper",
  "Insulated Copper Wire – Medium Grade": "Copper",
  "Alternator/Starter Motor": "Copper",
  "Electric Fridge Compressor": "Copper",
  "Electric Motors Large": "Copper",
  "Electric Motors Small": "Copper",
  "CU": "Copper",

  "Brass – Clean": "Brass",
  "Brass – Contaminated": "Brass",
  "Radiator – Brass/Copper Clean": "Brass",
  "Radiator – Brass/Copper Contaminated": "Brass",
  "BR": "Brass",

  "Other": "Other",
  "OTHER": "Other",
};

// Falls back to prefix/keyword matching for anything not in the exact map,
// so a future material added to MetalType without updating this file still
// lands in a sensible bucket instead of silently defaulting to "Other".
export function categoryOf(metal: string): MetalCategory {
  const exact = EXACT_MAP[metal];
  if (exact) return exact;

  if (metal.startsWith("Aluminium") || metal.startsWith("Radiators – Aluminium")) return "Aluminium";
  if (
    metal.startsWith("Copper") ||
    metal.startsWith("Insulated Copper") ||
    metal.includes("Motor") ||
    metal.includes("Compressor") ||
    metal.includes("Alternator")
  ) return "Copper";
  if (metal.startsWith("Brass") || metal.startsWith("Radiator – Brass")) return "Brass";
  return "Other";
}

export type StockByMetal = Record<string, number>;
export type CategoryGroup = { total: number; materials: { name: string; kg: number }[] };

export function groupStockByCategory(stock: StockByMetal): Record<MetalCategory, CategoryGroup> {
  const groups: Record<MetalCategory, CategoryGroup> = {
    Aluminium: { total: 0, materials: [] },
    Copper: { total: 0, materials: [] },
    Brass: { total: 0, materials: [] },
    Other: { total: 0, materials: [] },
  };
  for (const [metal, kg] of Object.entries(stock)) {
    const cat = categoryOf(metal);
    groups[cat].total += kg;
    groups[cat].materials.push({ name: metal, kg });
  }
  for (const cat of CATEGORY_ORDER) {
    groups[cat].materials.sort((a, b) => b.kg - a.kg);
  }
  return groups;
}
