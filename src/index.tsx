import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { initializeIcons } from "@fluentui/react";

initializeIcons();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <App />
);