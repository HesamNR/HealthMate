import "./style.css";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./style.css";
import App from "./App";
import Footer from "./components/Footer";

// Wrapper component to conditionally render footer
function AppWrapper() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <>
      <App />
      {!isChatPage && <Footer />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </StrictMode>
);
