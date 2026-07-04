// src/pages/About.jsx
import { motion } from "framer-motion";
import {
  FiTarget, FiEye, FiAward, FiMonitor,
  FiMail, FiPhone, FiMapPin, FiBookOpen,
} from "react-icons/fi";
import GlassCard from "../components/ui/GlassCard";

const vision = "To be a center of excellence in Computer Science education, research, and innovation, producing globally competitive professionals who drive technological transformation.";
const mission = [
  "Provide a rigorous, industry-aligned curriculum that fosters analytical thinking and problem-solving skills.",
  "Promote cutting-edge research in emerging areas such as AI, Machine Learning, Cybersecurity, and Cloud Computing.",
  "Cultivate an ecosystem of innovation through industry partnerships, hackathons, and entrepreneurial initiatives.",
  "Nurture ethical, socially responsible technologists who contribute meaningfully to society.",
];

const achievements = [
  { value: "NBA Accredited", label: "Program Accreditation" },
  { value: "A+ Grade", label: "NAAC Rating" },
  { value: "50+", label: "Research Publications" },
  { value: "₹18 LPA", label: "Highest Placement" },
  { value: "30+", label: "Industry Partners" },
  { value: "100%", label: "Faculty Doctorates" },
];

const labs = [
  { name: "AI & Machine Learning Lab", desc: "Equipped with high-performance workstations for deep learning, NLP, and computer vision research." },
  { name: "Cyber Security Lab", desc: "Dedicated environment for network security testing, ethical hacking, and digital forensics." },
  { name: "Cloud Computing Lab", desc: "Access to AWS, Azure, and Google Cloud platforms for hands-on cloud infrastructure training." },
  { name: "IoT & Embedded Systems Lab", desc: "Arduino, Raspberry Pi, and sensor kits for building real-world IoT solutions." },
  { name: "Software Development Lab", desc: "Agile development space with industry-standard tools for full-stack and mobile projects." },
  { name: "Data Science & Analytics Lab", desc: "Big data tools, visualization suites, and statistical analysis software for data-driven projects." },
];

const faculty = [
  { name: "Dr. Ananya Rao", role: "Professor & Head of Department", expertise: "Distributed Systems" },
  { name: "Dr. Karthik Iyer", role: "Associate Professor", expertise: "Artificial Intelligence" },
  { name: "Dr. Meera Nair", role: "Associate Professor", expertise: "Database Systems" },
  { name: "Prof. Rohan Das", role: "Assistant Professor", expertise: "Software Engineering" },
  { name: "Dr. Priya Sharma", role: "Assistant Professor", expertise: "Cyber Security" },
  { name: "Prof. Arjun Menon", role: "Assistant Professor", expertise: "Computer Networks" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-maroon/30 bg-maroon/10 px-4 py-1.5 text-xs font-semibold text-maroon dark:border-gold/30 dark:bg-gold/10 dark:text-gold">
          About Us
        </span>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Department of <span className="text-gradient">Computer Science</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          The CS Academic Portal is the Department of Computer Science's single
          home for academic material — lecture videos, notes, question papers
          and placement information — built to replace scattered PDFs, shared
          drives and messaging groups with one searchable, organized system.
        </p>
      </motion.div>

      {/* Vision & Mission */}
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <GlassCard className="h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-maroon to-gold text-white">
              <FiEye size={20} />
            </div>
            <h2 className="mb-3 font-display text-xl font-bold">Our Vision</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{vision}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-accent text-white">
              <FiTarget size={20} />
            </div>
            <h2 className="mb-3 font-display text-xl font-bold">Our Mission</h2>
            <ul className="space-y-2">
              {mission.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {m}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-20">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          Department <span className="text-gradient">Achievements</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="text-center">
                <p className="font-display text-lg font-extrabold text-maroon dark:text-gold">{a.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{a.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Laboratories */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-20">
        <h2 className="mb-2 text-center font-display text-2xl font-bold">
          Our <span className="text-gradient">Laboratories</span>
        </h2>
        <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
          State-of-the-art labs equipped with modern tools and technologies.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.name}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="h-full">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-maroon/10 text-maroon dark:bg-gold/10 dark:text-gold">
                  <FiMonitor size={18} />
                </div>
                <h3 className="mb-1 font-display text-sm font-semibold">{lab.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{lab.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Faculty Highlights */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-20">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          <span className="text-gradient">Faculty</span> Highlights
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f, i) => (
            <motion.div
              key={f.name}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-lg font-bold text-white">
                  {f.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-display text-sm font-semibold">{f.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.role}</p>
                <span className="mt-2 inline-block rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] font-semibold text-maroon dark:bg-gold/10 dark:text-gold">
                  {f.expertise}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-20">
        <GlassCard hover={false} className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 font-display text-2xl font-bold">Get in Touch</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <FiMapPin className="text-maroon dark:text-gold" size={20} />
              <p className="text-xs text-slate-500 dark:text-slate-400">CS Department, University Campus</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiMail className="text-maroon dark:text-gold" size={20} />
              <p className="text-xs text-slate-500 dark:text-slate-400">csdept@university.edu</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiPhone className="text-maroon dark:text-gold" size={20} />
              <p className="text-xs text-slate-500 dark:text-slate-400">+91-12345-67890</p>
            </div>
          </div>
        </GlassCard>
      </motion.section>
    </div>
  );
}
