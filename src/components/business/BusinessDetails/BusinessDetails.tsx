import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../services/api";
import ProfileCard from "./ProfileCard";
import History from "./History";
import InvoicePanel from "./InvoicePanel";

export default function BusinessDetails() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [refreshInvoices, setRefreshInvoices] = useState(false);

  useEffect(() => {
    API.get(`/business/${businessId}`)
      .then((res) => setBusiness(res.data))
      .catch((err) => console.error(err));
  }, [businessId]);

  const handleRefresh = () => {
    setRefreshInvoices((prev) => !prev);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Business Details</h2>
      {business && <ProfileCard business={business} />}

      <div className="flex justify-between my-4">
        <h3 className="text-lg font-bold">Invoice History</h3>
        <button onClick={() => setIsPanelOpen(true)} className="bg-blue-500 text-white px-3 py-1 rounded">
          Add Invoice
        </button>
      </div>

      <History businessId={businessId!} refresh={refreshInvoices} />

      <InvoicePanel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        businessId={businessId!}
        businessName={business?.name || ""}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
