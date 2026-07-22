import { NewCustomerForm } from "@/components/dashboard/NewCustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Add Customer</h1>
      </div>
      <NewCustomerForm />
    </div>
  );
}
