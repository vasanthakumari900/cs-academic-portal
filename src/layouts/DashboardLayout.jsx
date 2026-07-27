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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {displayItems.length > 0 && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <Sidebar items={displayItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className={`flex flex-1 flex-col ${displayItems.length > 0 ? 'lg:pl-64' : ''}`}>
        <DashboardTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
