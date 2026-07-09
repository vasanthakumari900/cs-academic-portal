// src/layouts/DashboardLayout.jsx
// Premium dashboard layout with animated gradient background.
import { Outlet } from "react-router-dom";
import DashboardTopbar from "../components/layout/DashboardTopbar";

export default function DashboardLayout({ title }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      {/* Premium mesh background */}
      <div className="fixed inset-0 pointer-events-none bg-mesh" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb h-32 w-32 bg-blue-300/10" style={{top:'10%',right:'5%','--duration':'7s','--delay':'0s'}} />
        <div className="orb h-40 w-40 bg-indigo-300/8" style={{bottom:'15%',left:'3%','--duration':'9s','--delay':'2s'}} />
        <div className="orb h-24 w-24 bg-purple-300/8" style={{top:'50%',right:'15%','--duration':'8s','--delay':'1s'}} />
        
        {/* Glass grid overlay */}
        <div className="absolute inset-0 bg-grid-subtle" />
      </div>
      
      <DashboardTopbar title={title} />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
