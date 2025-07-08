import React from "react";
import { Stack, IStackTokens, TextField, IconButton } from "@fluentui/react";

const addIcon = { iconName: "Add" };
const downloadIcon = { iconName: "Download" };
const refreshIcon = { iconName: "Refresh" };

const stackTokens: IStackTokens = { childrenGap: 10 };

interface ToolbarProps {
  onAddClick: () => void;
  onRefreshClick: () => void;
  onDownloadClick: () => void;
  onSearch: (searchText: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddClick,
  onRefreshClick,
  onDownloadClick,
  onSearch,
}) => {
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{ root: { borderBottom: "1px solid #ddd", padding: "8px 16px", backgroundColor: "#fff" } }}
      tokens={stackTokens}
    >
      <Stack horizontal tokens={stackTokens}>
        <IconButton iconProps={addIcon} title="Add" ariaLabel="Add" onClick={onAddClick} />
        <IconButton iconProps={downloadIcon} title="Download" ariaLabel="Download" onClick={onDownloadClick} />
        <IconButton iconProps={refreshIcon} title="Refresh" ariaLabel="Refresh" onClick={onRefreshClick} />
      </Stack>

      <TextField
        placeholder="Search business name..."
        onChange={(_, newValue) => onSearch(newValue || "")}
        styles={{ root: { width: 250 } }}
      />
    </Stack>
  );
};