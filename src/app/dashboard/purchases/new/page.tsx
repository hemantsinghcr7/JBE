import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { NewPurchaseForm } from "@/components/dashboard/NewPurchaseForm";

export const dynamic = "force-dynamic";

export default async function NewPurchasePage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data } = await db.customers.list();

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">New Purchase</h1>
      </div>
      <NewPurchaseForm customers={data.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
