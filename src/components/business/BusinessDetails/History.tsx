import React, { useEffect, useState } from "react";
import API from "../../../services/api";

interface HistoryProps {
  businessId: string;
  refresh: boolean;
}

interface Invoice {
  id: string;
  service: string;
  description?: string;
  totalAmount: number;
  startDate: string;
  dueDate: string;
}

export default function History({ businessId, refresh }: HistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    API.get(`/invoice/by-business/${businessId}`)
      .then((res: { data: Invoice[] }) => setInvoices(res.data))
      .catch((err: unknown) => console.error(err));
  }, [businessId, refresh]);

  return (
    <div>
      {invoices.map((inv) => (
        <div key={inv.id} className="border p-2 mb-2 rounded bg-white">
          <p>Service: {inv.service}</p>
          <p>Total: ₹{inv.totalAmount}</p>
          <p>Start: {new Date(inv.startDate).toLocaleDateString()}</p>
          <p>Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
