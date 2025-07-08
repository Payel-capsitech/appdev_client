import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { mergeStyleSets } from "@fluentui/react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { AddBusinessPanel } from "../business/AddBusinessPannel";
import api from "../../services/api";

const useStyles = mergeStyleSets({
  root: { display: "flex", height: "100vh", overflow: "hidden" },
  contentArea: { flexGrow: 1, display: "flex", flexDirection: "column" },
  mainContent: { flexGrow: 1, overflow: "auto", padding: 16, backgroundColor: "#f9fafb" },
});

const DashboardLayout: React.FC = () => {
  const styles = useStyles;
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Fetching businesses with token:", token);  
      const response = await api.get("/business/my");  
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses", error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleAddClick = () => setIsPanelOpen(true);

  const handleSaveBusiness = async (newBusiness: any) => {
    try {
      await api.post("/business/add", newBusiness); // Token auto-added
      fetchBusinesses();
      setIsPanelOpen(false);
    } catch (error) {
      console.error("Error saving business", error);
    }
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Header />
        <Toolbar
          onAddClick={handleAddClick}
          onRefreshClick={fetchBusinesses}
          onDownloadClick={() => console.log("Download clicked")}
          onSearch={(text) => console.log("Searching for:", text)}
        />
        <div className={styles.mainContent}>
          <Outlet context={{ businesses }} />
        </div>
        <AddBusinessPanel
          isOpen={isPanelOpen}
          onDismiss={() => setIsPanelOpen(false)}
          onSave={handleSaveBusiness}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
