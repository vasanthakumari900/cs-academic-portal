import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiChevronRight, FiBookOpen, FiFileText, FiBriefcase, FiMapPin, FiPhone, FiInstagram, FiTwitter, FiAward } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.type === "faculty") return "/faculty/dashboard";
    if (user.type === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const links = [
    {
      title: "Resources",
      items: [
        { label: "E-Content", to: "/e-content", icon: FiBookOpen },
        { label: "Lecture Notes", to: "/notes", icon: FiFileText },
        { label: "Question Papers", to: "/question-papers", icon: FiFileText },
        { label: "CIA Papers", to: "/cia-question-papers", icon: FiAward },
        { label: "Placements", to: "/placements", icon: FiBriefcase },
      ],
    },
    {
      title: "Department",
      items: [
        { label: "About Us", to: "/about" },
        { label: "Faculty", to: "/about#faculty" },
        { label: "Labs", to: "/about#labs" },
      ],
    },
    {
      title: "Quick Links",
      items: [
        { label: "Search", to: "/search" },
        { label: user?.type === "faculty" ? "Faculty Dashboard" : user?.type === "admin" ? "Admin Dashboard" : "Student Dashboard", to: getDashboardPath() },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0B1121] to-[#0F172A] text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{
        backgroundImage: `radial-gradient(at 20% 20%, rgba(37,99,235,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(30,64,175,0.08) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(6,182,212,0.08) 0px, transparent 50%)`
      }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-base font-extrabold shadow-lg shadow-indigo-500/20">
                DV
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-white">DDGDVC</span>
                <span className="text-xs text-cyan-400/70 -mt-0.5">CS Academic Portal</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-md">
              Dwarka Doss Goverdhan Doss Vaishnav College · Department of Computer Science's home for e-content, notes, question papers and placement drives.
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <FiMapPin size={14} className="text-cyan-400 shrink-0" />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <FiMail size={14} className="text-cyan-400 shrink-0" />
                <span>csdept@ddgdvc.edu.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <FiPhone size={14} className="text-cyan-400 shrink-0" />
                <span>+91-44-1234-5678</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { icon: FiGithub, href: "#", label: "GitHub" },
                { icon: FiLinkedin, href: "#", label: "LinkedIn" },
                { icon: FiTwitter, href: "#", label: "Twitter" },
                { icon: FiInstagram, href: "#", label: "Instagram" },
                { icon: FiMail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 transition-all duration-200 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 hover:scale-105"
                ><Icon size={16} /></a>
              ))}
            </div>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-cyan-400/60">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}
                      className="group inline-flex items-center gap-2 text-sm text-white/50 transition-all duration-200 hover:text-cyan-300"
                    >
                      {item.icon && <item.icon size={13} className="text-white/30 group-hover:text-cyan-400 transition-colors" />}
                      {item.label}
                      <FiChevronRight size={10} className="text-white/20 group-hover:text-cyan-400 -ml-1 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">© {new Date().getFullYear()} DDGDVC CS Academic Portal — Department of Computer Science.</p>
            <div className="flex items-center gap-3 text-[11px] text-white/40">
              <span>All rights reserved</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Made with <span className="text-red-400">♥</span> for students</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>DDGD Vaishnav College</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
