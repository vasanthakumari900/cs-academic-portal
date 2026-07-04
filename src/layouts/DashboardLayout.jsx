// src/layouts/DashboardLayout.jsx
// Shared shell for Student / Faculty / Admin dashboards.
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiHome, FiPlayCircle, FiFileText, FiGrid, FiBriefcase } from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";

const studentNav = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/student/videos", label: "E-Content", icon: FiPlayCircle },
  { to: "/student/notes", label: "Lecture Notes", icon: FiFileText },
  { to: "/student/question-papers", label: "Question Papers", icon: FiGrid },
  { to: "/student/placements", label: "Placements", icon: FiBriefcase },
];

export default function DashboardLayout({ items, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = items || studentNav;
  const pageTitle = title || "Student Dashboard";

  return (
    <div className="flex min-h-screen bg-bg dark:bg-dark">
      <div className="fixed inset-0 pointer-events-none bg-grid dark:bg-grid-dark" />
      <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar title={pageTitle} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
