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
  FiZap,
  FiDatabase,
  FiMessageSquare,
  FiEdit3,
  FiTrash2,
  FiRotateCcw,
  FiPlay,
  FiMail,
  FiAlertCircle,
  FiMaximize2,
  FiShield,
  FiCpu,
  FiCheck,
  FiAlertTriangle,
  FiPrinter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { projectHubService } from "../../services/projectHubService";
import { isFirebaseConfigured } from "../../firebase/config";
import { analyzeProjectCode } from "../../services/aiCodeReviewerService";

// Initial Default Project: DGVC CS Academic Portal
const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "DGVC CS Academic Portal",
    author: "THARUN B S",
    rollNumber: "24E3006",
    yearSection: "3rd Year · Section A",
    category: "Full Stack Web",
    desc: "Comprehensive academic platform for CS students featuring interactive subject knowledge graphs, unit-wise PDF study notes, previous year question papers, and smart AI exam study planner.",
    techStack: ["React", "TailwindCSS", "Node.js", "Vite", "Firebase"],
    githubUrl: "https://github.com/vasanthakumari900/cs-academic-portal",
    demoUrl: "https://cs-academic-portal.vercel.app",
    stars: 52,
    starred: true,
    lookingFor: null,
    isDefault: true,
  },
];

const INITIAL_TEAM_INVITES = [
  {
    id: "invite-1",
    projectName: "DGVC CS Academic Portal - Feature Enhancements",
    postedBy: "THARUN B S (24E3006)",
    yearSection: "3rd Year · Section A",
    hackathonName: "CS Department Innovation 2026",
    requiredRoles: ["UI/UX Designer", "AI Integration Specialist"],
    description: "Collaborate on adding AI flashcards, viva voice simulator, and interactive subject dependency graphs to the CS Academic Portal.",
    status: "Open",
    contactEmail: "tharunbs.cs@dgvc.in",
    isDefault: true,
  },
  {
    id: "invite-2",
    projectName: "Smart India Hackathon 2026 - AI Traffic Management",
    postedBy: "VISHNU PRASAD R (24E3012)",
    yearSection: "3rd Year · Section A",
    hackathonName: "Smart India Hackathon 2026",
    requiredRoles: ["FastAPI Backend Developer", "OpenCV Expert"],
    description: "Building computer vision system for real-time emergency vehicle clearance at traffic junctions. Need a strong backend dev.",
    status: "Open",
    contactEmail: "vishnu.cs@dgvc.in",
    isDefault: true,
  },
];

function formatUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export default function StudentProjectHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects"); // "projects" | "invites" | "redo"
  const [projects, setProjects] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);
  const [firebaseProjects, setFirebaseProjects] = useState([]);
  const [firebaseInvites, setFirebaseInvites] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("All");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("project"); // "project" | "invite" | "edit"
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Live Runner Modal state
  const [runningProject, setRunningProject] = useState(null);

  // AI Code Audit Modal state
  const [auditState, setAuditState] = useState({ isOpen: false, project: null, result: null, isLoading: false });

  // Email Transfer Modal state
  const [emailModalData, setEmailModalData] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

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
  const [formTargetEmail, setFormTargetEmail] = useState("");

  // 1. Subscribe to Firebase Firestore real-time updates
  useEffect(() => {
    const unsubProjects = projectHubService.subscribeProjects((fbProjs) => {
      setFirebaseProjects(fbProjs);
    });

    const unsubInvites = projectHubService.subscribeInvites((fbInvs) => {
      setFirebaseInvites(fbInvs);
    });

    return () => {
      unsubProjects();
      unsubInvites();
    };
  }, []);

  // 2. Load storage & merge with Firebase projects
  useEffect(() => {
    let localProjs = [];
    const savedProjects = localStorage.getItem("cs_portal_projects_v3");
    if (savedProjects) {
      try {
        localProjs = JSON.parse(savedProjects);
      } catch (e) {
        localProjs = [];
      }
    }

    let savedDeletedProjs = [];
    const deletedProjectsData = localStorage.getItem("cs_portal_deleted_projects_v3");
    if (deletedProjectsData) {
      try {
        savedDeletedProjs = JSON.parse(deletedProjectsData);
      } catch (e) {
        savedDeletedProjs = [];
      }
    }
    setDeletedProjects(savedDeletedProjs);

    let localInvs = [];
    const savedInvites = localStorage.getItem("cs_portal_team_invites_v3");
    if (savedInvites) {
      try {
        localInvs = JSON.parse(savedInvites);
      } catch (e) {
        localInvs = [];
      }
    }

    // Merge: INITIAL_PROJECTS + Firebase projects + local projects
    const combinedProjects = [...INITIAL_PROJECTS];
    const knownIds = new Set(INITIAL_PROJECTS.map((p) => p.id));
    const deletedIds = new Set(savedDeletedProjs.map((p) => p.id));

    firebaseProjects.forEach((p) => {
      if (!knownIds.has(p.id) && !deletedIds.has(p.id)) {
        combinedProjects.push(p);
        knownIds.add(p.id);
      }
    });

    localProjs.forEach((p) => {
      if (!knownIds.has(p.id) && !deletedIds.has(p.id)) {
        combinedProjects.push(p);
        knownIds.add(p.id);
      }
    });

    setProjects(combinedProjects);

    // Merge invites
    const combinedInvites = [...INITIAL_TEAM_INVITES];
    const knownInviteIds = new Set(INITIAL_TEAM_INVITES.map((i) => i.id));

    firebaseInvites.forEach((inv) => {
      if (!knownInviteIds.has(inv.id)) {
        combinedInvites.push(inv);
        knownInviteIds.add(inv.id);
      }
    });

    localInvs.forEach((inv) => {
      if (!knownInviteIds.has(inv.id)) {
        combinedInvites.push(inv);
        knownInviteIds.add(inv.id);
      }
    });

    setTeamInvites(combinedInvites);
  }, [firebaseProjects, firebaseInvites]);

  // Star handling
  const handleStarProject = async (id) => {
    const targetProj = projects.find((p) => p.id === id);
    if (!targetProj) return;

    const isStarred = targetProj.starred;
    const delta = isStarred ? -1 : 1;

    const updatedProjects = projects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          starred: !isStarred,
          stars: Math.max(0, (p.stars || 0) + delta),
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    localStorage.setItem("cs_portal_projects_v3", JSON.stringify(updatedProjects.filter((p) => !p.isDefault)));

    if (targetProj.isFirebase) {
      await projectHubService.starProject(id, delta);
    }
    toast.success(isStarred ? "Removed star" : "⭐ Project starred!");
  };

  const [auditStage, setAuditStage] = useState(0);

  // Run AI Code Audit Handler (Multi-Stage Live Inspection)
  const handleRunAiAudit = async (projPayload) => {
    setAuditState({ isOpen: true, project: projPayload, result: null, isLoading: true });
    setAuditStage(0);

    const t1 = setTimeout(() => setAuditStage(1), 650);
    const t2 = setTimeout(() => setAuditStage(2), 1300);
    const t3 = setTimeout(() => setAuditStage(3), 1950);

    try {
      const result = await analyzeProjectCode(projPayload);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setAuditState({ isOpen: true, project: projPayload, result, isLoading: false });
      toast.success(`🤖 AI Code & Repo Audit complete! Quality Score: ${result.score}/100`);
    } catch (err) {
      toast.error("AI Audit encountered an issue: " + err.message);
      setAuditState({ isOpen: false, project: null, result: null, isLoading: false });
    }
  };

  // DELETE Project Handler
  const handleDeleteProject = (projId) => {
    const projToDelete = projects.find((p) => p.id === projId);
    if (!projToDelete) return;

    const updatedProjects = projects.filter((p) => p.id !== projId);
    const updatedDeleted = [projToDelete, ...deletedProjects];

    setProjects(updatedProjects);
    setDeletedProjects(updatedDeleted);

    localStorage.setItem("cs_portal_projects_v3", JSON.stringify(updatedProjects.filter((p) => !p.isDefault)));
    localStorage.setItem("cs_portal_deleted_projects_v3", JSON.stringify(updatedDeleted));

    if (projToDelete.isFirebase) {
      projectHubService.deleteProject(projId);
    }

    toast.success(`🗑️ "${projToDelete.title}" moved to Trash. Click "↺ Redo / Trash" tab to restore anytime!`);
  };

  // REDO (RESTORE) Deleted Project Handler
  const handleRestoreProject = (projId) => {
    const projToRestore = deletedProjects.find((p) => p.id === projId);
    if (!projToRestore) return;

    const updatedDeleted = deletedProjects.filter((p) => p.id !== projId);
    const updatedProjects = [projToRestore, ...projects];

    setDeletedProjects(updatedDeleted);
    setProjects(updatedProjects);

    localStorage.setItem("cs_portal_deleted_projects_v3", JSON.stringify(updatedDeleted));
    localStorage.setItem("cs_portal_projects_v3", JSON.stringify(updatedProjects.filter((p) => !p.isDefault)));

    if (projToRestore.isFirebase) {
      projectHubService.createProject(projToRestore);
    }

    toast.success(`↺ "${projToRestore.title}" restored back to Project Showcase!`);
  };

  // EDIT Project Modal Trigger
  const handleOpenEditModal = (proj) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title || "");
    setFormCategory(proj.category || "Full Stack Web");
    setFormDesc(proj.desc || "");
    setFormTech(proj.techStack ? proj.techStack.join(", ") : "");
    setFormGithub(proj.githubUrl || "");
    setFormDemo(proj.demoUrl || "");
    setFormLookingFor(proj.lookingFor || "");
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Prepare Real Email Transfer
  const handleOpenEmailTransfer = (recipientEmail, recipientName, projectName) => {
    if (!recipientEmail || !isValidEmail(recipientEmail)) {
      toast.error("Invalid recipient email address!");
      return;
    }
    const defaultSubject = `Collaboration Request: ${projectName} [CS Academic Portal]`;
    const defaultBody = `Hello ${recipientName},\n\nI saw your post on the DGVC CS Academic Portal for "${projectName}". I am interested in collaborating with you!\n\nMy Details:\nName: ${user?.name || "CS Student"}\nRoll Number: ${user?.rollNumber || "24E3006"}\nEmail: ${user?.rollNumber?.toLowerCase() || "student"}@dgvc.in\n\nLooking forward to connecting!`;
    
    setEmailModalData({ recipientEmail, recipientName, projectName });
    setEmailSubject(defaultSubject);
    setEmailBody(defaultBody);
  };

  // Dispatch Real Email Transfer via mailto
  const handleSendRealEmail = (e) => {
    e.preventDefault();
    if (!emailModalData || !isValidEmail(emailModalData.recipientEmail)) {
      toast.error("Please enter a valid recipient email.");
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(emailModalData.recipientEmail)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoUrl, "_blank");
    toast.success(`✉️ Real email client opened for ${emailModalData.recipientEmail}!`);
    setEmailModalData(null);
  };

  // Create or Edit Submission (INSTANT OPTIMISTIC UI RESPONSE)
  const handleCreateSubmission = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!formTitle.trim() || !formDesc.trim()) {
      toast.error("Please fill in required title and description.");
      return;
    }

    if (modalMode === "edit") {
      // EDIT existing project
      const formattedGithub = formatUrl(formGithub) || "https://github.com";
      const formattedDemo = formatUrl(formDemo);

      const updatedPayload = {
        title: formTitle.trim(),
        category: formCategory,
        desc: formDesc.trim(),
        techStack: formTech
          ? formTech.split(",").map((s) => s.trim()).filter(Boolean)
          : ["React", "Node.js"],
        githubUrl: formattedGithub,
        demoUrl: formattedDemo,
        lookingFor: formLookingFor.trim() || null,
      };

      const updatedList = projects.map((p) => {
        if (p.id === editingProjectId) {
          return { ...p, ...updatedPayload };
        }
        return p;
      });

      setProjects(updatedList);
      localStorage.setItem("cs_portal_projects_v3", JSON.stringify(updatedList.filter((p) => !p.isDefault)));

      const targetProj = projects.find((p) => p.id === editingProjectId);
      if (targetProj && targetProj.isFirebase) {
        projectHubService.updateProject(editingProjectId, updatedPayload);
      }

      toast.success("✨ Project details updated immediately!");
      setIsModalOpen(false);
      return;
    }

    if (modalMode === "project") {
      // INSTANT OPTIMISTIC ADD PROJECT
      const formattedGithub = formatUrl(formGithub) || "https://github.com";
      const formattedDemo = formatUrl(formDemo);
      const newId = `proj-${Date.now()}`;

      const projectPayload = {
        id: newId,
        title: formTitle.trim(),
        author: user?.name || "CS Student",
        rollNumber: user?.rollNumber || "24E3006",
        yearSection: `${user?.year || 3}rd Year · Section ${user?.section || "A"}`,
        category: formCategory,
        desc: formDesc.trim(),
        techStack: formTech
          ? formTech.split(",").map((s) => s.trim()).filter(Boolean)
          : ["React", "Node.js"],
        githubUrl: formattedGithub,
        demoUrl: formattedDemo,
        stars: 1,
        starred: true,
        lookingFor: formLookingFor.trim() || null,
        isFirebase: isFirebaseConfigured,
      };

      // 1. Update UI state & LocalStorage immediately
      const updated = [projectPayload, ...projects];
      setProjects(updated);
      localStorage.setItem("cs_portal_projects_v3", JSON.stringify(updated.filter((p) => !p.isDefault)));
      toast.success("🚀 Project published live! Appears next to department projects.");

      // 2. Sync to Firebase in background asynchronously
      if (isFirebaseConfigured) {
        projectHubService.createProject(projectPayload).catch((err) => {
          console.warn("Background Firebase sync note:", err);
        });
      }
    } else {
      // INSTANT OPTIMISTIC ADD INVITE
      const targetEmailToUse = formTargetEmail.trim() || `${user?.rollNumber?.toLowerCase() || "student"}@dgvc.in`;
      if (!isValidEmail(targetEmailToUse)) {
        toast.error("⚠️ Please enter a valid recipient email address!");
        return;
      }

      const newId = `invite-${Date.now()}`;
      const invitePayload = {
        id: newId,
        projectName: formTitle.trim(),
        postedBy: `${user?.name || "CS Student"} (${user?.rollNumber || "24E3006"})`,
        yearSection: `${user?.year || 3}rd Year · Section ${user?.section || "A"}`,
        hackathonName: formHackathon.trim() || "DGVC CS Hackathon 2026",
        requiredRoles: formRoles
          ? formRoles.split(",").map((s) => s.trim()).filter(Boolean)
          : ["Frontend Lead", "Backend Developer"],
        description: formDesc.trim(),
        status: "Open",
        contactEmail: targetEmailToUse,
        isFirebase: isFirebaseConfigured,
      };

      const updated = [invitePayload, ...teamInvites];
      setTeamInvites(updated);
      localStorage.setItem("cs_portal_team_invites_v3", JSON.stringify(updated.filter((i) => !i.isDefault)));
      toast.success(`🤝 Teammate invite published for ${targetEmailToUse}!`);

      if (isFirebaseConfigured) {
        projectHubService.createInvite(invitePayload).catch((err) => {
          console.warn("Background Firebase sync note:", err);
        });
      }
    }

    // Reset Form
    setFormTitle("");
    setFormDesc("");
    setFormTech("");
    setFormGithub("");
    setFormDemo("");
    setFormLookingFor("");
    setFormHackathon("");
    setFormRoles("");
    setFormTargetEmail("");
    setIsModalOpen(false);
  };

  const techOptions = [
    "All",
    "React",
    "Python",
    "Node.js",
    "Java",
    "C++",
    "C",
    "JavaScript",
    "TypeScript",
    "AI/ML",
    "Flutter",
    "Firebase",
    "SQL",
    "MongoDB",
    "FastAPI",
    "Django",
    "TailwindCSS",
    "Cloud/DevOps",
    "Cybersecurity",
    "Blockchain",
    "Kotlin",
    "PHP",
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech =
      selectedTech === "All" ||
      (p.techStack &&
        p.techStack.some(
          (t) =>
            t.toLowerCase().includes(selectedTech.toLowerCase()) ||
            selectedTech.toLowerCase().includes(t.toLowerCase())
        ));
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
                <FiShield size={13} /> AI Code Review & Security Scanner Enabled
              </span>
              {isFirebaseConfigured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                  <FiDatabase size={11} /> Firebase Cloud Live
                </span>
              )}
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              Department Hackathon & Project Partner Finder
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
              Showcase your projects, run AI Code Quality & Vulnerability Audits, test live web demos inside the portal, and connect with hackathon teammates!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                setModalMode("project");
                setFormTitle("");
                setFormDesc("");
                setFormTech("");
                setFormGithub("");
                setFormDemo("");
                setFormLookingFor("");
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
                setFormTitle("");
                setFormDesc("");
                setFormHackathon("");
                setFormRoles("");
                setFormTargetEmail(`${user?.rollNumber?.toLowerCase() || "student"}@dgvc.in`);
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

      {/* ── Main Navigation Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
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

          <button
            onClick={() => setActiveTab("redo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "redo"
                ? "bg-rose-900 text-amber-300 shadow-md"
                : "text-rose-700 hover:text-rose-950 hover:bg-rose-50"
            }`}
          >
            <FiRotateCcw size={15} />
            <span>↺ Redo / Trash ({deletedProjects.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search projects or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white border border-slate-300 pl-9 pr-3.5 py-2 text-xs text-[#021C4F] placeholder-slate-400 focus:outline-none focus:border-[#021C4F] shadow-2xs"
          />
        </div>
      </div>

      {/* ── Category Filter Pills Container ── */}
      {activeTab === "projects" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-black text-[#021C4F]">
              <div className="w-6 h-6 rounded-lg bg-rose-50 text-[#C50337] flex items-center justify-center border border-rose-200">
                <FiFilter size={13} />
              </div>
              <span>Filter Projects by Tech Stack ({techOptions.length})</span>
              {selectedTech !== "All" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                  Active: {selectedTech}
                </span>
              )}
            </div>
            {selectedTech !== "All" && (
              <button
                onClick={() => setSelectedTech("All")}
                className="text-[11px] font-bold text-[#C50337] hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {techOptions.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedTech === tech
                    ? "bg-gradient-to-r from-[#021C4F] to-[#0A369D] text-amber-300 border-[#021C4F] shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
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
                {/* Card Header & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#C50337] border border-rose-200">
                        {proj.category}
                      </span>
                      {proj.isFirebase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <FiDatabase size={10} /> Firebase Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-[#021C4F] leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      By <span className="font-bold text-[#021C4F]">{proj.author}</span> {proj.yearSection ? `• ${proj.yearSection}` : ""}
                    </p>
                  </div>

                  {/* Actions Bar: Star, Edit, Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStarProject(proj.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                        proj.starred
                          ? "bg-amber-400 text-slate-950 border-amber-500 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-100"
                      }`}
                      title="Star project"
                    >
                      <FiStar size={13} className={proj.starred ? "fill-slate-950" : ""} />
                      <span>{proj.stars || 0}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#021C4F] hover:text-white transition-colors"
                      title="Edit project details"
                    >
                      <FiEdit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                      title="Delete project (Move to Trash / Redo)"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
                  {proj.desc}
                </p>

                {/* Tech Stack Pills */}
                {proj.techStack && proj.techStack.length > 0 && (
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
                )}

                {/* Teammate Recruitment Alert Banner */}
                {proj.lookingFor && (
                  <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-amber-900 font-bold">
                      <FiZap size={14} className="text-amber-600 shrink-0 animate-bounce" />
                      <span>Recruiting: <span className="underline">{proj.lookingFor}</span></span>
                    </div>
                    <button
                      onClick={() => handleOpenEmailTransfer(`${proj.rollNumber?.toLowerCase() || "student"}@dgvc.in`, proj.author, proj.title)}
                      className="px-2.5 py-1 rounded-lg bg-[#021C4F] text-amber-300 text-[10px] font-black hover:bg-[#0A369D] transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <FiMail size={12} /> Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  {proj.githubUrl ? (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-700 hover:text-[#021C4F] transition-colors"
                    >
                      <FiGithub size={14} />
                      <span>GitHub</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No GitHub</span>
                  )}

                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#C50337] hover:text-[#7F011F] transition-colors"
                    >
                      <FiExternalLink size={13} />
                      <span>Live URL</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* AI Code Quality Audit Button */}
                  <button
                    onClick={() => handleRunAiAudit(proj)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-900 hover:bg-purple-600 hover:text-white font-black text-[11px] transition-all cursor-pointer border border-purple-200"
                    title="Run AI Code Quality & Vulnerability Audit"
                  >
                    <FiShield size={13} />
                    <span>🤖 AI Audit</span>
                  </button>

                  {/* Live Runner Button */}
                  <button
                    onClick={() => setRunningProject(proj)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-[11px] shadow-sm hover:scale-105 transition-all cursor-pointer border border-emerald-400/40"
                  >
                    <FiPlay size={13} />
                    <span>▶ Run Project</span>
                  </button>
                </div>
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
                  {invite.contactEmail && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <FiCheckCircle size={10} /> Verified Email Target
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-[#021C4F]">
                  {invite.projectName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {invite.description}
                </p>

                {invite.requiredRoles && invite.requiredRoles.length > 0 && (
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
                )}
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => handleOpenEmailTransfer(invite.contactEmail, invite.postedBy, invite.projectName)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-5 py-2.5 text-xs font-black text-white shadow-md hover:scale-105 transition-all cursor-pointer border border-[#F4C266]/30"
                >
                  <FiMail size={14} />
                  <span>Send Real Email Transfer</span>
                </button>
                {invite.contactEmail && (
                  <span className="text-[11px] font-mono text-center text-slate-500">
                    Target: {invite.contactEmail}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── TAB 3: REDO / TRASH DELETED PROJECTS ── */}
      {activeTab === "redo" && (
        <div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-xs text-rose-900 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <FiRotateCcw size={16} className="text-rose-600" />
              <span>Redo / Trash Storage: Deleted projects are kept safe here. Click "↺ Redo Project" to restore them instantly!</span>
            </div>
          </div>

          {deletedProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <FiRotateCcw size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">No deleted projects in Trash</p>
              <p className="text-xs text-slate-400">Projects you delete from the showcase will appear here for instant Redo/Restore.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deletedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white border-2 border-dashed border-rose-300 p-6 opacity-90 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                        DELETED
                      </span>
                      <span className="text-xs text-slate-400 font-medium">By {proj.author}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800 mb-1">{proj.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{proj.desc}</p>
                  </div>

                  <button
                    onClick={() => handleRestoreProject(proj.id)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 text-xs shadow-md transition-all cursor-pointer"
                  >
                    <FiRotateCcw size={14} />
                    <span>↺ Redo / Restore Project</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL: SHOWCASE PROJECT / POST INVITE / EDIT ── */}
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
                  <h3 className="text-lg font-extrabold text-[#021C4F] flex items-center gap-2">
                    {modalMode === "edit" ? (
                      <>✏️ Edit Project Code & Details</>
                    ) : modalMode === "project" ? (
                      <>🚀 Showcase Your CS Project</>
                    ) : (
                      <>🤝 Post Hackathon Teammate Invite</>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalMode === "edit"
                      ? "Make instant updates to your published project."
                      : modalMode === "project"
                      ? "Publish your project to showcase alongside department projects!"
                      : "Enter target teammate email for background verification & direct email dispatch."}
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
                    {modalMode === "invite" ? "Project / Hackathon Title *" : "Project Title *"}
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

                {modalMode === "project" || modalMode === "edit" ? (
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
                        <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <FiGithub size={13} /> GitHub Repo URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/username/project"
                          value={formGithub}
                          onChange={(e) => setFormGithub(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <FiExternalLink size={13} /> Live Demo URL
                        </label>
                        <input
                          type="text"
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
                      <label className="block font-bold text-slate-700 mb-1">Target Teammate / Recipient Email ID * (Must be valid)</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="student.cs@dgvc.in or teammate@gmail.com"
                          value={formTargetEmail}
                          onChange={(e) => setFormTargetEmail(e.target.value)}
                          className={`w-full rounded-xl border p-2.5 text-xs text-[#021C4F] focus:outline-none ${
                            formTargetEmail
                              ? isValidEmail(formTargetEmail)
                                ? "border-emerald-500 bg-emerald-50/30"
                                : "border-rose-500 bg-rose-50/30"
                              : "border-slate-300"
                          }`}
                        />
                        {formTargetEmail && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                            {isValidEmail(formTargetEmail) ? (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <FiCheckCircle size={12} /> Valid Email
                              </span>
                            ) : (
                              <span className="text-rose-600 flex items-center gap-1">
                                <FiAlertCircle size={12} /> Invalid Email Format
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hackathon / Event Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Smart India Hackathon 2026"
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
                    onClick={handleCreateSubmission}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white font-extrabold shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FiCheckCircle size={14} />
                    <span>
                      {modalMode === "edit"
                        ? "Save & Apply Changes"
                        : modalMode === "project"
                        ? "🚀 Publish Project Now"
                        : "🤝 Publish Teammate Invite Now"}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: AI CODE QUALITY & VULNERABILITY AUDIT ── */}
      <AnimatePresence>
        {auditState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-purple-900 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
                    <FiShield size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#021C4F]">
                      AI Code Quality & Security Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Project: <span className="font-bold text-[#021C4F]">{auditState.project?.title}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAuditState({ isOpen: false, project: null, result: null, isLoading: false })}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Multi-stage Inspection Loading State */}
              {auditState.isLoading ? (
                <div className="py-12 px-4 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-700 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-purple-900">
                      <FiShield size={24} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <h4 className="font-extrabold text-sm text-[#021C4F]">
                      🔍 Inspecting Project Code Base & GitHub Repository
                    </h4>

                    <div className="space-y-2.5 text-xs font-mono text-left bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 shadow-inner">
                      <div className={`flex items-center gap-2.5 ${auditStage >= 0 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                        {auditStage > 0 ? (
                          <FiCheck size={14} className="text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                        )}
                        <span>1. Fetching GitHub repo & inspecting file structure...</span>
                      </div>

                      <div className={`flex items-center gap-2.5 ${auditStage >= 1 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                        {auditStage > 1 ? (
                          <FiCheck size={14} className="text-emerald-400 shrink-0" />
                        ) : auditStage === 1 ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 block rounded-full bg-slate-800 shrink-0" />
                        )}
                        <span>2. Parsing framework dependencies & tech stack depth...</span>
                      </div>

                      <div className={`flex items-center gap-2.5 ${auditStage >= 2 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                        {auditStage > 2 ? (
                          <FiCheck size={14} className="text-emerald-400 shrink-0" />
                        ) : auditStage === 2 ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 block rounded-full bg-slate-800 shrink-0" />
                        )}
                        <span>3. Auditing security vulnerabilities & secret leaks...</span>
                      </div>

                      <div className={`flex items-center gap-2.5 ${auditStage >= 3 ? "text-amber-400 font-bold" : "text-slate-500"}`}>
                        {auditStage === 3 ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 block rounded-full bg-slate-800 shrink-0" />
                        )}
                        <span>4. Groq AI LLM calculating final score out of 100...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                auditState.result && (
                  <div className="space-y-6 text-xs">
                    {/* Inspected Repository Summary Banner */}
                    {auditState.result.inspectedMetrics && (
                      <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
                        <div className="flex items-center gap-2.5">
                          <FiGithub size={18} className="text-amber-400 shrink-0" />
                          <div>
                            <span className="font-bold block text-white text-xs">{auditState.result.inspectedMetrics.repoStatus}</span>
                            <span className="text-[11px] text-slate-400">{auditState.result.inspectedMetrics.repositoryHealth}</span>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700">
                          Language: {auditState.result.inspectedMetrics.language}
                        </div>
                      </div>
                    )}

                    {/* Score Header Card */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#450C00] p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-xs">
                            {auditState.result.ratingBadge}
                          </span>
                          <span className="text-xs text-slate-300 font-bold">Hackathon Verified Audit</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white">Overall Architecture Score</h4>
                        <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                          {auditState.result.summary}
                        </p>
                      </div>

                      {/* Score Badge Ring */}
                      <div className="shrink-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-28">
                        <span className="text-3xl font-black text-amber-300 font-mono">
                          {auditState.result.score}
                        </span>
                        <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Out of 100</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    {auditState.result.codeMetrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Maintainability</span>
                          <span className="text-sm font-black font-mono text-[#021C4F]">{auditState.result.codeMetrics.maintainability}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Security Posture</span>
                          <span className="text-sm font-black font-mono text-emerald-700">{auditState.result.codeMetrics.security}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Performance</span>
                          <span className="text-sm font-black font-mono text-purple-700">{auditState.result.codeMetrics.performance}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Hackathon Score</span>
                          <span className="text-sm font-black font-mono text-amber-600">{auditState.result.codeMetrics.hackathonReadiness}</span>
                        </div>
                      </div>
                    )}

                    {/* Security Vulnerability Audit */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-sm text-[#021C4F] flex items-center gap-1.5">
                        <FiShield className="text-emerald-600" /> Security Vulnerability Audit Checks
                      </h4>
                      <div className="space-y-2">
                        {auditState.result.securityAudit?.map((sec, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-start gap-3 ${
                              sec.type === "pass"
                                ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                                : sec.type === "warning"
                                ? "bg-amber-50/60 border-amber-200 text-amber-950"
                                : "bg-rose-50/60 border-rose-200 text-rose-950"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {sec.type === "pass" ? (
                                <div className="p-1 rounded-md bg-emerald-600 text-white">
                                  <FiCheck size={12} />
                                </div>
                              ) : (
                                <div className="p-1 rounded-md bg-amber-600 text-white">
                                  <FiAlertTriangle size={12} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs">{sec.title}</h5>
                              <p className="text-[11px] opacity-80 mt-0.5">{sec.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Architecture Suggestions */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-sm text-[#021C4F] flex items-center gap-1.5">
                        <FiCpu className="text-[#C50337]" /> Architectural & Hackathon Polish Suggestions
                      </h4>
                      <ul className="space-y-1.5 pl-1">
                        {auditState.result.architectureSuggestions?.map((sugg, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                            <span className="text-[#C50337] font-bold">•</span>
                            <span>{sugg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs flex items-center gap-1.5"
                      >
                        <FiPrinter size={13} />
                        <span>Print Audit Report</span>
                      </button>

                      <button
                        onClick={() => setAuditState({ isOpen: false, project: null, result: null, isLoading: false })}
                        className="px-5 py-2 rounded-xl bg-[#021C4F] text-amber-300 font-extrabold text-xs shadow-md hover:bg-[#0A369D]"
                      >
                        Close Audit
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: REAL EMAIL TRANSFER ── */}
      <AnimatePresence>
        {emailModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border-2 border-[#021C4F]"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div className="flex items-center gap-2 text-[#021C4F]">
                  <FiMail size={18} className="text-[#C50337]" />
                  <h3 className="font-extrabold text-base">Direct Real Email Transfer</h3>
                </div>
                <button
                  onClick={() => setEmailModalData(null)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSendRealEmail} className="space-y-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block">Recipient Email:</span>
                  <span className="font-mono text-emerald-700 font-bold">{emailModalData.recipientEmail}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Body Message</label>
                  <textarea
                    rows={5}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-[#021C4F] focus:border-[#021C4F] focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalData(null)}
                    className="px-3 py-1.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FiSend size={13} />
                    <span>Send Real Email Transfer</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: LIVE PROJECT RUNNER ── */}
      <AnimatePresence>
        {runningProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl h-[85vh] rounded-3xl bg-slate-900 text-white p-4 shadow-2xl border-2 border-amber-400/50 flex flex-col justify-between"
            >
              {/* Top Runner Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span>▶ Live Project Execution:</span>
                      <span className="text-amber-300">{runningProject.title}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Author: {runningProject.author} • Category: {runningProject.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {runningProject.demoUrl && (
                    <a
                      href={runningProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-700"
                    >
                      <FiMaximize2 size={12} /> Fullscreen Tab
                    </a>
                  )}
                  <button
                    onClick={() => setRunningProject(null)}
                    className="rounded-xl p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              {/* Live Execution Screen / Iframe / Simulation Runner */}
              <div className="my-3 flex-1 bg-black rounded-2xl overflow-hidden border border-slate-800 relative">
                {runningProject.demoUrl ? (
                  <iframe
                    src={runningProject.demoUrl}
                    title={runningProject.title}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                ) : (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-slate-950 to-slate-900 font-mono text-xs">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 border border-amber-400/30">
                      <FiCode size={30} />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h4 className="text-sm font-bold text-amber-300">{runningProject.title}</h4>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{runningProject.desc}</p>
                      <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                        {runningProject.techStack?.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {runningProject.githubUrl && (
                      <a
                        href={runningProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white font-bold text-xs flex items-center gap-2 border border-amber-400/30"
                      >
                        <FiGithub size={14} /> Open GitHub Source Code
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Runner Controls Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Status: <span className="text-emerald-400 font-mono">Running (Active Process)</span></span>
                <button
                  onClick={() => setRunningProject(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Close Runner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
