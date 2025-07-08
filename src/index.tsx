import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeIcons } from "@fluentui/react";
import AppRoutes from "./AppRoutes";

initializeIcons();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <AppRoutes />
  </React.StrictMode>
);
