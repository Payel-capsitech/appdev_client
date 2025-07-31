import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandBar,
  ICommandBarItemProps,
  DayOfWeek,
  TextField,
  IDropdownOption,
  DetailsList,
  SelectionMode,
  DatePicker,
  Stack,
  IconButton,
  Dropdown,
  mergeStyles,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import API from "../../services/api";
import InvoicePanel from "./InvoicePanel";
import InvoiceDetailsPanel from "./InvoiceDetailsPanel";

export interface Invoice {
  id: string;
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
  businessId?: string;
  address: BusinessAddress;
}
export interface BusinessAddress {
  country?: string;
  city?: string;
  postalCode?: string;
  building: string;
  street?: string;
}

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [businessList, setBusinessList] = useState<IDropdownOption[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(15);

  const totalPages = Math.ceil(totalCount / pageSize);

  const pageSizeOptions: IDropdownOption[] = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 15, text: "15" },
    { key: 20, text: "20" },
  ];

  const rightAlignClass = mergeStyles({ textAlign: "right" });
  const centerAlignClass = mergeStyles({ textAlign: "center" });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/invoice/PaginatedInvoice`, {
        params: {
          page,
          pageSize,
          search: search || undefined,
          startDate: fromDate?.toISOString(),
          endDate: toDate?.toISOString(),
        },
      });

      const data = res.data;

      const mapped = data.data.map((inv: any) => ({
        id: inv.id,
        invoiceId: inv.invoiceId,
        service: inv.service || [],
        startDate: inv.startDate,
        dueDate: inv.dueDate,
        amount: inv.amount,
        vatPercentage: inv.vatPercentage,
        totalAmount: inv.totalAmount,
        businessName: inv.businessName || inv.business?.name || "",
        businessId: inv.businessId || inv.business?.id || "",
        address: inv.business?.address || {},
      }));

      setInvoices(mapped);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
      await API.post(`/invoice/delete/${invoiceToDelete.id}`);
      setIsDeleteDialogOpen(false);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBusinesses = async () => {
    const res = await API.get("/business/user-businesses");
    const options = res.data.map((business: any) => ({
      key: business.businessId,
      text: business.name,
    }));
    setBusinessList(options);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize, search, fromDate, toDate]);

  const handlePageSizeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      setPageSize(option.key as number);
      setPage(1);
    }
  };

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "addInvoice",
      text: "Add",
      iconProps: { iconName: "Add" },
      onClick: () => setIsPanelOpen(true),
    },
    {
      key: "refresh",
      text: "Refresh",
      iconProps: { iconName: "Refresh" },
      onClick: () => fetchInvoices(),
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: "search",
      onRender: () => {
        return (
          <TextField
            placeholder="Search"
            value={search}
            onChange={(_, v) => {
              setSearch(v || "");
              setPage(1);
            }}
            iconProps={{ iconName: "Search" }}
            styles={{ root: { marginRight: 4, width: 140 } }}
          />
        )
      },
    },
    {
      key: "fromDate",
      onRender: () => (
        <DatePicker
          placeholder="From date"
          value={fromDate}
          onSelectDate={(date) => {
            setFromDate(date ?? undefined);
            setPage(1);
          }}
          firstDayOfWeek={DayOfWeek.Sunday}
          styles={{ root: { width: 120, marginRight: 4 } }}
        />
      ),
    },
    {
      key: "toDate",
      onRender: () => (
        <DatePicker
          placeholder="To date"
          value={toDate}
          onSelectDate={(date) => {
            setToDate(date ?? undefined);
            setPage(1);
          }}
          firstDayOfWeek={DayOfWeek.Sunday}
          styles={{ root: { width: 120, marginRight: 4 } }}
        />
      ),
    },
    {
      key: "clearFilters",
      iconOnly: true,
      iconProps: { iconName: "ClearFilter" },
      title: "Clear filters",
      ariaLabel: "Clear filters",
      onClick: () => {
        setSearch("");
        setFromDate(undefined);
        setToDate(undefined);
        setPage(1);
      },
      styles: {
        root: {
          marginLeft: 4,
          height: 32,
          width: 32,
          alignSelf: "center",
        },
      },
    },
  ];


  return (
    <div style={{ padding: 2 }}>
      <CommandBar items={commandBarItems} farItems={commandBarFarItems} styles={{ root: { padding: 6 } }} />

      {isLoading ? (
        <Spinner label="Fetching Invoices..." size={SpinnerSize.large} />
      ) : (
        <DetailsList
          items={invoices}
          columns={[
            { key: "S.No", name: "S.No", fieldName: "sno", minWidth: 40, onRender: (_, index) => (page - 1) * pageSize + (index ?? 0) + 1, maxWidth: 40 },
            {
              key: "id",
              name: "Invoice ID",
              fieldName: "invoiceId",
              minWidth: 70,
              maxWidth: 80,
              onRender: (item: Invoice) => (
                <span
                  style={{ color: "#0078D4", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    setSelectedInvoice(item);
                    setShowDetailsPanel(true);
                  }}
                >
                  {item.invoiceId}
                </span>
              ),
            },
            {
              key: "business name",
              name: "Business name",
              fieldName: "BusinessName",
              minWidth: 300,
              maxWidth: 310,
              onRender: (item: Invoice) => (
                <span
                  title={item?.businessName}
                  style={{ color: "#0078D4", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate(`/dashboard/business/${item.businessId}`)}
                >
                  {item?.businessName}
                </span>
              ),
            },
            {
              key: "services",
              name: "Services",
              fieldName: "services",
              minWidth: 130,
              maxWidth: 140,
              onRender: (item: Invoice) => item.service?.map((s) => s.name).join(", ") || "N/A",
            },
            { key: "startDate", name: "Start date", fieldName: "startDate", minWidth: 140, maxWidth: 140 },
            { key: "dueDate", name: "Due date", fieldName: "dueDate", minWidth: 140, maxWidth: 140 },
            {
              key: "amount",
              name: "Amount",
              fieldName: "amount",
              minWidth: 60,
              maxWidth: 70,
              onRender: (item) => <span title={`£ ${item.amount.toFixed(2)}`}>{`£ ${item.amount.toFixed(2)}`}</span>,
              className: rightAlignClass,
              styles: {
                cellTitle: {
                  justifyContent: 'flex-end'
                }
              }
            },
            {
              key: "vat",
              name: "VAT %",
              fieldName: "vatPercentage",
              minWidth: 40,
              maxWidth: 50,
              className: centerAlignClass,
              styles: {
                cellTitle: {
                  justifyContent: 'flex-end'
                }
              }
            },
            {
              key: "total",
              name: "Total",
              fieldName: "totalAmount",
              minWidth: 60,
              maxWidth: 70,
              onRender: (item) => <span title={`£${item.totalAmount?.toFixed(2) ?? "0.00"}`}>{`£${item.totalAmount?.toFixed(2) ?? "0.00"}`}</span>,
              className: rightAlignClass,
              styles: {
                cellTitle: {
                  justifyContent: 'flex-end'
                }
              }
            },
            {
              key: "actions",
              name: "",
              fieldName: "actions",
              minWidth: 100,
              maxWidth: 100,
              onRender: (item: Invoice) => (
                <Stack horizontal tokens={{ childrenGap: 6 }}>
                  <IconButton iconProps={{ iconName: "Edit" }} title="Edit" onClick={() => {
                    setEditInvoice(item);
                    setIsPanelOpen(true);
                  }}
                  />
                  <IconButton iconProps={{ iconName: "Delete" }} title="Delete" onClick={() => {
                    setInvoiceToDelete(item);
                    setIsDeleteDialogOpen(true);
                  }} />
                </Stack>
              )
            },
          ]}
          compact={true}
          selectionMode={SelectionMode.none}
        />
      )}


      <InvoicePanel
        isOpen={isPanelOpen || !!editInvoice}
        invoice={editInvoice}
        onDismiss={() => {
          setIsPanelOpen(false);
          setEditInvoice(undefined);
        }}
        onSuccess={() => {
          fetchInvoices();
          setIsPanelOpen(false);
          setEditInvoice(undefined);
        }}
        showBusinessDropdown={true}
        businessList={businessList}
      />

      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{ type: DialogType.largeHeader, title: "Are you sure you want to delete this invoice?" }}
      >
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={() => setIsDeleteDialogOpen(false)} />
          <PrimaryButton text="Delete" onClick={deleteInvoice} />
        </DialogFooter>
      </Dialog>

      <Stack horizontal verticalAlign="center" horizontalAlign="space-between" style={{ marginTop: 12 }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
          <span style={{ fontSize: 13 }}>Show</span>
          <Dropdown
            selectedKey={pageSize}
            options={pageSizeOptions}
            onChange={handlePageSizeChange}
            styles={{ dropdown: { width: 55 } }}
          />
          <span style={{ fontSize: 13 }}>items</span>
        </Stack>

        <Stack horizontalAlign="center" verticalAlign="center">
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
            <IconButton
              iconProps={{ iconName: "ChevronLeft" }}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            />
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: i + 1 === page ? "#0078D4" : "transparent",
                  color: i + 1 === page ? "#fff" : "#000",
                  fontWeight: i + 1 === page ? "bold" : "normal",
                }}
              >
                {i + 1}
              </span>
            ))}
            <IconButton
              iconProps={{ iconName: "ChevronRight" }}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            />
          </Stack>
          <span style={{ fontSize: 12, marginTop: 4 }}>
            Page {page} of {totalPages}
          </span>
        </Stack>
      </Stack>

      {showDetailsPanel && selectedInvoice && (
        <InvoiceDetailsPanel
          invoice={selectedInvoice}
          onDismiss={() => {
            setShowDetailsPanel(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicesPage;