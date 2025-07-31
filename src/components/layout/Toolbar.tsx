import React, { useEffect, useState } from "react";
import {
  Stack,
  IStackTokens,
  TextField,
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react";

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
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchInput);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, onSearch]);

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "add",
      text: "Add",
      iconProps: { iconName: "Add",title:"Add Business" },
      onClick: onAddClick,
    },
    {
      key: "download",
      text: "Download",
      iconProps: { iconName: "Download",title:"Download"},
      onClick: onDownloadClick,
    },
    {
      key: "refresh",
      text: "Refresh",
      iconProps: { iconName: "Refresh",title:"Refresh" },
      onClick: onRefreshClick,
    },
  ];

  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{
        root: {
          borderBottom: "1px solid #ddd",
          padding: "2px 25px",
        },
      }}
      tokens={stackTokens}
    >
      <CommandBar
        items={commandBarItems}
        styles={{ root: { padding: 0 } }}
      />

      <TextField
        placeholder="Search business name"
        value={searchInput}
        onChange={(_, newValue) => {
            setSearchInput(newValue || "")
        }}
        styles={{ root: { width: 200,border: "1px #c7bfbfff" } }}
      />
    </Stack>
  );
};
