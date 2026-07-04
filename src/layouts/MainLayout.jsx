// src/layouts/MainLayout.jsx
// Public-facing layout: navbar + page content + footer.
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LoadingScreen from "../components/ui/LoadingScreen";

export default function MainLayout() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (booting) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-dark dark:bg-dark dark:text-white">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none bg-grid dark:bg-grid-dark" />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
