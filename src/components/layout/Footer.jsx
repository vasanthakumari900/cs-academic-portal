import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiGithub, FiLinkedin, FiMail, FiChevronRight, FiBookOpen,
  FiFileText, FiBriefcase, FiMapPin, FiPhone, FiInstagram,
  FiTwitter, FiAward, FiFacebook, FiYoutube, FiExternalLink, FiGlobe,
  FiX, FiMaximize2
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import collegeLogo from "../../assets/college-logo.jpg";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";

export default function Footer() {
  const { user } = useAuth();
  const [selectedLogoModal, setSelectedLogoModal] = useState(null);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.type === "faculty" || user.role === "faculty") return "/faculty/dashboard";
    if (user.type === "admin" || user.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const resourceLinks = [
    { label: "E-Content & Videos", to: "/e-content", icon: FiBookOpen },
    { label: "Lecture Notes", to: "/notes", icon: FiFileText },
    { label: "Question Papers", to: "/question-papers", icon: FiFileText },
    { label: "CIA Papers", to: "/cia-question-papers", icon: FiAward },
    { label: "Placements", to: "/placements", icon: FiBriefcase },
  ];

  const departmentLinks = [
    { label: "About Us", to: "/about" },
    { label: "Faculty Members", to: "/about#faculty" },
    { label: "Campus Leadership", to: "/about" },
    { label: "Welfare Committees", to: "/about" },
  ];

  const quickLinks = [
    { label: "Global Search", to: "/search" },
    {
      label: user?.type === "faculty" || user?.role === "faculty" ? "Faculty Dashboard" : user?.type === "admin" || user?.role === "admin" ? "Admin Dashboard" : "Student Dashboard",
      to: getDashboardPath()
    },
    { label: "Vaishnav LMS", to: "https://dgvc.in/lms/login.php", isExternal: true },
    { label: "College Fees Payment", to: "https://payments.billdesk.com/bdcollect/pay?p1=521&p2=17", isExternal: true },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#3A101A] via-[#250A11] to-[#0F060B] text-white font-sans">
      {/* Subtle Grid Accent Pattern */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      {/* Gold glow orb */}
      <div className="absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-[#D97706]/15 blur-[100px] pointer-events-none" />

      {/* ── Top Highlight Banner ── */}
      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F4C266] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4C266]" />
            </span>
            <span className="font-extrabold text-[#F4C266] uppercase tracking-wider font-heading">
              NAAC Accredited 'A++' Grade (CGPA 3.54/4)
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/70">
              Affiliated to University of Madras — Linguistic Minority Institution
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 font-bold">
            <a href="https://dgvc.in/lms/login.php" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-gradient-to-b from-[#E08813] to-[#D97706] text-white px-3 py-1 rounded-lg hover:from-[#F4C266] hover:to-[#E08813] transition-all font-black text-xs shadow-[0_4px_14px_rgba(217,119,6,0.3)]">
              <FiBookOpen size={13} /> Vaishnav LMS Portal <FiExternalLink size={11} />
            </a>
            <a href="https://www.dgvaishnavcollege.edu.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-white transition-colors">
              <FiGlobe size={13} className="text-[#F4C266]" /> Official Website <FiExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1 & 2: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="leading-tight">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide font-heading">
                DDGD Vaishnav College
              </h3>
              <p className="text-xs text-[#F4C266] font-semibold mt-0.5">
                CS Academic Portal · Dept. of Computer Science
              </p>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
              Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous). Imparting value-based quality education and academic excellence since 1964.
            </p>

            {/* Official Contact Badges */}
            <div className="space-y-2.5 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <FiMapPin size={16} className="text-[#F4C266] shrink-0 mt-0.5" />
                <span className="leading-normal">
                  #833, E.V.R. Periyar High Road, Arumbakkam, Chennai – 600 106, Tamilnadu.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone size={15} className="text-[#F4C266] shrink-0" />
                <span>+91 - 9498344201 / 9498344202</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail size={15} className="text-[#F4C266] shrink-0" />
                <a href="mailto:principal@dgvaishnavcollege.edu.in" className="hover:text-[#F4C266] transition-colors">
                  principal@dgvaishnavcollege.edu.in
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: FiFacebook, href: "https://www.facebook.com/profile.php?id=100093526835295", label: "Facebook" },
                { icon: FiYoutube, href: "https://www.youtube.com/channel/UCXFUIZUZs4oPgu2-hOF46Tw", label: "YouTube" },
                { icon: FiInstagram, href: "https://www.instagram.com/ddgdvc_official/", label: "Instagram" },
                { icon: FiTwitter, href: "https://twitter.com/DDGDVC_Official", label: "Twitter" },
                { icon: FiLinkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white/80 transition-all duration-200 hover:bg-[#D97706] hover:text-white hover:border-[#D97706] hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* Bottom-Left Logos Showcase (Above Focus Studio) */}
            <div className="pt-4 border-t-2 border-white/20 w-full">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#F4C266] mb-2.5 font-heading flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F4C266] animate-pulse" />
                Institutional &amp; Department Emblems
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                {/* 1. DDGD Vaishnav College Logo */}
                <button
                  type="button"
                  onClick={() => setSelectedLogoModal({
                    src: collegeLogo,
                    title: "Dwaraka Doss Goverdhan Doss Vaishnav College",
                    subtitle: "Official College Seal · Est. 1964 · Reaccredited A++ by NAAC",
                    badge: "Official College Emblem",
                    url: "https://www.dgvaishnavcollege.edu.in/"
                  })}
                  className="flex items-center gap-2 sm:gap-2.5 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-[#F4C266] hover:border-amber-400 hover:scale-105 transition-all duration-300 group cursor-pointer text-left w-full min-w-0"
                  title="Click to view DDGDVC Official Seal in full screen"
                >
                  <div className="relative shrink-0">
                    <img
                      src={collegeLogo}
                      alt="DDGD Vaishnav College Logo"
                      className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-xl drop-shadow-sm"
                    />
                    <span className="absolute -top-1 -right-1 bg-[#D97706] text-white p-0.5 rounded-full opacity-90 group-hover:scale-110 transition-all shadow-sm">
                      <FiMaximize2 size={9} />
                    </span>
                  </div>
                  <div className="min-w-0 leading-tight">
                    <span className="text-xs sm:text-sm font-black text-[#2D060E] block font-heading truncate">
                      DDGDVC
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-[#800020] uppercase tracking-wider block mt-0.5 truncate">
                      Official Seal 🔍
                    </span>
                  </div>
                </button>

                {/* 2. CS Academic Portal Emblem */}
                <button
                  type="button"
                  onClick={() => setSelectedLogoModal({
                    src: csPortalLogo,
                    title: "CS Academic Portal",
                    subtitle: "Department of Computer Science Official Emblem",
                    badge: "Department Emblem",
                    url: "/"
                  })}
                  className="flex items-center gap-2 sm:gap-2.5 bg-[#FBF7F2] p-2.5 rounded-2xl shadow-xl border-2 border-[#D97706] hover:border-amber-400 hover:scale-105 transition-all duration-300 group cursor-pointer text-left w-full min-w-0"
                  title="Click to view CS Academic Portal Emblem in full screen"
                >
                  <div className="relative shrink-0">
                    <img
                      src={csPortalLogo}
                      alt="CS Academic Portal Logo"
                      className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-xl drop-shadow-sm"
                    />
                    <span className="absolute -top-1 -right-1 bg-[#D97706] text-white p-0.5 rounded-full opacity-90 group-hover:scale-110 transition-all shadow-sm">
                      <FiMaximize2 size={9} />
                    </span>
                  </div>
                  <div className="min-w-0 leading-tight">
                    <span className="text-xs sm:text-sm font-black text-[#4A1620] block font-heading truncate">
                      CS PORTAL
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-[#D97706] uppercase tracking-wider block mt-0.5 truncate">
                      Dept Emblem 🔍
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#F4C266] border-b border-[#F4C266]/20 pb-2 inline-block font-heading">
              Academic Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <item.icon size={13} className="text-[#F4C266] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Department */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#F4C266] border-b border-[#F4C266]/20 pb-2 inline-block font-heading">
              Department
            </h4>
            <ul className="space-y-2.5">
              {departmentLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <FiChevronRight size={12} className="text-white/40 group-hover:text-[#F4C266] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#F4C266] border-b border-[#F4C266]/20 pb-2 inline-block font-heading">
              Quick Portals
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.to}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-all duration-200 hover:text-[#F4C266] hover:translate-x-1"
                    >
                      <FiExternalLink size={12} className="text-[#F4C266] shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="group flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-white/40 group-hover:text-[#F4C266] transition-colors" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom Copyright Bar ── */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white font-semibold">
          <p className="text-white text-xs sm:text-sm font-bold tracking-wide">
            © {new Date().getFullYear()} Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous). Department of Computer Science.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/90">
            <span className="text-white/70">Chennai, Tamil Nadu</span>
            <span className="text-[#F4C266]">•</span>
            <span className="text-[#F4C266] font-black tracking-wider uppercase bg-white/10 px-2.5 py-1 rounded-md border border-[#F4C266]/30 font-heading">
              CS Academic Portal
            </span>
          </div>
        </div>
      </div>

      {/* Full Screen Logo Viewer Lightbox Modal */}
      <AnimatePresence>
        {selectedLogoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F060B]/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedLogoModal(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedLogoModal(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-[#C50337] hover:scale-110 transition-all cursor-pointer z-10"
              title="Close Full Screen"
            >
              <FiX size={26} />
            </button>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex flex-col items-center justify-center max-w-3xl max-h-[90vh] bg-[#250A11] p-6 sm:p-8 rounded-3xl border-2 border-[#F4C266]/50 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="bg-[#D97706] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-4 shadow-sm">
                {selectedLogoModal.badge}
              </span>
              <img
                src={selectedLogoModal.src}
                alt={selectedLogoModal.title}
                className="max-w-full max-h-[55vh] object-contain rounded-2xl shadow-2xl border-4 border-[#F4C266] bg-white p-4"
              />
              <h3 className="mt-5 text-xl sm:text-2xl font-black text-white font-heading">
                {selectedLogoModal.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#F4C266] font-semibold">
                {selectedLogoModal.subtitle}
              </p>
              {selectedLogoModal.url.startsWith("http") ? (
                <a
                  href={selectedLogoModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg hover:scale-105 uppercase tracking-wider"
                >
                  Visit Official College Website <FiExternalLink size={14} />
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
