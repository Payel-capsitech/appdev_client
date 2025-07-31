import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Panel,
  PanelType,
  Stack,
  Label,
  IconButton,
  DetailsList,
  IColumn,
  IIconProps,
  mergeStyles
} from "@fluentui/react";
import { Invoice } from "./Billing";

interface InvoiceDetailsPanelProps {
  invoice: Invoice | null;
  onDismiss: () => void;
}

export default function InvoiceDetailsPanel({ invoice, onDismiss }: InvoiceDetailsPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const rightAlignClass = mergeStyles({ textAlign: "right" });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice ? `Invoice_${invoice.invoiceId}` : "Invoice",
  });

  if (!invoice) return null;

  const columns: IColumn[] = [
    {
      key: "sno",
      name: "S.No.",
      fieldName: "sno",
      minWidth: 50,
      onRender: (_, index) => (index ?? 0) + 1,
    },
    {
      key: "description",
      name: "Description",
      fieldName: "description",
      minWidth: 250,
      onRender: (item) => item.description,
    },
    {
      key: "amount",
      name: "Amount",
      fieldName: "amount",
      minWidth: 55,
      className: rightAlignClass,

    },
  ];

  const data = invoice.service.map((s, idx) => ({
    key: idx.toString(),
    description: s.description || "N/A",
    amount: s.amount,
  })); 

  const vatAmount = (invoice.amount * invoice.vatPercentage) / 100;
  const total = invoice.amount + vatAmount;

  const { businessName, address } = invoice;
  const formattedAddress = [
    address?.building,
    address?.street,
    address?.city,
    address?.postalCode,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const printIcon: IIconProps = { iconName: 'Print' };

  const onRenderHeader = () => (
    <Stack
      horizontal
      verticalAlign="start"
      styles={{ root: {  width: '90%' } }}
    >
      <Stack.Item grow>
        <Label styles={{ root: { fontWeight: 'semibold', fontSize: 20 } }}>
          Invoice details - {invoice.invoiceId}
        </Label>
      </Stack.Item>

      <IconButton
        iconProps={printIcon}
        title="Print Invoice"
        ariaLabel="Print Invoice"
        onClick={() => handlePrint()}

      />
    </Stack>
  );

  return (
    <Panel
      isOpen
      onDismiss={onDismiss}
      type={PanelType.medium}
      closeButtonAriaLabel="Close"
      onRenderHeader={onRenderHeader}

    >
      <div ref={printRef} style={{ padding: 10 }}>
        <Stack tokens={{ childrenGap: 10 }}>
          <Label>To,</Label>
          <span><strong>{businessName || "N/A"}</strong></span>
          <span>{formattedAddress }</span>

          <Stack horizontal horizontalAlign="space-between" style={{ marginTop: 40 }}>
            <Stack>
              <Label>Invoice no:</Label>
              <span>{invoice.invoiceId}</span>
            </Stack>
            <Stack>
              <Label>Date:</Label>
              <span>{new Date(invoice.startDate).toLocaleDateString()}</span>
            </Stack>
            <Stack>
              <Label>Due date:</Label>
              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </Stack>
          </Stack>

          <DetailsList
            items={data}
            columns={columns}
            setKey="invoiceDetailsList"
            selectionMode={0}
          />

          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
            <Stack tokens={{ childrenGap: 2 }}>
              <span>Sub-total: £{invoice.amount.toFixed(2)}</span>
              <span>VAT ({invoice.vatPercentage}%): £{vatAmount.toFixed(2)}</span>
              <strong>Total: £{total.toFixed(2)}</strong>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </Panel>
  );
}