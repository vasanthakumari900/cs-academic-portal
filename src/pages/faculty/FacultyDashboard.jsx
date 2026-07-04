// src/pages/faculty/FacultyDashboard.jsx
import { FiPlayCircle, FiFileText, FiUpload } from "react-icons/fi";
import FloatingActionButton from "../../components/ui/FloatingActionButton";
import { useAuth } from "../../context/AuthContext";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import StatCard from "../../components/ui/StatCard";
import GlassCard from "../../components/ui/GlassCard";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function FacultyDashboard() {
  const { profile } = useAuth();
  const { items: videos } = useFirestoreList(videoService);
  const { items: notes } = useFirestoreList(noteService);
  const { items: papers } = useFirestoreList(questionPaperService);

  const myVideos = videos.filter((v) => v.facultyId === profile?.uid);
  const myNotes = notes.filter((n) => n.facultyId === profile?.uid);
  const myPapers = papers.filter((p) => p.facultyId === profile?.uid);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome, {profile?.name?.split(" ")[0] || "Faculty"}</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your uploads and reach your students.</p>
        </div>
        <Button as={Link} to="/faculty/upload-video"><FiUpload /> Upload New</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiPlayCircle} label="My Videos" value={myVideos.length} accent="primary" />
        <StatCard icon={FiFileText} label="My Notes" value={myNotes.length} accent="accent" />
        <StatCard icon={FiFileText} label="My Question Papers" value={myPapers.length} accent="success" />
      </div>

      <GlassCard hover={false}>
        <h3 className="mb-4 font-display font-semibold">Recent Uploads</h3>
        <ul className="divide-y divide-slate-100 dark:divide-white/10">
          {[...myVideos, ...myNotes, ...myPapers].slice(0, 6).map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="truncate">{item.title}</span>
              <span className="text-xs text-slate-400">{item.subject}</span>
            </li>
          ))}
          {myVideos.length + myNotes.length + myPapers.length === 0 && (
            <p className="py-4 text-sm text-slate-400">You haven't uploaded anything yet.</p>
          )}
        </ul>
      </GlassCard>

      <FloatingActionButton to="/faculty/upload-video" icon={FiUpload} label="Upload video" />
    </div>
  );
}
