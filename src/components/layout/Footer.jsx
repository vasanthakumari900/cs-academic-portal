// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  FiGithub, FiLinkedin, FiMail, FiChevronRight, FiBookOpen,
  FiFileText, FiBriefcase, FiMapPin, FiPhone, FiInstagram,
  FiTwitter, FiAward, FiFacebook, FiYoutube, FiExternalLink, FiGlobe
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import collegeLogo from "../../assets/college-logo.jpg";

const COLLEGE_LOGO_ONLINE = "https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2022/09/College-Logo-New.jpg";

export default function Footer() {
  const { user } = useAuth();

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
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#021C4F] via-[#011337] to-slate-950 text-white font-sans border-t-4 border-[#C50337]">
      {/* Subtle Grid Accent Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* ── Top Highlight Banner ── */}
      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-amber-300 uppercase tracking-wider">
              NAAC Accredited 'A++' Grade (CGPA 3.54/4)
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-slate-300">
              Affiliated to University of Madras — Linguistic Minority Institution
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-white/90 font-bold">
            <a href="https://dgvc.in/lms/login.php" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-amber-400 text-slate-900 px-3 py-1 rounded-lg hover:bg-amber-300 transition-all font-black text-xs">
              <FiBookOpen size={13} /> Vaishnav LMS Portal <FiExternalLink size={11} />
            </a>
            <a href="https://www.dgvaishnavcollege.edu.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-white transition-colors">
              <FiGlobe size={13} className="text-cyan-400" /> Official Website <FiExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1 & 2: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-lg border border-amber-400/30 shrink-0">
                <img
                  src={COLLEGE_LOGO_ONLINE}
                  onError={(e) => { e.target.src = collegeLogo; }}
                  alt="DGVC Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div className="leading-tight">
                <h3 className="text-base font-extrabold text-white tracking-wide font-serif">
                  DDGD Vaishnav College
                </h3>
                <p className="text-xs text-rose-300 font-semibold mt-0.5">
                  CS Academic Portal · Dept. of Computer Science
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous). Imparting value-based quality education and academic excellence since 1964.
            </p>

            {/* Official Contact Badges */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <FiMapPin size={16} className="text-[#C50337] shrink-0 mt-0.5" />
                <span className="leading-normal">
                  #833, E.V.R. Periyar High Road, Arumbakkam, Chennai – 600 106, Tamilnadu.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone size={15} className="text-emerald-400 shrink-0" />
                <span>+91 - 9498344201 / 9498344202</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail size={15} className="text-amber-300 shrink-0" />
                <a href="mailto:principal@dgvaishnavcollege.edu.in" className="hover:text-amber-200 transition-colors">
                  principal@dgvaishnavcollege.edu.in
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white/80 transition-all duration-200 hover:bg-[#C50337] hover:text-white hover:border-[#C50337] hover:scale-110 shadow-xs"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-amber-300 border-b border-amber-300/20 pb-2 inline-block">
              Academic Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <item.icon size={13} className="text-[#C50337] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Department */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-amber-300 border-b border-amber-300/20 pb-2 inline-block">
              Department
            </h4>
            <ul className="space-y-2.5">
              {departmentLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <FiChevronRight size={12} className="text-white/40 group-hover:text-amber-300 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-amber-300 border-b border-amber-300/20 pb-2 inline-block">
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
                      className="group flex items-center gap-2 text-xs sm:text-sm text-slate-300 transition-all duration-200 hover:text-cyan-300 hover:translate-x-1"
                    >
                      <FiExternalLink size={12} className="text-cyan-400 shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="group flex items-center gap-2 text-xs sm:text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-white/40 group-hover:text-amber-300 transition-colors" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom Copyright Bar ── */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous). Department of Computer Science.</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Chennai, Tamil Nadu</span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">CS Academic Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
