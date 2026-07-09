// src/components/layout/Footer.jsx
// Premium Awwwards-inspired university footer.
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiChevronRight, FiBookOpen, FiFileText, FiBriefcase } from "react-icons/fi";

export default function Footer() {
  const links = [
    {
      title: "Resources",
      items: [
        { label: "E Content", to: "/e-content", icon: FiBookOpen },
        { label: "Lecture Notes", to: "/notes", icon: FiFileText },
        { label: "Question Papers", to: "/question-papers", icon: FiFileText },
        { label: "Placements", to: "/placements", icon: FiBriefcase },
      ],
    },
    {
      title: "Department",
      items: [
        { label: "About Us", to: "/about" },
        { label: "Student Login", to: "/login" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-white">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
      
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none bg-mesh" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-extrabold shadow-soft">
                DV
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-gray-900">DDGDVC</span>
                <span className="text-[11px] text-gray-500 -mt-0.5">CS Academic Portal</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Dwarka Doss Goverdhan Doss Vaishnav College · Department of Computer Science's home for e-content, notes, question papers and placement drives.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 hover:scale-105">
                <FiGithub size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 hover:scale-105">
                <FiLinkedin size={16} />
              </a>
              <a href="#" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 hover:scale-105">
                <FiMail size={16} />
              </a>
            </div>
          </div>

          {/* Link sections */}
          {links.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-all duration-200 hover:text-blue-600"
                    >
                      {item.icon && <item.icon size={13} className="text-gray-400 group-hover:text-blue-500 transition-colors" />}
                      {item.label}
                      <FiChevronRight size={10} className="text-gray-300 group-hover:text-blue-500 -ml-0.5 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* College info */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
              College
            </h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Dwarka Doss Goverdhan Doss<br />Vaishnav College</p>
              <p>Department of Computer Science</p>
              <p className="text-xs text-gray-400">Chennai, Tamil Nadu</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} DDGDVC CS Academic Portal — Department of Computer Science.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-gray-400">
              <span>All rights reserved</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Made with <span className="text-red-400">♥</span> for students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
