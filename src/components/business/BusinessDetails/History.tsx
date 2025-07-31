import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Text,
  TextField,
  DatePicker,
  DayOfWeek,
  Icon,
  ICommandBarItemProps,
  CommandBar,
  PrimaryButton,
} from "@fluentui/react";
import API from "../../../services/api";

interface HistoryProps {
  businessId: string;
  refresh: boolean;
}

interface HistoryItem {
  id: string;
  businessCode: string;
  description: string;
  date: string;
  type: "Invoice" | "Business" | "Unknown" | 0 | 1 | 2;
  target: {
    id: string;
    name: string;
  };
  createdBy?: {
    createdByUserId: string;
    name: string;
    createdOn: string;
  };
}

export default function History({ businessId, refresh }: HistoryProps) {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const getHistoryTypeLabel = (type: HistoryItem["type"]): string => {
    if (type === "Invoice" || type === 2) return "Invoice";
    if (type === "Business" || type === 1) return "Business";
    return "Unknown";
  };

  const fetchHistories = useCallback(async () => {
    try {
      const businessRes = await API.get(`/business/${businessId}/history`);
      const businessData: HistoryItem[] = Array.isArray(businessRes.data) ? businessRes.data : [];

      let invoiceData: HistoryItem[] = [];

      const hasInvoice = businessData.some((item) => item.type === "Invoice" || item.type === 2);

      if (!hasInvoice) {
        const invoiceRes = await API.get(`/invoice/history/${businessId}`);
        invoiceData = Array.isArray(invoiceRes.data) ? invoiceRes.data : [];
      }

      const merged = [...businessData, ...invoiceData];
      merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistories(merged);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistories([]);
    }
  }, [businessId]);


  useEffect(() => {
    fetchHistories();
  }, [fetchHistories, refresh]);

  const parseIcon = (desc: string) => {
    const lower = desc?.toLowerCase() ?? "";

    if (lower.includes("created")) return { iconName: "Add", color: "#107C10", cleanText: desc };
    if (lower.includes("updated")) return { iconName: "Edit", color: "#0078D4", cleanText: desc };
    if (lower.includes("deleted")) return { iconName: "Delete", color: "#A80000", cleanText: desc };

    return { iconName: "Info", color: "#605E5C", cleanText: desc };
  };

  const filtered = histories.filter((h) => {
    const matchesSearch = h.description?.toLowerCase().includes(search.toLowerCase());
    const date = new Date(h.date);
    const startMatch = fromDate ? date >= fromDate : true;
    const endMatch = toDate ? date <= toDate : true;
    return matchesSearch && startMatch && endMatch;
  });

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "refresh",
      text: "Refresh",
      iconProps: { iconName: "Refresh" },
      onClick: () => {
        fetchHistories();
      },
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: "search",
      onRender: () => (
        <TextField
          placeholder="Search description"
          value={search}
          onChange={(_, v) => setSearch(v || "")}
          iconProps={{ iconName: "Search" }}
          styles={{ root: { marginRight: 8, width: 200 } }}
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
          styles={{ root: { width: 140, marginRight: 8 } }}
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
          styles={{ root: { width: 140, marginRight: 8 } }}
        />
      ),
    },
    {
      key: "clear",
      onRender: () => (
        <PrimaryButton
          text="Clear Filters"
          onClick={() => {
            setSearch("");
            setFromDate(undefined);
            setToDate(undefined);
          }}
          style={{ height: 32, marginRight: 4 }}
        />
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <CommandBar
        items={commandBarItems}
        farItems={commandBarFarItems}
        styles={{ root: { padding: 0, backgroundColor: "transparent", marginBottom: 12 } }}
      />

      {filtered.map((h) => {
        const { iconName, color, cleanText } = parseIcon(h.description);
        const formattedDate = new Date(h.date).toLocaleString();
        const userName = h.createdBy?.name || "";
        const typeLabel = getHistoryTypeLabel(h.type);

        return (
          <Stack
            key={h.id}
            styles={{
              root: {
                padding: 8,
                borderRadius: 6,
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
              },
            }}
          >
            <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
              <Icon iconName={iconName} styles={{ root: {  color,fontSize: 16 } }} />
              <Text variant="smallPlus" styles={{ root: { fontWeight: 600 } }}>
                <strong>{typeLabel}</strong> — {cleanText}
              </Text>
            </Stack>

            <Text variant="small" styles={{ root: { marginTop: 4, color: "#666" } }}>
              {formattedDate} | By: {userName}
            </Text>
          </Stack>
        );
      })}

      {filtered.length === 0 && (
        <Text variant="small" styles={{ root: { marginTop: 10, color: "#888" } }}>
          No history found.
        </Text>
      )}
    </Stack>
  );
}
