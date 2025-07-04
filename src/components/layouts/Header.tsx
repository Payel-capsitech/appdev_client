import React from "react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { SearchBox } from "@fluentui/react-search-preview";
import {
  Avatar,
  Text,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { PersonCircle24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "50px",
    backgroundColor: "#0078D4", // Blue header
    paddingLeft: "16px",
    paddingRight: "16px",
    color: "white",
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  search: {
    maxWidth: "150px",
  },
  menuItemText: {
    fontSize: "14px",
    padding: "4px 8px",
  },
});

export const Header = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  // Get user data from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", role: "Role" };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <Text weight="semibold" size={400}>
          Acting Office - Dev
        </Text>
      </div>

      <div className={styles.rightSection}>
        <SearchBox
          placeholder="Ctrl + K"
          className={styles.search}
          appearance="outline" 
        />

        {/* Avatar with dropdown */}
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Avatar icon={<PersonCircle24Regular />} color="colorful" />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem disabled className={styles.menuItemText}>
                {user.name} ({user.role})
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
};
