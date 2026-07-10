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
    <div className="flex min-h-screen flex-col bg-[#080D1A]">
      {/* Premium dark mesh background */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-deep" />
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb h-72 w-72 bg-blue-500/5" style={{top:'15%',right:'10%','--duration':'8s','--delay':'0s'}} />
        <div className="orb h-56 w-56 bg-indigo-500/5" style={{top:'40%',left:'5%','--duration':'10s','--delay':'2s'}} />
        <div className="orb h-40 w-40 bg-cyan-500/5" style={{bottom:'10%',right:'20%','--duration':'7s','--delay':'1s'}} />
      </div>
      <Navbar />
      <main className="relative flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
