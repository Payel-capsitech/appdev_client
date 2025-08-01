import React, { useState, useRef } from "react";
import {
  Stack,
  TextField,
  Text,
  Callout,
  DirectionalHint,
  DefaultButton,
  Persona,
  PersonaSize,
  IStackStyles,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const headerStackStyles: IStackStyles = {
  root: {
    height: 35,
    backgroundColor: "#0078D4",
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
};

const sectionStackStyles: IStackStyles = {
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
  },
};

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutDialog(false);
    navigate("/login");
  };

  return (
    <>
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        styles={headerStackStyles}
      >
        <Stack horizontal verticalAlign="center" styles={sectionStackStyles}>
          <Text
            variant="large"
            styles={{ root: { color: "#fff", fontWeight: 500 } }}
          >
            Acting Office - Dev
          </Text>
        </Stack>

        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 12 }}
          styles={sectionStackStyles}
        >
          <TextField
            placeholder="Ctrl + K"
            styles={{
              root: { width: 200 },
              fieldGroup: {
                borderRadius: 6,
                border: "1px solid #ccc",
              },
            }}
          />

          <Stack
            horizontal
            verticalAlign="center"
            styles={{ root: { position: "relative" } }}
          >
            <div
              ref={personaRef}
              onMouseDown={(e) => {
                if (
                  personaRef.current &&
                  personaRef.current.contains(e.target as Node)
                ) {
                  setIsCalloutVisible((prev) => !prev);
                }
              }}
              style={{
                cursor: "pointer",
                borderRadius: 20,
                border: "1px solid white",
              }}
            >
              <Persona
                text={user?.email || "Guest"}
                secondaryText={user?.role || "guest"}
                size={PersonaSize.size32}
                hidePersonaDetails={true}
                styles={{
                  root: { backgroundColor: "transparent" },
                  primaryText: { color: "#fff" },
                  secondaryText: { color: "#f3f2f1" },
                }}
              />
            </div>

            {isCalloutVisible && personaRef.current && (
              <Callout
                target={personaRef.current}
                onDismiss={() => setIsCalloutVisible(false)}
                directionalHint={DirectionalHint.bottomRightEdge}
                directionalHintFixed={true}
                gapSpace={8}
              >
                <Stack
                  tokens={{ childrenGap: 8 }}
                  styles={{
                    root: {
                      padding: 16,
                      minWidth: 180,
                    },
                  }}
                >
                  <Persona
                    text={user?.email || "Guest"}
                    secondaryText={user?.role || "guest"}
                    size={PersonaSize.size40}
                  />
                  <DefaultButton
                    text="Logout"
                    onClick={() => {
                      setShowLogoutDialog(true);
                      setIsCalloutVisible(false);
                    }}
                    styles={{ root: { marginTop: 8 } }}
                  />
                </Stack>
              </Callout>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Dialog
        hidden={!showLogoutDialog}
        onDismiss={() => setShowLogoutDialog(false)}
        dialogContentProps={{
          type: DialogType.normal,
          subText: "Are you sure you want to logout?",
        }}
      >
        <Stack>
          <DialogFooter>
            <DefaultButton
              onClick={() => setShowLogoutDialog(false)}
              text="Cancel"
            />
            <PrimaryButton onClick={handleLogoutConfirm} text="Logout" />
          </DialogFooter>
        </Stack>
      </Dialog>
    </>
  );
};
