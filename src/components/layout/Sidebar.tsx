import * as React from "react";
import { Nav, INavLinkGroup, INavStyles, IconButton } from "@fluentui/react";
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
          icon: "People",
          url: "#",
          onClick: (e?: React.MouseEvent<HTMLElement>) => {
            e?.preventDefault();
            navigate("/dashboard/clients");
          },
        },
        {
          name: isCollapsed ? "" : "Tasks",
          key: "tasks",
          icon: "TaskLogo",
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
      boxSizing: "border-box",
      border: "1px solid #eee",
      overflowX: "hidden",
      transition: "width 0.3s",
    },
    groupContent: {
      paddingLeft: isCollapsed ? 0 : 10,
    },
    navItems: {
      paddingLeft: isCollapsed ? 0 : 10,
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "8px" }}>
        <IconButton
          iconProps={{ iconName: "GlobalNavButton" }}
          title="Toggle"
          ariaLabel="Toggle Sidebar"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <Nav groups={navLinkGroups} styles={navStyles} />
    </div>
  );
};
