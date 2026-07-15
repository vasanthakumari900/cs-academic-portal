import { FiPlayCircle, FiFileText, FiBriefcase, FiUser, FiLayers, FiChevronRight } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { useAuth } from "../../context/AuthContext";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import { placementService } from "../../services/placementService";
import StatCard from "../../components/ui/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

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
    { name: "Videos", count: videos.length, fill: "#0F4C81" },
    { name: "Notes", count: notes.length, fill: "#1E88E5" },
    { name: "Papers", count: papers.length, fill: "#2E7D32" },
    { name: "Placements", count: placements.length, fill: "#4B5563" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 bg-[#F8FAFC] text-left">
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">Admin Overview</h1>
        <p className="mt-1 text-sm text-[#6B7280]">A snapshot of everything on the portal.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiPlayCircle} label="Total Videos" value={videos.length} accent="primary" />
        <StatCard icon={FiFileText} label="Total Notes" value={notes.length} accent="accent" />
        <StatCard icon={FiFileText} label="Question Papers" value={papers.length} accent="success" />
        <StatCard icon={FiBriefcase} label="Placement Drives" value={placements.length} accent="warning" />
      </div>

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
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '13px', backgroundColor: '#FFFFFF' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
