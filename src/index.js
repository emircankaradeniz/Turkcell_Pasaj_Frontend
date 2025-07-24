import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SepetProvider } from "./context/SepetContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
    <SepetProvider>
      <App />
    </SepetProvider>
  </AuthProvider>
);
