// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={10}
            containerClassName="!mt-16"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "14px",
                padding: "14px 18px",
                fontSize: "14px",
                fontWeight: 500,
                backdropFilter: "blur(24px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
              },
              success: {
                className: "!bg-white/80 !text-emerald-800 !border !border-emerald-200/50 !shadow-premium",
                iconTheme: { primary: "#10B981", secondary: "#ECFDF5" },
              },
              error: {
                className: "!bg-white/80 !text-red-800 !border !border-red-200/50 !shadow-premium",
                iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
