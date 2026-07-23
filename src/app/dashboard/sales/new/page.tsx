import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { NewSaleForm } from "@/components/dashboard/NewSaleForm";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data } = await db.buyers.list();

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">New Sale</h1>
      </div>
      <NewSaleForm buyers={data.map((b) => ({ id: b.id, name: b.name }))} />
    </div>
  );
}
