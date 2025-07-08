import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../../services/api";

interface InvoicePanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  businessId: string;
  businessName: string;
  onSuccess: () => void;
}

export default function InvoicePanel({
  isOpen,
  onDismiss,
  businessId,
  businessName,
  onSuccess,
}: InvoicePanelProps) {
  const formik = useFormik({
    initialValues: {
      service: "",
      description: "",
      amount: 0,
      vatPercentage: 18,
      startDate: "",
      dueDate: "",
    },
    validationSchema: Yup.object({
      service: Yup.string().required("Required"),
      amount: Yup.number().required("Required"),
      vatPercentage: Yup.number().required("Required"),
      startDate: Yup.string().required("Required"),
      dueDate: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await API.post("/invoice/add", {
          ...values,
          businessId,
        });
        onSuccess();
        onDismiss();
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Add Invoice for {businessName}</h3>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        <input name="service" placeholder="Service" onChange={formik.handleChange} value={formik.values.service} />
        <input name="description" placeholder="Description" onChange={formik.handleChange} value={formik.values.description} />
        <input name="amount" type="number" placeholder="Amount" onChange={formik.handleChange} value={formik.values.amount} />
        <input name="vatPercentage" type="number" placeholder="VAT %" onChange={formik.handleChange} value={formik.values.vatPercentage} />
        <input name="startDate" type="date" onChange={formik.handleChange} value={formik.values.startDate} />
        <input name="dueDate" type="date" onChange={formik.handleChange} value={formik.values.dueDate} />
        <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded">Save</button>
      </form>
    </div>
  );
}
