import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import { BrixProvider } from "./BrixContext.jsx";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <BrixProvider>
        <App />
      </BrixProvider>
    </BrowserRouter>
    <Analytics />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
