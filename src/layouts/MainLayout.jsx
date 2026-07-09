// src/layouts/MainLayout.jsx
// Premium public-facing layout with glass navbar + footer.
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
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      {/* Premium mesh background */}
      <div className="fixed inset-0 pointer-events-none bg-mesh" />
      <Navbar />
      <main className="relative flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
