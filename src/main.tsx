import { createRoot } from "react-dom/client";
import "./index.css";
import { AppWithLayout } from "./components/game/AppWithLayout.tsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithLayout />
    </BrowserRouter>
  </StrictMode>
);
