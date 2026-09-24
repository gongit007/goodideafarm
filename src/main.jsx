import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { BrixProvider } from "./BrixContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BrixProvider>
        <App />
      </BrixProvider>
    </BrowserRouter>
  </React.StrictMode>
);
