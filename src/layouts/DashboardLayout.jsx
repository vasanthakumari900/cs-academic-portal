import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardTopbar from "../components/layout/DashboardTopbar";
import Sidebar from "../components/layout/Sidebar";
export default function DashboardLayout({ title, items = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#080D1A]">
      {/* Dark mesh background */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-deep" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb h-32 w-32 bg-blue-500/5" style={{top:'10%',right:'5%','--duration':'7s','--delay':'0s'}} />
        <div className="orb h-40 w-40 bg-indigo-500/5" style={{bottom:'15%',left:'3%','--duration':'9s','--delay':'2s'}} />
        <div className="orb h-24 w-24 bg-cyan-500/5" style={{top:'50%',right:'15%','--duration':'8s','--delay':'1s'}} />
        <div className="absolute inset-0 bg-grid-subtle" />
      </div>

      {items.length > 0 && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <Sidebar items={items} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className={`flex flex-1 flex-col ${items.length > 0 ? 'lg:pl-64' : ''}`}>
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
