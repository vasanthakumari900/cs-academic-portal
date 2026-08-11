// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F2] dark:bg-[#190B13] text-[#2A0D13] dark:text-[#F0E2E6]">
      <Navbar />
      <main className="relative flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
