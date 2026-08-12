import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CommandPalette from "./components/common/CommandPalette";

import {
  FiHome,
  FiPlayCircle,
  FiFileText,
  FiBriefcase,
  FiBookmark,
  FiUser,
  FiClock,
  FiUsers,
  FiVideo,
  FiBarChart2,
  FiSettings,
  FiUserCheck,
  FiAward,
  FiCheckSquare,
  FiMessageSquare,
  FiActivity,
  FiCalendar,
} from "react-icons/fi";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentLayout from "./layouts/StudentLayout";
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
import InterviewExperiences from "./pages/InterviewExperiences";
import CollegeCalendar from "./pages/CollegeCalendar";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Student Dashboard & pages
import StudentDashboard from "./pages/student/StudentDashboard";
import CIAQuestionPapers from "./pages/student/CIAQuestionPapers";
import Bookmarks from "./pages/student/Bookmarks";
import RecentlyViewed from "./pages/student/RecentlyViewed";
import Profile from "./pages/student/Profile";
import StudentAssignments from "./pages/student/Assignments";
import ExamStudyPlanner from "./pages/student/ExamStudyPlanner";

// Public pages also accessible from student dashboard
import StudentEContent from "./pages/EContent";
import StudentNotes from "./pages/Notes";
import StudentQuestionPapers from "./pages/QuestionPapers";
import StudentPlacements from "./pages/Placements";

// Faculty pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyNotes from "./pages/faculty/Notes";
import FacultyVideos from "./pages/faculty/Videos";
import FacultyQuestionPapers from "./pages/faculty/QuestionPapers";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";

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
import ManageCiaTimetable from "./pages/admin/ManageCiaTimetable";
import ChatBot from "./components/chatbot/ChatBot";

const pageVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.97,
    y: 8,
  },
  enter: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.35, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97,
    y: -8,
    transition: { 
      duration: 0.25, 
      ease: [0.5, 0, 0.75, 0] 
    } 
  },
};

function AnimatedPage({ children }) {
  return (
    <motion.div 
      variants={pageVariants} 
      initial="initial" 
      animate="enter" 
      exit="exit"
      className="w-full h-full max-w-full overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}

const studentNav = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/student/videos", label: "Videos", icon: FiPlayCircle },
  { to: "/student/notes", label: "Notes", icon: FiFileText },
  { to: "/college-calendar", label: "College Calendar", icon: FiCalendar },
  { to: "/student/assignments", label: "Assignments", icon: FiCheckSquare },
  { to: "/student/question-papers", label: "Question Papers", icon: FiFileText },
  { to: "/student/placements", label: "Placement Details", icon: FiBriefcase },
  { to: "/student/profile", label: "Profile", icon: FiUser },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/admin/users", label: "Manage Users", icon: FiUsers },
  { to: "/admin/faculty", label: "Manage Faculty", icon: FiUserCheck },
  { to: "/admin/students", label: "Manage Students", icon: FiUsers },
  { to: "/admin/cia-timetable", label: "CIA Timetables", icon: FiAward },
  { to: "/admin/videos", label: "Manage Videos", icon: FiVideo },
  { to: "/admin/notes", label: "Manage Notes", icon: FiFileText },
  { to: "/admin/question-papers", label: "Manage Question Papers", icon: FiFileText },
  { to: "/admin/placements", label: "Manage Placements", icon: FiBriefcase },
  { to: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const facultyNav = [
  { to: "/faculty/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/faculty/notes", label: "Upload Notes", icon: FiFileText },
  { to: "/faculty/videos", label: "Video Lectures", icon: FiPlayCircle },
  { to: "/faculty/question-papers", label: "Upload Semester Question Papers", icon: FiFileText },
  { to: "/faculty/cia-papers", label: "Upload CIA Papers", icon: FiAward },
];

export default function App() {

  const location = useLocation();
  const [isGlobalPaletteOpen, setIsGlobalPaletteOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsGlobalPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <>
        <ChatBot />
        <CommandPalette
          isOpen={isGlobalPaletteOpen}
          onClose={() => setIsGlobalPaletteOpen(false)}
        />

        <Routes location={location} key={location.pathname}>
          {/* ─── Auth pages ─── */}
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />

          {/* ─── Logged-in Protected Routes ─── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/e-content" element={<AnimatedPage><EContent /></AnimatedPage>} />
              <Route path="/notes" element={<AnimatedPage><Notes /></AnimatedPage>} />
              <Route path="/question-papers" element={<AnimatedPage><QuestionPapers /></AnimatedPage>} />
              <Route path="/cia-question-papers" element={<AnimatedPage><CIAQuestionPapers /></AnimatedPage>} />
              <Route path="/placements" element={<AnimatedPage><Placements /></AnimatedPage>} />
              <Route path="/college-calendar" element={<AnimatedPage><CollegeCalendar /></AnimatedPage>} />
              <Route path="/interview-experiences" element={<AnimatedPage><InterviewExperiences /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
              <Route path="/search" element={<AnimatedPage><Search /></AnimatedPage>} />
            </Route>

            {/* Student dashboard layout */}
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<AnimatedPage><StudentDashboard /></AnimatedPage>} />
              <Route path="/student/videos" element={<AnimatedPage><StudentEContent /></AnimatedPage>} />
              <Route path="/student/notes" element={<AnimatedPage><StudentNotes /></AnimatedPage>} />
              <Route path="/student/assignments" element={<AnimatedPage><StudentAssignments /></AnimatedPage>} />
              <Route path="/student/question-papers" element={<AnimatedPage><StudentQuestionPapers /></AnimatedPage>} />
              <Route path="/student/cia-question-papers" element={<AnimatedPage><CIAQuestionPapers /></AnimatedPage>} />
              <Route path="/student/placements" element={<AnimatedPage><StudentPlacements /></AnimatedPage>} />
              <Route path="/student/bookmarks" element={<AnimatedPage><Bookmarks /></AnimatedPage>} />
              <Route path="/student/recently-viewed" element={<AnimatedPage><RecentlyViewed /></AnimatedPage>} />
              <Route path="/student/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
              <Route path="/student/exam-study-planner" element={<AnimatedPage><ExamStudyPlanner /></AnimatedPage>} />
            </Route>

            {/* Faculty dashboard */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY]} />}>
              <Route element={<DashboardLayout title="Faculty Dashboard" items={facultyNav} />}>
                <Route path="/faculty/dashboard" element={<AnimatedPage><FacultyDashboard /></AnimatedPage>} />
                <Route path="/faculty/notes" element={<AnimatedPage><FacultyNotes /></AnimatedPage>} />
                <Route path="/faculty/videos" element={<AnimatedPage><FacultyVideos /></AnimatedPage>} />
                <Route path="/faculty/question-papers" element={<AnimatedPage><FacultyQuestionPapers /></AnimatedPage>} />
                <Route path="/faculty/cia-papers" element={<AnimatedPage><CIAQuestionPapers /></AnimatedPage>} />
              </Route>
            </Route>

            {/* Admin dashboard */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route element={<DashboardLayout title="Admin Dashboard" items={adminNav} />}>
                <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
                <Route path="/admin/users" element={<AnimatedPage><ManageUsers /></AnimatedPage>} />
                <Route path="/admin/faculty" element={<AnimatedPage><ManageFaculty /></AnimatedPage>} />
                <Route path="/admin/students" element={<AnimatedPage><ManageStudents /></AnimatedPage>} />
                <Route path="/admin/cia-timetable" element={<AnimatedPage><ManageCiaTimetable /></AnimatedPage>} />
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
      </>
    </AnimatePresence>
  );
}