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
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              },
              success: {
                className: "!bg-green-50 !text-green-800 !border !border-green-200 dark:!bg-green-950 dark:!text-green-200 dark:!border-green-800",
                iconTheme: { primary: "#16A34A", secondary: "#F0FDF4" },
              },
              error: {
                className: "!bg-red-50 !text-red-800 !border !border-red-200 dark:!bg-red-950 dark:!text-red-200 dark:!border-red-800",
                iconTheme: { primary: "#DC2626", secondary: "#FEF2F2" },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
