import { FiPlayCircle, FiFileText, FiBriefcase, FiUser } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { useAuth } from "../../context/AuthContext";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import { placementService } from "../../services/placementService";
import StatCard from "../../components/ui/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Faculty users see an empty slate
  if (user?.type === "faculty") {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 sm:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <FiUser size={28} className="text-white/30" />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-white/70">
          Welcome, {user.name}
        </h1>
        <div className="mt-2 h-px w-16 bg-white/10" />
      </div>
    );
  }

  const { items: videos } = useFirestoreList(videoService);
  const { items: notes } = useFirestoreList(noteService);
  const { items: papers } = useFirestoreList(questionPaperService);
  const { items: placements } = useFirestoreList(placementService);

  const chartData = [
    { name: "Videos", count: videos.length, fill: "#2563EB" },
    { name: "Notes", count: notes.length, fill: "#06B6D4" },
    { name: "Papers", count: papers.length, fill: "#10B981" },
    { name: "Placements", count: placements.length, fill: "#F59E0B" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Admin Overview</h1>
        <p className="mt-1 text-sm text-white/50">A snapshot of everything on the portal.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiPlayCircle} label="Total Videos" value={videos.length} accent="primary" />
        <StatCard icon={FiFileText} label="Total Notes" value={notes.length} accent="accent" />
        <StatCard icon={FiFileText} label="Question Papers" value={papers.length} accent="success" />
        <StatCard icon={FiBriefcase} label="Placement Drives" value={placements.length} accent="warning" />
      </div>

      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="font-display text-base font-bold text-white">Content Overview</h3>
        </div>
        <div className="p-5">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', fontSize: '13px' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
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
