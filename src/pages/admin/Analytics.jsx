// src/pages/admin/Analytics.jsx
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import GlassCard from "../../components/ui/GlassCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#2563EB", "#0EA5E9", "#14B8A6", "#22C55E", "#F59E0B"];

export default function Analytics() {
  const { items: videos } = useFirestoreList(videoService, { max: 100 });
  const { items: notes } = useFirestoreList(noteService, { max: 100 });

  const bySubject = {};
  [...videos, ...notes].forEach((i) => {
    bySubject[i.subject] = (bySubject[i.subject] || 0) + 1;
  });
  const pieData = Object.entries(bySubject).map(([name, value]) => ({ name, value }));

  const topVideos = [...videos].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-4 font-display font-semibold">Content by Subject</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="mb-4 font-display font-semibold">Most Watched Videos</h3>
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {topVideos.map((v) => (
              <li key={v.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="truncate">{v.title}</span>
                <span className="text-xs font-semibold text-maroon dark:text-gold">{v.views ?? 0} views</span>
              </li>
            ))}
            {topVideos.length === 0 && <p className="py-4 text-sm text-slate-400">No data yet.</p>}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
