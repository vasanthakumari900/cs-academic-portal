import { FiPlayCircle, FiFileText, FiBriefcase, FiUser, FiAward, FiShield } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { useAuth } from "../../context/AuthContext";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import { placementService } from "../../services/placementService";
import StatCard from "../../components/ui/StatCard";
import AdminFeedbackViewer from "../../components/admin/AdminFeedbackViewer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Faculty users see an empty slate
  if (user?.type === "faculty") {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 sm:px-6 bg-[#F8FAFC]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm text-slate-400">
          <FiUser size={28} />
        </div>
        <h1 className="mt-5 font-sans text-xl font-semibold text-[#4B5563]">
          Welcome, {user.name}
        </h1>
        <div className="mt-2 h-px w-16 bg-slate-200" />
      </div>
    );
  }

  const { items: videos } = useFirestoreList(videoService);
  const { items: notes } = useFirestoreList(noteService);
  const { items: papers } = useFirestoreList(questionPaperService);
  const { items: placements } = useFirestoreList(placementService);

  const chartData = [
    { name: "Videos", count: videos.length, fill: "#021C4F" },
    { name: "Notes", count: notes.length, fill: "#C50337" },
    { name: "Papers", count: papers.length, fill: "#021C4F" },
    { name: "Placements", count: placements.length, fill: "#C50337" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 bg-[#F8FAFC] text-left space-y-8">
      {/* Centered Admin Photo & Name Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center"
      >
        {/* Centered Photo */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#021C4F] via-[#C50337] to-[#021C4F] opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
          <img
            src={user?.photoUrl || "/admin_photo.jpg"}
            alt="ADMIN"
            className="relative h-64 w-52 sm:h-72 sm:w-60 object-cover rounded-2xl border-4 border-white shadow-xl"
          />
        </div>

        {/* Name ADMIN down to the photo */}
        <h1 className="mt-5 font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F] tracking-widest uppercase">
          ADMIN
        </h1>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C50337] px-4 py-1 text-xs font-extrabold text-white shadow-sm tracking-widest uppercase">
            <FiShield size={12} /> {user?.adminBadge || "ADMIN"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#021C4F]/10 px-3.5 py-1 text-xs font-bold text-[#021C4F]">
            <FiShield size={12} /> Roll No: {user?.rollNumber || "24E3006"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-[#021C4F]">
            <FiAward size={12} /> Department of Computer Science
          </span>
        </div>
      </motion.div>

      {/* Admin Overview Stats */}
      <div>
        <div className="mb-4">
          <h2 className="font-sans text-xl font-bold text-[#0F4C81]">System Overview</h2>
          <p className="mt-0.5 text-xs text-[#6B7280]">A snapshot of everything on the portal.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FiPlayCircle} label="Total Videos" value={videos.length} accent="primary" />
          <StatCard icon={FiFileText} label="Total Notes" value={notes.length} accent="accent" />
          <StatCard icon={FiFileText} label="Question Papers" value={papers.length} accent="success" />
          <StatCard icon={FiBriefcase} label="Placement Drives" value={placements.length} accent="warning" />
        </div>
      </div>

      {/* Chart overview */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-5 py-4 bg-[#F8FAFC]">
          <h3 className="font-sans text-base font-bold text-[#0F4C81]">Content Overview</h3>
        </div>
        <div className="p-5">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '13px', backgroundColor: '#FAF7F2' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin-Only Confidential Submitted Feedback Section */}
      <AdminFeedbackViewer />
    </div>
  );
}
