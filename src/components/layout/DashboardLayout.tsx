import React, { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { mergeStyleSets } from "@fluentui/react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { AddBusinessPanel } from "../business/AddBusinessPannel";
import api from "../../services/api";


const useStyles = mergeStyleSets({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    height: "100%",
  },
  mainContent: {
    flexGrow: 1,
    overflowY: "auto",
  },
  fixedToolbar: {
    position: "sticky",
  },
});

const businessTypeEnumMap: Record<string, number> = {
  Unknmown: 0,
  Limited: 1,
  LLP: 2,
  Indivisual: 3,
};

const DashboardLayout: React.FC = () => {
  const classes = useStyles;
  const location = useLocation();
  const hasFetchedRef = useRef(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [user, setUser] = useState<{
    username: string;
    email: string;
    id: string;
    role: string;
  } | null>(null);

  const fetchBusinesses = useCallback(async () => {
  setLoadingBusinesses(true); 
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.get("/business/user-businesses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBusinesses(response.data);
  } catch (error) {
    console.error("Error fetching businesses", error);
  } finally {
    setLoadingBusinesses(false); 
  }
}, []);

  const fetchUserDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/auth/userdetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  }, []);

  const handleSearchBusinesses = async (query: string) => {
    try {
      if(query==="") return;
      const token = localStorage.getItem("authToken");
      const response = await api.get(`/business/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error searching businesses", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchBusinesses();
      fetchUserDetails();
      hasFetchedRef.current = true;
    }
  }, [fetchBusinesses, fetchUserDetails]);

  const handleAddClick = () => setIsPanelOpen(true);

  const handleSaveBusiness = async (newBusiness: any) => {
    try {
      const payload = {
        name: newBusiness.name,
        type: businessTypeEnumMap[newBusiness.type],
        phoneNumber: newBusiness.phoneNumber,
        address: {
          country: newBusiness.country,
          city: newBusiness.city,
          postalCode: newBusiness.postalCode,
          building: newBusiness.building,
          street: newBusiness.street,
        },
      };

      await api.post("/business/add", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      await fetchBusinesses();
    } catch (error) {
      console.error("Error saving business", error);
    }
  };

  const isBusinessPage =
  location.pathname.startsWith("/dashboard/business/") ||
  location.pathname.startsWith("/dashboard/Invoices");

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.contentWrapper}>
        <Header />

        {!isBusinessPage && (
          <div className={classes.fixedToolbar}>
            <Toolbar
              onAddClick={handleAddClick}
              onRefreshClick={fetchBusinesses}
              onDownloadClick={() => console.log("Download clicked")}
              onSearch={handleSearchBusinesses}
            />
          </div>
        )}

        <div className={classes.mainContent}>
          <Outlet context={{ businesses, fetchBusinesses, loading: loadingBusinesses, user }} />
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
