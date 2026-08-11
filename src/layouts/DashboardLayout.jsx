import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardTopbar from "../components/layout/DashboardTopbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, items = [] }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Remove bookmarks and recently viewed from dashboard navigation
  const displayItems = items.filter(
    (item) => item.to !== "/student/bookmarks" && item.to !== "/student/recently-viewed"
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF0F2] text-[#2D060E]">
      {displayItems.length > 0 && (
        <div style={{ width: 'clamp(240px, 75vw, 288px)' }} className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
          <Sidebar items={displayItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className={`flex flex-1 flex-col ${displayItems.length > 0 ? 'lg:pl-[clamp(240px,75vw,288px)]' : ''}`}>
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
