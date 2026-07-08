// src/layouts/DashboardLayout.jsx
// Clean student layout — no sidebar, just top bar + content
import { Outlet } from "react-router-dom";
import DashboardTopbar from "../components/layout/DashboardTopbar";

export default function DashboardLayout({ title }) {
  return (
    <div className="flex min-h-screen flex-col bg-animated-gradient">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="particle h-12 w-12 bg-blue-200/15 blur-xl" style={{top:'15%',right:'8%',width:'60px',height:'60px','--duration':'11s','--delay':'0s'}} />
        <div className="particle h-8 w-8 bg-indigo-200/10 blur-xl" style={{bottom:'20%',left:'5%',width:'40px',height:'40px','--duration':'9s','--delay':'2s'}} />
        <div className="particle h-16 w-16 bg-purple-200/10 blur-xl" style={{top:'50%',right:'3%',width:'80px',height:'80px','--duration':'13s','--delay':'1s'}} />
      </div>
      <DashboardTopbar title={title} />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
