import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SepetProvider } from "./context/BasketContext";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <SepetProvider>
          <App />
        </SepetProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
