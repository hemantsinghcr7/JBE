import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { EditCustomerForm } from "@/components/dashboard/EditCustomerForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());
  const { data: customer, error } = await db.customers.get(id);

  if (error || !customer) notFound();

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href={`/dashboard/customers/${customer.id}`} className="dash-back-link">
          ← Back to {customer.name}
        </Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">Edit Customer</h1>
      </div>
      <EditCustomerForm customer={customer} />
    </div>
  );
}
