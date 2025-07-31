import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  CommandBar,
  ICommandBarItemProps,
  TextField,
  DatePicker,
  IconButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  DayOfWeek,
  IColumn,
  mergeStyles,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize
} from "@fluentui/react";
import API from "../../services/api";
import InvoiceDetailsPanel from "./InvoiceDetailsPanel";
import InvoicePanel from "./InvoicePanel";
import EditInvoicePanel from "./EditInvoicePanel";

export interface Invoice {
  id: string;
  business?: {
    id: string;
    name: string;
  };
  invoiceId: string;
  service: {
    id?: string;
    name: string;
    description: string;
    amount: number;
  }[];
  amount: number;
  vatPercentage: number;
  totalAmount: number;
  startDate: string;
  dueDate: string;
  createdAt: string;
  businessName?: string;
  address: BusinessAddress;
}

export interface BusinessAddress {
  country?: string;
  city?: string;
  postalCode?: string;
  building: string;
  street?: string;
}

export interface BillingProps {
  businessId: string;
  businessName: string;
  businessAddress: BusinessAddress;
}

export default function Billing({ businessId, businessName, businessAddress }: BillingProps) {
  console.log("Billingsssss", businessName, businessId, businessAddress);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isLoading, setLoading] = useState(false);
  const rightAlignClass = mergeStyles({
    textAlign: "right",
  });

  const fetchInvoices = useCallback(() => {
    API.get(`/invoice/byBusiness/${businessId}`)
      .then((res: { data: Invoice[] }) => {
        setLoading(false);
        if (Array.isArray(res.data)) {
          setInvoices(res.data);
        } else {
          console.error("API response data is not an array:", res.data);
          setInvoices([]);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("No invoices found for this business.");
          setInvoices([]);
        } else {
          console.error("Error fetching invoices:", error);
          setInvoices([]);
        }
      }
      );
  }, [businessId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleAddSuccess = () => {
    fetchInvoices();
    setIsAddPanelOpen(false);
  };

  const filtered = invoices.filter((inv) => {
    const serviceMatch =
      Array.isArray(inv.service) &&
      inv.service.some((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase())
      );
    const InvoiceMatch = inv.businessName?.includes(search.toLowerCase()) ?? false;
    const matchesSearch = serviceMatch || InvoiceMatch;
    const startMatch = fromDate ? new Date(inv.startDate) >= fromDate : true;
    const dueMatch = toDate ? new Date(inv.dueDate) <= toDate : true;

    return matchesSearch && startMatch && dueMatch;
  });


  const columns: IColumn[] = [
    { key: "sno", name: "S.No.", fieldName: "sno", minWidth: 50, onRender: (_, index) => (index ?? 0) + 1 },
    {
      key: "id",
      name: "Invoice ID",
      fieldName: "invoiceId",
      minWidth: 150,
      maxWidth: 80,
      onRender: (item: Invoice) => (
        <span
          style={{ color: "#0078D4", cursor: "pointer", textDecoration: "underline" }}
          onClick={() =>
            setSelectedInvoice({
              ...item,
              address: businessAddress,
              businessName: businessName,
            })
          }
        >
          {item.invoiceId}
        </span>
      ),
    },
    {
      key: "services",
      name: "Services",
      fieldName: "service",
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: Invoice) => item.service?.map(s => s.name).join(", ") || "N/A",
    },
    {
      key: "startDate",
      name: "Start date",
      fieldName: "startDate",
      minWidth: 120,
      onRender: (item) => new Date(item.startDate).toLocaleDateString(),
    },
    {
      key: "dueDate",
      name: "Due date",
      fieldName: "dueDate",
      minWidth: 120,
      onRender: (item) => new Date(item.dueDate).toLocaleDateString(),
    },
    {
      key: "amount",
      name: "Amount",
      fieldName: "amount",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item) => `£${item.amount.toFixed(2)}`,
      className: rightAlignClass,
      styles: {
        cellTitle: {
          justifyContent: 'flex-end'
        }
      }
    },
    {
      key: "totalAmount",
      name: "Total amount",
      fieldName: "totalAmount",
      minWidth: 90,
      onRender: (item) => `£${item.totalAmount?.toFixed(2) ?? "0.00"}`,
      className: rightAlignClass,
      styles: {
        cellTitle: {
          justifyContent: 'flex-end'
        }
      }
    },

    {
      key: "vat",
      name: "VAT",
      fieldName: "vatPercentage",
      minWidth: 30,
      onRender: (item) => `${item.vatPercentage}%`,
      className: rightAlignClass,
    },
    {
      key: "actions",
      name: "",
      fieldName: "actions",
      minWidth: 100,
      onRender: (item: Invoice) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit"
            ariaLabel="Edit"
            onClick={() => {
              setInvoiceToEdit({
                ...item,
                address: businessAddress,
                businessName: businessName,
              });
              setIsEditPanelOpen(true);
            }}
          />
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete"
            ariaLabel="Delete"
            onClick={() => {
              setInvoiceToDelete(item);
              setIsDeleteDialogOpen(true);
            }}
          />

        </Stack>
      ),
    },
  ];

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "addInvoice",
      text: "Add",
      iconProps: { iconName: "Add" },
      onClick: () => setIsAddPanelOpen(true),
    },
    {
      key: "refresh",
      text: "Refresh",
      iconProps: { iconName: "Refresh" },
      onClick: fetchInvoices,
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: "search",
      onRender: () => (
        <TextField
          placeholder="Search"
          value={search}
          onChange={(_, v) => setSearch(v || "")}
          iconProps={{ iconName: "Search" }}
          styles={{
            root: { marginRight: 4, width: 200 },
          }}
        />
      ),
    },
    {
      key: "fromDate",
      onRender: () => (
        <DatePicker
          placeholder="From date"
          value={fromDate}
          onSelectDate={(date) => setFromDate(date ?? undefined)}
          firstDayOfWeek={DayOfWeek.Sunday}
          styles={{
            root: {
              width: 120,
              marginRight: 4,
            },
          }}
        />
      ),
    },
    {
      key: "toDate",
      onRender: () => (
        <DatePicker
          placeholder="To date"
          value={toDate}
          onSelectDate={(date) => setToDate(date ?? undefined)}
          firstDayOfWeek={DayOfWeek.Sunday}
          styles={{
            root: {
              width: 120,
            },
          }}
        />
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <CommandBar
        items={commandBarItems}
        farItems={commandBarFarItems}
        styles={{ root: { padding: 8 } }}
      />

      {isLoading ? (
        <Spinner label="Loading Invoices...." size={SpinnerSize.large} />
      ) : (
        <DetailsList
          items={filtered}
          columns={columns}
          setKey="invoiceList"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
          compact={true}
        />
      )}

      <InvoiceDetailsPanel invoice={selectedInvoice} onDismiss={() => setSelectedInvoice(null)} />

      <InvoicePanel
        isOpen={isAddPanelOpen}
        onDismiss={() => setIsAddPanelOpen(false)}
        businessId={businessId}
        businessName={businessName || "undefined Business"}
        businessAddress={businessAddress}
        onSuccess={handleAddSuccess}
      />

      <EditInvoicePanel
        isOpen={isEditPanelOpen}
        onDismiss={() => {
          setIsEditPanelOpen(false);
          setInvoiceToEdit(null);
        }}
        invoice={invoiceToEdit}
        onSuccess={() => {
          fetchInvoices();
          setIsEditPanelOpen(false);
          setInvoiceToEdit(null);
        }}
      />
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          subText: `Are you sure you want to delete invoice "${invoiceToDelete?.invoiceId}"?`
        }}
      >
        <DialogFooter>
          <DefaultButton
            onClick={() => setIsDeleteDialogOpen(false)}
            text="Cancel"
          />
          <PrimaryButton
            onClick={async () => {
              if (!invoiceToDelete) return;
              try {
                await API.post(`/invoice/delete/${invoiceToDelete.id}`);
                fetchInvoices();
              } catch (error) {
                console.error("Error deleting invoice:", error);
                alert("Failed to delete the invoice.");
              } finally {
                setIsDeleteDialogOpen(false);
                setInvoiceToDelete(null);
              }
            }}
            text="Delete"
          />
        </DialogFooter>
      </Dialog>

    </Stack>
  );
}