// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiHome,
  FiPlayCircle,
  FiFileText,
  FiBriefcase,
  FiBookmark,
  FiUser,
  FiClock,
  FiUpload,
  FiUploadCloud,
  FiList,
  FiUsers,
  FiVideo,
  FiBarChart2,
  FiSettings,
  FiUserCheck,
} from "react-icons/fi";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
// Auth removed — all logged-in students go to the dashboard directly.
// Faculty/Admin routes are preserved for admin panel access.
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROLES } from "./utils/constants";

// Public pages
import Home from "./pages/Home";
import EContent from "./pages/EContent";
import Notes from "./pages/Notes";
import QuestionPapers from "./pages/QuestionPapers";
import Placements from "./pages/Placements";
import About from "./pages/About";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

// Auth
import Login from "./pages/auth/Login";

// Student Dashboard — shows E-Content directly
import StudentDashboard from "./pages/student/StudentDashboard";

// Public pages also accessible from student dashboard
import StudentEContent from "./pages/EContent";
import StudentNotes from "./pages/Notes";
import StudentQuestionPapers from "./pages/QuestionPapers";
import StudentPlacements from "./pages/Placements";



// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageFaculty from "./pages/admin/ManageFaculty";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageNotes from "./pages/admin/ManageNotes";
import ManageQuestionPapers from "./pages/admin/ManageQuestionPapers";
import ManagePlacements from "./pages/admin/ManagePlacements";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}

const studentNav = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/student/videos", label: "Videos", icon: FiPlayCircle },
  { to: "/student/notes", label: "Notes", icon: FiFileText },
  { to: "/student/question-papers", label: "Question Papers", icon: FiFileText },
  { to: "/student/placements", label: "Placements", icon: FiBriefcase },
  { to: "/student/bookmarks", label: "Bookmarks", icon: FiBookmark },
  { to: "/student/recently-viewed", label: "Recently Viewed", icon: FiClock },
  { to: "/student/profile", label: "Profile", icon: FiUser },
];


const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/admin/users", label: "Manage Users", icon: FiUsers },
  { to: "/admin/faculty", label: "Manage Faculty", icon: FiUserCheck },
  { to: "/admin/students", label: "Manage Students", icon: FiUsers },
  { to: "/admin/videos", label: "Manage Videos", icon: FiVideo },
  { to: "/admin/notes", label: "Manage Notes", icon: FiFileText },
  { to: "/admin/question-papers", label: "Manage Question Papers", icon: FiFileText },
  { to: "/admin/placements", label: "Manage Placements", icon: FiBriefcase },
  { to: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ─── Auth pages — always public ─── */}
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><Login /></AnimatedPage>} />

        {/* ─── Everything else requires authentication ─── */}
        <Route element={<ProtectedRoute />}>
          {/* Public-style pages with navbar & footer (accessible after login) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/e-content" element={<AnimatedPage><EContent /></AnimatedPage>} />
            <Route path="/notes" element={<AnimatedPage><Notes /></AnimatedPage>} />
            <Route path="/question-papers" element={<AnimatedPage><QuestionPapers /></AnimatedPage>} />
            <Route path="/placements" element={<AnimatedPage><Placements /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/search" element={<AnimatedPage><Search /></AnimatedPage>} />
          </Route>

          {/* Student dashboard */}
          <Route element={<DashboardLayout title="Student Dashboard" />}>
            <Route path="/student/dashboard" element={<AnimatedPage><StudentDashboard /></AnimatedPage>} />
            <Route path="/student/videos" element={<AnimatedPage><StudentEContent /></AnimatedPage>} />
            <Route path="/student/notes" element={<AnimatedPage><StudentNotes /></AnimatedPage>} />
            <Route path="/student/question-papers" element={<AnimatedPage><StudentQuestionPapers /></AnimatedPage>} />
            <Route path="/student/placements" element={<AnimatedPage><StudentPlacements /></AnimatedPage>} />
          </Route>

          {/* Admin dashboard */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<DashboardLayout title="Admin Dashboard" items={adminNav} />}>
              <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
              <Route path="/admin/users" element={<AnimatedPage><ManageUsers /></AnimatedPage>} />
              <Route path="/admin/faculty" element={<AnimatedPage><ManageFaculty /></AnimatedPage>} />
              <Route path="/admin/students" element={<AnimatedPage><ManageStudents /></AnimatedPage>} />
              <Route path="/admin/videos" element={<AnimatedPage><ManageVideos /></AnimatedPage>} />
              <Route path="/admin/notes" element={<AnimatedPage><ManageNotes /></AnimatedPage>} />
              <Route path="/admin/question-papers" element={<AnimatedPage><ManageQuestionPapers /></AnimatedPage>} />
              <Route path="/admin/placements" element={<AnimatedPage><ManagePlacements /></AnimatedPage>} />
              <Route path="/admin/analytics" element={<AnimatedPage><Analytics /></AnimatedPage>} />
              <Route path="/admin/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}
