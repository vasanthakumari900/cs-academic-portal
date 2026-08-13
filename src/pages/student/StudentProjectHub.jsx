import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  FiUsers,
  FiCode,
  FiGithub,
  FiExternalLink,
  FiPlusCircle,
  FiSearch,
  FiFilter,
  FiAward,
  FiStar,
  FiSend,
  FiCheckCircle,
  FiX,
  FiTag,
  FiMessageSquare,
  FiBriefcase,
  FiCpu,
  FiZap,
} from "react-icons/fi";
import toast from "react-hot-toast";

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "DGVC CS Academic Portal",
    author: "THARUN B S",
    yearSection: "Department of Computer Science",
    category: "Full Stack Web",
    desc: "Comprehensive academic platform for CS students featuring interactive subject knowledge graphs, unit-wise PDF study notes, previous year question papers, and smart AI exam study planner.",
    techStack: ["React", "TailwindCSS", "Node.js", "Vite", "Firebase"],
    githubUrl: "https://github.com/vasanthakumari900/cs-academic-portal",
    demoUrl: "https://cs-academic-portal.vercel.app",
    stars: 50,
    starred: true,
    lookingFor: null,
  },
];

const INITIAL_TEAM_INVITES = [
  {
    id: "invite-1",
    projectName: "DGVC CS Academic Portal - Feature Enhancements",
    postedBy: "THARUN B S",
    yearSection: "Department of Computer Science",
    hackathonName: "CS Department Innovation 2026",
    requiredRoles: ["UI/UX Designer", "AI Integration Specialist"],
    description: "Collaborate on adding AI flashcards, viva voice simulator, and interactive subject dependency graphs to the CS Academic Portal.",
    status: "Open",
    contactEmail: "tharunbs.cs@dgvc.in",
  },
];

export default function StudentProjectHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects"); // "projects" | "invites"
  const [projects, setProjects] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("project"); // "project" | "invite"

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Full Stack Web");
  const [formDesc, setFormDesc] = useState("");
  const [formTech, setFormTech] = useState("");
  const [formGithub, setFormGithub] = useState("");
  const [formDemo, setFormDemo] = useState("");
  const [formLookingFor, setFormLookingFor] = useState("");
  const [formHackathon, setFormHackathon] = useState("");
  const [formRoles, setFormRoles] = useState("");

  // Load from localStorage or initialize
  useEffect(() => {
    const savedProjects = localStorage.getItem("cs_portal_projects_v2");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem("cs_portal_projects_v2", JSON.stringify(INITIAL_PROJECTS));
    }

    const savedInvites = localStorage.getItem("cs_portal_team_invites_v2");
    if (savedInvites) {
      try {
        setTeamInvites(JSON.parse(savedInvites));
      } catch (e) {
        setTeamInvites(INITIAL_TEAM_INVITES);
      }
    } else {
      setTeamInvites(INITIAL_TEAM_INVITES);
      localStorage.setItem("cs_portal_team_invites_v2", JSON.stringify(INITIAL_TEAM_INVITES));
    }
  }, []);

  // Save to localStorage when state changes
  const saveProjectsToStorage = (updated) => {
    setProjects(updated);
    localStorage.setItem("cs_portal_projects_v2", JSON.stringify(updated));
  };

  const saveInvitesToStorage = (updated) => {
    setTeamInvites(updated);
    localStorage.setItem("cs_portal_team_invites_v2", JSON.stringify(updated));
  };

  const handleStarProject = (id) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        const isStarred = p.starred;
        return {
          ...p,
          starred: !isStarred,
          stars: isStarred ? p.stars - 1 : p.stars + 1,
        };
      }
      return p;
    });
    saveProjectsToStorage(updated);
    toast.success("Project rating updated!");
  };

  const handleSendTeammateRequest = (projectName, recipientName) => {
    toast.success(`Teammate application sent to ${recipientName} for ${projectName}!`);
  };

  const handleCreateSubmission = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) {
      toast.error("Please fill in required project title and description.");
      return;
    }

    if (modalMode === "project") {
      const newProj = {
        id: `proj-${Date.now()}`,
        title: formTitle.trim(),
        author: `${user?.name || "CS Student"} (${user?.rollNumber || "24E3006"})`,
        yearSection: `${user?.year || 3}rd Year · Section ${user?.section || "A"}`,
        category: formCategory,
        desc: formDesc.trim(),
        techStack: formTech
          ? formTech.split(",").map((s) => s.trim()).filter(Boolean)
          : ["React", "Node.js"],
        githubUrl: formGithub.trim() || "https://github.com",
        demoUrl: formDemo.trim() || null,
        stars: 1,
        starred: true,
        lookingFor: formLookingFor.trim() || null,
      };
      saveProjectsToStorage([newProj, ...projects]);
      toast.success("🚀 Project successfully published to CS Showcase!");
    } else {
      const newInvite = {
        id: `invite-${Date.now()}`,
        projectName: formTitle.trim(),
        postedBy: `${user?.name || "CS Student"} (${user?.rollNumber || "24E3006"})`,
        yearSection: `${user?.year || 3}rd Year · Section ${user?.section || "A"}`,
        hackathonName: formHackathon.trim() || "DGVC CS Hackathon",
        requiredRoles: formRoles
          ? formRoles.split(",").map((s) => s.trim()).filter(Boolean)
          : ["Frontend Developer", "Backend Developer"],
        description: formDesc.trim(),
        status: "Open",
        contactEmail: `${user?.rollNumber?.toLowerCase() || "student"}@dgvc.in`,
      };
      saveInvitesToStorage([newInvite, ...teamInvites]);
      toast.success("🤝 Teammate invite published!");
    }

    // Reset form
    setFormTitle("");
    setFormDesc("");
    setFormTech("");
    setFormGithub("");
    setFormDemo("");
    setFormLookingFor("");
    setFormHackathon("");
    setFormRoles("");
    setIsModalOpen(false);
  };

  const techOptions = ["All", "React", "Python", "Node.js", "AI/ML", "Flutter", "Firebase", "C++", "Java"];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech =
      selectedTech === "All" || p.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase());
    return matchesSearch && matchesTech;
  });

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF0F2] text-[#2D060E]">
      
      {/* ── Page Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] p-6 sm:p-8 text-white shadow-xl border-2 border-amber-400/40 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-md">
                <FiUsers size={13} /> CS Innovation & Teammate Hub
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500 text-white px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-md">
                <FiAward size={13} /> Hackathons & Final Year Projects
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              Department Hackathon & Project Partner Finder
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
              Showcase your GitHub projects, find teammates across sections (1st, 2nd & 3rd Year), and collaborate for university hackathons & capstones.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                setModalMode("project");
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-5 py-3 text-xs font-black text-white shadow-lg hover:scale-105 transition-all border border-[#F4C266]/40 cursor-pointer"
            >
              <FiPlusCircle size={16} />
              <span>Showcase My Project</span>
            </button>
            <button
              onClick={() => {
                setModalMode("invite");
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 px-5 py-3 text-xs font-black shadow-lg transition-all border border-amber-300 cursor-pointer"
            >
              <FiUsers size={16} />
              <span>Post Teammate Invite</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Tab Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "projects"
                ? "bg-[#021C4F] text-amber-300 shadow-md"
                : "text-slate-600 hover:text-[#021C4F] hover:bg-slate-100"
            }`}
          >
            <FiCode size={15} />
            <span>Project Showcase ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "invites"
                ? "bg-[#021C4F] text-amber-300 shadow-md"
                : "text-slate-600 hover:text-[#021C4F] hover:bg-slate-100"
            }`}
          >
            <FiUsers size={15} />
            <span>Open Team Invites ({teamInvites.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by project name, tech, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-300 pl-9 pr-3.5 py-2 text-xs text-[#021C4F] placeholder-slate-400 focus:outline-none focus:border-[#021C4F] shadow-2xs"
          />
        </div>
      </div>

      {/* ── Category Filter Pills for Projects ── */}
      {activeTab === "projects" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          <span className="text-xs font-bold text-[#021C4F] flex items-center gap-1 shrink-0">
            <FiFilter size={13} /> Filter Tech:
          </span>
          {techOptions.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 border ${
                selectedTech === tech
                  ? "bg-[#C50337] text-white border-[#C50337] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* ── TAB 1: PROJECT SHOWCASE GRID ── */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white border-2 border-slate-200 p-6 shadow-md hover:shadow-xl hover:border-[#021C4F] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#C50337] border border-rose-200 mb-1.5">
                      {proj.category}
                    </span>
                    <h3 className="text-lg font-extrabold text-[#021C4F] leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      By <span className="font-bold text-[#021C4F]">{proj.author}</span> • {proj.yearSection}
                    </p>
                  </div>

                  {/* Star Rating Button */}
                  <button
                    onClick={() => handleStarProject(proj.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                      proj.starred
                        ? "bg-amber-400 text-slate-950 border-amber-500 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-100"
                    }`}
                  >
                    <FiStar size={13} className={proj.starred ? "fill-slate-950" : ""} />
                    <span>{proj.stars}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
                  {proj.desc}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.techStack.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-[#021C4F] border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Looking For Teammate Alert Banner */}
                {proj.lookingFor && (
                  <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-amber-900 font-bold">
                      <FiZap size={14} className="text-amber-600 shrink-0 animate-bounce" />
                      <span>Recruiting: <span className="underline">{proj.lookingFor}</span></span>
                    </div>
                    <button
                      onClick={() => handleSendTeammateRequest(proj.title, proj.author)}
                      className="px-2.5 py-1 rounded-lg bg-[#021C4F] text-amber-300 text-[10px] font-black hover:bg-[#0A369D] transition-colors shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Links */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#021C4F] transition-colors"
                >
                  <FiGithub size={15} />
                  <span>GitHub Repository</span>
                </a>

                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#C50337] hover:text-[#7F011F] transition-colors"
                  >
                    <FiExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── TAB 2: OPEN TEAMMATE INVITES ── */}
      {activeTab === "invites" && (
        <div className="space-y-4">
          {teamInvites.map((invite) => (
            <motion.div
              key={invite.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white border-2 border-slate-200 p-6 shadow-md hover:border-[#021C4F] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-[#0F766E] border border-teal-200">
                    <FiAward className="inline mr-1" /> {invite.hackathonName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Posted by {invite.postedBy} ({invite.yearSection})
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#021C4F]">
                  {invite.projectName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {invite.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-700">Looking for Roles:</span>
                  {invite.requiredRoles.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-50 text-[#C50337] border border-rose-200"
                    >
                      ⚡ {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => handleSendTeammateRequest(invite.projectName, invite.postedBy)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-5 py-2.5 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer border border-[#F4C266]/30"
                >
                  <FiSend size={14} />
                  <span>Send Join Request</span>
                </button>
                <a
                  href={`mailto:${invite.contactEmail}`}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#021C4F]"
                >
                  <FiMessageSquare size={13} />
                  <span>Direct Email ({invite.contactEmail})</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── MODAL: SHOWCASE PROJECT OR POST INVITE ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-[#021C4F] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#021C4F]">
                    {modalMode === "project" ? "🚀 Showcase Your CS Project" : "🤝 Post Hackathon Teammate Invite"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Share your work or find collaborators across DGVC Computer Science sections
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmission} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {modalMode === "project" ? "Project Title *" : "Project / Hackathon Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Automated Attendance System"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                  />
                </div>

                {modalMode === "project" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                        >
                          <option>Full Stack Web</option>
                          <option>AI/ML</option>
                          <option>Mobile App</option>
                          <option>Systems & IoT</option>
                          <option>Cloud & DevOps</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. React, Python, OpenCV"
                          value={formTech}
                          onChange={(e) => setFormTech(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">GitHub Repo URL</label>
                        <input
                          type="url"
                          placeholder="https://github.com/username/project"
                          value={formGithub}
                          onChange={(e) => setFormGithub(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://demo-app.vercel.app"
                          value={formDemo}
                          onChange={(e) => setFormDemo(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Looking for a teammate? (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Need a Backend FastAPI Developer"
                        value={formLookingFor}
                        onChange={(e) => setFormLookingFor(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hackathon / Event Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Smart India Hackathon 2026 / Final Year Project"
                        value={formHackathon}
                        onChange={(e) => setFormHackathon(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Required Teammate Roles (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. React Frontend Lead, Python AI Dev"
                        value={formRoles}
                        onChange={(e) => setFormRoles(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe the project goals, features, or teammate expectations..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white font-extrabold shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    Publish Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
