import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";

interface Business {
  id: string;
  serialNumber: number;
  type: string;
  name: string;
  phoneNumber: string;
  createdOn: string;
}

export default function BusinessList() {
  const { businesses }: { businesses: Business[] } = useOutletContext();
  const navigate = useNavigate();

  const columns: IColumn[] = [
    { key: "serialNumber", name: "S.No", fieldName: "serialNumber", minWidth: 50, isResizable: true },
    { key: "id", name: "ID", fieldName: "id", minWidth: 200, isResizable: true },
    {
      key: "name",
      name: "Business Name",
      fieldName: "name",
      minWidth: 120,
      isResizable: true,
      onRender: (item) => (
        <a
          style={{ color: "#0078D4", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate(`/dashboard/business/${item.id}`)}
        >
          {item.name}
        </a>
      ),
    },
    { key: "type", name: "Type", fieldName: "type", minWidth: 100, isResizable: true },
    { key: "phoneNumber", name: "Phone", fieldName: "phoneNumber", minWidth: 100, isResizable: true },
    {
      key: "createdOn",
      name: "Created On",
      fieldName: "createdOn",
      minWidth: 150,
      isResizable: true,
      onRender: (item) => new Date(item.createdOn).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Business List</h2>

      <DetailsList
        items={businesses}
        columns={columns}
        setKey="businessList"
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionMode={SelectionMode.none}
        styles={{ root: { backgroundColor: "#fff" } }}
      />
    </div>
  );
}
