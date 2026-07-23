import { NewBuyerForm } from "@/components/dashboard/NewBuyerForm";

export default function NewBuyerPage() {
  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Add Buyer</h1>
      </div>
      <NewBuyerForm />
    </div>
  );
}
