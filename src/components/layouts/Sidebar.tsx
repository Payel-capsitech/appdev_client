import * as React from "react";
import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  Tooltip,
  Hamburger,
  makeStyles,
} from "@fluentui/react-components";
import {
  bundleIcon,
  Board20Filled,
  Board20Regular,
  Briefcase20Filled,
  Briefcase20Regular,
  Calendar20Filled,
  Calendar20Regular,
  People20Filled,
  People20Regular,
} from "@fluentui/react-icons";

// Simple styles for layout
const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    transition: "width 0.3s",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRight: "1px solid #ddd", 
  },
  expanded: {
    width: "260px",
  },
  collapsed: {
    width: "72px",
  },
  navBodyWrapper: {
    paddingLeft: "20px",
    paddingTop: "10px",
  },
  navItem: {
    marginBottom: "18px",
  },
  navText: {
    marginLeft: "12px",
  },
});

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Clients = bundleIcon(People20Filled, People20Regular);
const Tasks = bundleIcon(Briefcase20Filled, Briefcase20Regular);
const Deadlines = bundleIcon(Calendar20Filled, Calendar20Regular);

export const Sidebar = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.expanded : styles.collapsed}`}>
      <NavDrawer open={true} type="inline" multiple>
        <NavDrawerHeader>
          <Tooltip content={isOpen ? "Collapse" : "Expand"} relationship="label">
            <Hamburger onClick={() => setIsOpen(!isOpen)} />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          <div className={styles.navBodyWrapper}>
            <div className={styles.navItem}>
              <NavItem icon={<Dashboard />} value="1">
                {isOpen && <span className={styles.navText}>Dashboard</span>}
              </NavItem>
            </div>

            <div className={styles.navItem}>
              <NavItem icon={<Clients />} value="2">
                {isOpen && <span className={styles.navText}>Clients</span>}
              </NavItem>
            </div>

            <div className={styles.navItem}>
              <NavItem icon={<Tasks />} value="3">
                {isOpen && <span className={styles.navText}>Tasks</span>}
              </NavItem>
            </div>

            <div className={styles.navItem}>
              <NavItem icon={<Deadlines />} value="4">
                {isOpen && <span className={styles.navText}>Deadlines</span>}
              </NavItem>
            </div>
          </div>
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};
