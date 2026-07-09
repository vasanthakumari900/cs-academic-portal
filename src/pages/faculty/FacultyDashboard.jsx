// src/pages/faculty/FacultyDashboard.jsx
// Premium faculty dashboard.
import { FiPlayCircle, FiFileText, FiUpload, FiArrowRight } from "react-icons/fi";
import FloatingActionButton from "../../components/ui/FloatingActionButton";
import { useAuth } from "../../context/AuthContext";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import StatCard from "../../components/ui/StatCard";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
  const { profile } = useAuth();
  const { items: videos } = useFirestoreList(videoService);
  const { items: notes } = useFirestoreList(noteService);
  const { items: papers } = useFirestoreList(questionPaperService);

  const myVideos = videos.filter((v) => v.facultyId === profile?.uid);
  const myNotes = notes.filter((n) => n.facultyId === profile?.uid);
  const myPapers = papers.filter((p) => p.facultyId === profile?.uid);

  const recentUploads = [...myVideos, ...myNotes, ...myPapers].slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Welcome section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-6 sm:p-8 shadow-premium-lg">
        <div className="relative">
          <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5 blur-[40px]" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-[0.15em]">Faculty Dashboard</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                Welcome, {profile?.name?.split(" ")[0] || "Faculty"}
              </h1>
              <p className="mt-1 text-sm text-blue-200">Manage your uploads and reach your students.</p>
            </div>
            <Link
              to="/faculty/upload-video"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-soft transition-all duration-300 hover:shadow-premium hover:scale-105 active:scale-[0.97]"
            >
              <FiUpload size={16} />
              Upload New
              <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiPlayCircle} label="My Videos" value={myVideos.length} accent="primary" />
        <StatCard icon={FiFileText} label="My Notes" value={myNotes.length} accent="accent" />
        <StatCard icon={FiFileText} label="Question Papers" value={myPapers.length} accent="success" />
      </div>

      {/* Recent Uploads */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-display text-base font-bold text-gray-900">Recent Uploads</h3>
        </div>
        {recentUploads.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {recentUploads.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-blue-50/30">
                <span className="text-sm font-medium text-gray-700 truncate">{item.title}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{item.subject}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-400">
              <FiUpload size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">Nothing uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your first video, notes, or question paper</p>
          </div>
        )}
      </div>

      <FloatingActionButton to="/faculty/upload-video" icon={FiUpload} label="Upload video" />
    </div>
  );
}
