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
    <footer className="relative overflow-hidden bg-[#0A3356] text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E88E5] text-white text-base font-extrabold shadow-sm">
                DV
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-white">DDGDVC</span>
                <span className="text-xs text-white/70 -mt-0.5">CS Academic Portal</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70 max-w-md">
              Dwarka Doss Goverdhan Doss Vaishnav College · Department of Computer Science's home for e-content, notes, question papers and placement drives.
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/75">
                <FiMapPin size={14} className="text-white/60 shrink-0" />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/75">
                <FiMail size={14} className="text-white/60 shrink-0" />
                <span>csdept@ddgdvc.edu.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/75">
                <FiPhone size={14} className="text-white/60 shrink-0" />
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
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 transition-all duration-200 hover:bg-[#1E88E5] hover:text-white hover:border-[#1E88E5] hover:scale-105"
                ><Icon size={16} /></a>
              ))}
            </div>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/80">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}
                      className="group inline-flex items-center gap-2 text-sm text-white/70 transition-all duration-200 hover:text-white"
                    >
                      {item.icon && <item.icon size={13} className="text-white/40 group-hover:text-white transition-colors" />}
                      {item.label}
                      <FiChevronRight size={10} className="text-white/30 group-hover:text-white -ml-1 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/55">© {new Date().getFullYear()} DDGDVC CS Academic Portal — Department of Computer Science.</p>
            <div className="flex items-center gap-3 text-[11px] text-white/55">
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
