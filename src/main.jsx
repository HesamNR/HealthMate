import "./style.css";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Footer from "./components/Footer";
import "@fontsource/roboto";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
