import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ShimmeredDetailsList,
  IColumn,
  IconButton,
  Stack,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";

interface Business {
  businessId: string;
  businessCode: string;
  serialNumber: number;
  type: string;
  name: string;
  phoneNumber: string;
  createdOn: string;
}

interface ContextType {
  businesses: Business[];
  fetchBusinesses: () => Promise<void>;
  loading: boolean;
}

export default function BusinessList() {
  const navigate = useNavigate();
  const { businesses, fetchBusinesses, loading } = useOutletContext<ContextType>();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const totalPages = Math.ceil(businesses.length / pageSize);
  const paginatedBusinesses = businesses.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const columns: IColumn[] = [
    {
      key: "serialNumber",
      name: "S.No",
      fieldName: "serialNumber",
      minWidth: 40,
      maxWidth: 40,
      isResizable: false,
      onRender: (_, index) => (page - 1) * pageSize + (index ?? 0) + 1,
    },
    {
      key: "businessCode",
      name: "Business code",
      fieldName: "businessCode",
      minWidth: 100,
      maxWidth: 100,
    },
    {
      key: "name",
      name: "Business name",
      fieldName: "name",
      minWidth: 200,
      maxWidth: 250,
      onRender: (item) => (
        <span
          style={{ color: "#0078D4", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate(`/dashboard/business/${item.businessId}`)}
        >
          {item.name}
        </span>
      ),
    },
    {
      key: "type",
      name: "Type",
      fieldName: "type",
      minWidth: 50,
      maxWidth: 70,
    },
    {
      key: "phoneNumber",
      name: "Phone",
      fieldName: "phoneNumber",
      minWidth: 80,
      maxWidth: 80,
    },
    {
      key: "createdOn",
      name: "Created on",
      fieldName: "createdOn",
      minWidth: 100,
      maxWidth: 100,
      onRender: (item) => new Date(item.createdOn).toLocaleString(),
    },
    
  ];

  const pageSizeOptions: IDropdownOption[] = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 15, text: "15" },
    { key: 20, text: "20" },
  ];

  const handlePageSizeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      setPageSize(option.key as number);
      setPage(1);
    }
  };

  return (
    <Stack style={{ width: "100%", height: "100%", maxHeight: "100vh", position: "relative" }}>
      <div style={{ overflowY: "auto", flex: 1}}>
        <ShimmeredDetailsList
          items={loading ? [] : paginatedBusinesses}
          columns={columns}
          setKey="businessList"
          isHeaderVisible={true}
          enableShimmer={loading}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForShimmer="Loading businesses"
        />
      </div>

      {!loading && (
        <div
          style={{
            position: "sticky",
            bottom: 4,
            padding: "10px 20px",
          }}
        >
          <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
              <span style={{ fontSize: 13 }}>Show</span>
              <Dropdown
                selectedKey={pageSize}
                options={pageSizeOptions}
                onChange={handlePageSizeChange}
                styles={{
                  dropdown: { width: 55 },
                }}
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
        </div>
      )}
    </Stack>

  );

}
