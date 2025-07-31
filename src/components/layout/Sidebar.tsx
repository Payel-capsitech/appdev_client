import * as React from "react";
import { Nav, INavLinkGroup, INavStyles, IconButton, Stack } from "@fluentui/react";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: isCollapsed ? "" : "Dashboard",
          key: "dashboard",
          icon: "ViewDashboard",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard");
          },
        },
        {
          name: isCollapsed ? "" : "Clients",
          key: "clients",
          icon: "Suitcase",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard/clients");
          },
        },
        {
          name: isCollapsed ? "" : "Invoices",
          key: "Invoices",
          icon: "ReportDocument",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard/Invoices");
          },
        },
        {
          name: isCollapsed ? "" : "Tasks",
          key: "tasks",
          icon: "TaskManager",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard/tasks");
          },
        },
        {
          name: isCollapsed ? "" : "Deadlines",
          key: "deadlines",
          icon: "Calendar",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard/deadlines");
          },
        },
      ],
    },
  ];

  const navStyles: Partial<INavStyles> = {
    root: {
      width: isCollapsed ? 60 : 220,
      height: "100vh",
      borderRight: "1px solid #eee",
      boxSizing: "border-box",
      overflowX: "hidden",
      transition: "width 0.3s",
    },
    groupContent: { paddingLeft: isCollapsed ? 0 : 10 },
    navItems: { paddingLeft: isCollapsed ? 0 : 10 },
  };

  return (
    <Stack verticalFill styles={{ root: { height: "100vh", margin: 0, padding: 0 } }}>
      <Stack horizontal verticalAlign="center" styles={{ root: { justifyContent: "flex-start", paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: isCollapsed ? 10 : 16 } }}>
        <IconButton
          iconProps={{ iconName: "GlobalNavButton" }}
          title="Toggle"
          ariaLabel="Toggle Sidebar"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </Stack>
      <Nav groups={navLinkGroups} styles={navStyles} />
    </Stack>
  );
};
