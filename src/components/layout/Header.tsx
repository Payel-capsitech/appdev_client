import React, { useState, useRef, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
  Text,
  Callout,
  DirectionalHint,
  DefaultButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";


const headerStyles = {
  root: {
    height: 50,
    backgroundColor: "#0078D4",
    padding: "0 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  section: {
    display: "flex",
    alignItems: "center",
  },
};

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Get user data safely from localStorage
  const [user, setUser] = useState<{ email: string; role: string }>({
    email: "Guest",
    role: "guest",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        const parsed = JSON.parse(storedUser);
        setUser({ email: parsed.email, role: parsed.role });
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={headerStyles.root}>
      <Stack horizontal verticalAlign="center" styles={{ root: headerStyles.section }}>
        <Text variant="mediumPlus" styles={{ root: { color: "#fff" } }}>
          Acting Office - Dev
        </Text>
      </Stack>

      <Stack horizontal verticalAlign="center" styles={{ root: headerStyles.section }} tokens={{ childrenGap: 12 }}>
        <TextField placeholder="Ctrl + K" styles={{ field: { color: "#000" } }} />

        <div ref={buttonRef}>
          <IconButton
            iconProps={{ iconName: "Contact" }}
            title="Profile"
            ariaLabel="Profile"
            onClick={() => setIsCalloutVisible(!isCalloutVisible)}
            styles={{
              root: { color: "#fff" },
              rootHovered: { backgroundColor: "#106EBE", color: "#fff" },
            }}
          />
        </div>

        {isCalloutVisible && (
          <Callout
            target={buttonRef.current}
            onDismiss={() => setIsCalloutVisible(false)}
            directionalHint={DirectionalHint.bottomRightEdge}
            gapSpace={8}
            setInitialFocus
          >
            <div style={{ padding: 16, minWidth: 200 }}>
              <Text variant="mediumPlus" block>Email: {user.email}</Text>

              <Text variant="mediumPlus" block style={{ marginTop: 8 }}>
                Role:{user.role}
              </Text>

              <DefaultButton 
                text="Logout"
                onClick={handleLogout}
                styles={{ root: { marginTop: 12 } }}
              />
            </div>
          </Callout>
        )}
      </Stack>
    </div>
  );
};
