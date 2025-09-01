import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AppWithLayout from "./components/application/AppWithLayout";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithLayout />
    </BrowserRouter>
  </StrictMode>
);
