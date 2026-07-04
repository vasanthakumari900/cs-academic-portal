// src/pages/admin/AdminDashboard.jsx
import { FiUsers, FiPlayCircle, FiFileText, FiBriefcase } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import { placementService } from "../../services/placementService";
import StatCard from "../../components/ui/StatCard";
import GlassCard from "../../components/ui/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { items: videos } = useFirestoreList(videoService);
  const { items: notes } = useFirestoreList(noteService);
  const { items: papers } = useFirestoreList(questionPaperService);
  const { items: placements } = useFirestoreList(placementService);

  const chartData = [
    { name: "Videos", count: videos.length },
    { name: "Notes", count: notes.length },
    { name: "Question Papers", count: papers.length },
    { name: "Placements", count: placements.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Admin Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">A snapshot of everything on the portal.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiPlayCircle} label="Total Videos" value={videos.length} accent="primary" />
        <StatCard icon={FiFileText} label="Total Notes" value={notes.length} accent="accent" />
        <StatCard icon={FiFileText} label="Question Papers" value={papers.length} accent="success" />
        <StatCard icon={FiBriefcase} label="Placement Drives" value={placements.length} accent="warning" />
      </div>

      <GlassCard hover={false}>
        <h3 className="mb-4 font-display font-semibold">Content Overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
