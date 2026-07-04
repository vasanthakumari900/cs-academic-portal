// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-maroon/10 bg-white/95 dark:border-gold/10 dark:bg-dark-surface/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-maroon to-gold text-white text-sm font-extrabold">
              DV
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-dark dark:text-white/90">DDGDVC</span>
              <span className="text-[10px] text-slate-500 -mt-0.5">CS Academic Portal</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dwarka Doss Goverdhan Doss Vaishnav College · Department of Computer Science's home for e-content, notes,
            question papers and placement drives.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/e-content" className="hover:text-maroon dark:hover:text-gold">E Content</Link></li>
            <li><Link to="/notes" className="hover:text-maroon dark:hover:text-gold">Lecture Notes</Link></li>
            <li><Link to="/question-papers" className="hover:text-maroon dark:hover:text-gold">Question Papers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">Department</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/placements" className="hover:text-maroon dark:hover:text-gold">Placements</Link></li>
            <li><Link to="/about" className="hover:text-maroon dark:hover:text-gold">About</Link></li>
            <li><Link to="/login" className="hover:text-maroon dark:hover:text-gold">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">Connect</h4>
          <div className="flex gap-3 text-slate-500 dark:text-slate-400">
            <a href="#" aria-label="GitHub" className="hover:text-maroon dark:hover:text-gold"><FiGithub size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-maroon dark:hover:text-gold"><FiLinkedin size={18} /></a>
            <a href="#" aria-label="Email" className="hover:text-maroon dark:hover:text-gold"><FiMail size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} DDGDVC CS Academic Portal — Department of Computer Science, Dwarka Doss Goverdhan Doss Vaishnav College.
      </div>
    </footer>
  );
}
