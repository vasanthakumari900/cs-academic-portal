// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiBriefcase, FiSearch,
  FiArrowRight, FiUsers, FiBookOpen, FiAward, FiTrendingUp,
  FiChevronRight, FiChevronLeft, FiStar, FiMonitor,
  FiDownload, FiBarChart2, FiGrid,
  FiExternalLink, FiMessageSquare,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { SAMPLE_PLACEMENTS } from "../utils/constants";
import { videoService } from "../services/videoService";
import { noteService } from "../services/noteService";
import { placementService } from "../services/placementService";
import { questionPaperService } from "../services/questionPaperService";
import { formatDate } from "../utils/helpers";

// ============== Animation variants ==============
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ============== Data ==============
const features = [
  { icon: FiMonitor, title: "Video Lectures", desc: "Full lecture videos organized by semester and subject, ready to stream on any device.", gradient: "from-blue-600 to-blue-800" },
  { icon: FiFileText, title: "Lecture Notes", desc: "Faculty-curated PDF notes with instant preview and one-click download.", gradient: "from-blue-700 to-blue-800" },
  { icon: FiGrid, title: "Question Papers", desc: "Previous year papers filterable by year, regulation, semester, and subject.", gradient: "from-blue-600 to-cyan-500" },
  { icon: FiBriefcase, title: "Placements", desc: "Live drives, eligibility criteria, salary packages, and direct apply links.", gradient: "from-blue-700 to-blue-900" },
  { icon: FiBarChart2, title: "Department Updates", desc: "Stay informed with the latest announcements and academic updates.", gradient: "from-blue-600 to-cyan-500" },
  { icon: FiSearch, title: "Search Everything", desc: "Universal search across videos, notes, papers, placements, and faculty.", gradient: "from-blue-700 to-blue-800" },
];

const quickStats = [
  { icon: FiUsers, value: "1,200+", label: "Active Students" },
  { icon: FiBookOpen, value: "180+", label: "Video Lectures" },
  { icon: FiFileText, value: "350+", label: "Study Materials" },
  { icon: FiAward, value: "₹18 LPA", label: "Highest Package" },
];

const faculty = [
  { name: "Dr. Ananya Rao", role: "Professor & HOD", expertise: "Distributed Systems", initials: "AR", gradient: "from-blue-600 to-blue-800" },
  { name: "Prof. Karthik Iyer", role: "Associate Professor", expertise: "Artificial Intelligence", initials: "KI", gradient: "from-blue-700 to-blue-900" },
  { name: "Dr. Meera Nair", role: "Associate Professor", expertise: "Database Systems", initials: "MN", gradient: "from-blue-600 to-cyan-500" },
  { name: "Prof. Rohan Das", role: "Assistant Professor", expertise: "Software Engineering", initials: "RD", gradient: "from-blue-700 to-blue-800" },
];

const testimonials = [
  { name: "Sanjana P.", batch: "2026 Batch", company: "Google", quote: "Every lecture and question paper I needed was in one place. No more chasing PDFs on WhatsApp — everything just works.", rating: 5 },
  { name: "Vignesh S.", batch: "2025 Batch", company: "Microsoft", quote: "The placement tracker kept me on top of deadlines and the curated notes helped me revise core concepts right before interviews.", rating: 5 },
  { name: "Divya M.", batch: "2026 Batch", company: "Amazon", quote: "Clean, fast, and it actually works well on my phone between classes. The video lectures are a lifesaver for revision on the go.", rating: 5 },
  { name: "Arun K.", batch: "2025 Batch", company: "TCS", quote: "Having all previous year question papers organized by semester made exam prep so much easier. Highly recommended for every CS student.", rating: 4 },
];

// ============== Animated Counter Hook ==============
function useAnimatedCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

// ============== Testimonial Carousel ==============
function TestimonialCarousel({ items }) {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % items.length);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <div className="premium-card p-8 text-center">
              <FiMessageSquare className="mx-auto mb-4 text-blue-200" size={36} />
              <p className="mb-6 text-base italic leading-relaxed text-gray-600 md:text-lg">
                &ldquo;{items[current].quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: items[current].rating }).map((_, i) => (
                  <FiStar key={i} className="fill-amber-400 text-amber-400" size={16} />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{items[current].name}</p>
                <p className="text-sm text-gray-500">
                  {items[current].batch} · Placed at {items[current].company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700">
          <FiChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-blue-600" : "w-2 bg-gray-200"}`}
            />
          ))}
        </div>
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700">
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ============== Main Component ==============
export default function Home() {
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();
  const { items: videos } = useFirestoreList(videoService, { max: 4 });
  const { items: notes } = useFirestoreList(noteService, { max: 4 });
  const { items: placements } = useFirestoreList(placementService, { max: 4 });
  const samplePlacements = placements.length > 0 ? placements : SAMPLE_PLACEMENTS;
  const { items: questionPapers } = useFirestoreList(questionPaperService, { max: 100 });

  const videoCount = useAnimatedCounter(videos.length > 0 ? videos.length : 50, 2000);
  const noteCount = useAnimatedCounter(notes.length > 0 ? notes.length : 300, 2000);
  const qpCount = useAnimatedCounter(questionPapers.length > 0 ? questionPapers.length : 200, 2000);
  const placementCount = useAnimatedCounter(placements.length > 0 ? placements.length : 100, 2000);

  function handleHeroSearch(e) {
    e.preventDefault();
    if (heroSearch.trim()) navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
  }

  return (
    <div>
      {/* ========================== HERO SECTION ========================== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="show" variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Dwarka Doss Goverdhan Doss Vaishnav College — CS Department
            </motion.span>

            <motion.h1 variants={fadeUp} className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
              Everything your Computer Science
              <br />
              <span className="text-gradient">degree needs, in one portal.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Watch lectures, download notes, access previous year question papers, and explore placement opportunities — all organized by semester and subject, available on every device.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/e-content" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-3.5 text-sm font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
                Explore Portal <FiArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.form onSubmit={handleHeroSearch} variants={fadeUp}
              className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-gray-100 bg-white/90 p-1.5 shadow-premium backdrop-blur-xl"
            >
              <div className="flex flex-1 items-center gap-2 pl-4">
                <FiSearch className="text-gray-400 shrink-0" size={18} />
                <input
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search videos, notes, question papers…"
                  className="w-full bg-transparent py-2.5 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2.5 text-xs font-semibold text-white shadow-soft">
                Search
              </button>
            </motion.form>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><FiBookOpen size={14} /> 180+ Videos</span>
              <span className="flex items-center gap-1.5"><FiFileText size={14} /> 350+ Materials</span>
              <span className="flex items-center gap-1.5"><FiUsers size={14} /> 1,200+ Students</span>
              <span className="flex items-center gap-1.5"><FiAward size={14} /> 92% Placement</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
      </section>

      {/* ========================== QUICK STATS GRID ========================== */}
      <section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {quickStats.map((s) => (
              <motion.div key={s.label} variants={fadeIn}>
                <div className="premium-card p-5 sm:p-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-soft">
                    <s.icon size={18} />
                  </div>
                  <p className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================== FEATURES SECTION ========================== */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Everything at your fingertips
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Your complete <span className="text-gradient">academic toolkit</span>
            </h2>
            <p className="mt-3 text-gray-500">
              Six modules designed around how the department actually shares material — organized so you find what you need in seconds.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <div className="premium-card-hover group h-full relative overflow-hidden p-6">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient}`} />
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-soft`}>
                    <f.icon size={20} />
                  </div>
                  <h3 className="mb-1.5 font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span> <FiArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================== COUNTERS (Animated) ========================== */}
      <section className="section-alt px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl" ref={videoCount.ref}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="rounded-3xl bg-gradient-cta p-8 text-white shadow-premium sm:p-12"
          >
            <div className="mb-6 text-center">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">By the numbers</h2>
              <p className="mt-1 text-sm text-white/80">Our growing repository of academic resources</p>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { count: videoCount.count, label: "Lecture Videos", icon: FiBookOpen, suffix: "+" },
                { count: noteCount.count, label: "Notes & Materials", icon: FiFileText, suffix: "+" },
                { count: qpCount.count, label: "Question Papers", icon: FiGrid, suffix: "+" },
                { count: placementCount.count, label: "Placement Drives", icon: FiBriefcase, suffix: "+" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="mx-auto mb-2 opacity-80" size={24} />
                  <p className="font-display text-3xl font-extrabold sm:text-4xl tabular-nums">
                    {s.count}{s.suffix}
                  </p>
                  <p className="text-sm text-white/80">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================== LATEST UPLOADS ========================== */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mb-10 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <span className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Fresh content
              </span>
              <h2 className="font-display text-3xl font-bold text-gray-900">Latest Uploads</h2>
              <p className="mt-1 text-gray-500">New material added by faculty, updated in real time.</p>
            </div>
            <Link to="/e-content" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:text-gray-800">
              Browse All <FiArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[...videos, ...notes].slice(0, 4).map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <div className="premium-card-hover group h-full p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      item.fileUrl?.includes(".mp4") || item.fileUrl?.includes("video")
                        ? "bg-blue-50 text-blue-700"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {item.fileUrl?.includes(".mp4") || item.fileUrl?.includes("video") ? <FiMonitor size={12} /> : <FiFileText size={12} />}
                      {item.fileUrl?.includes(".mp4") || item.fileUrl?.includes("video") ? "Video" : "Note"}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">{item.subject}</span>
                    <span>Sem {item.semester}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {[...videos, ...notes].length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-400 py-12">
                No uploads yet. Content will appear here once faculty start uploading.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ========================== FACULTY SECTION ========================== */}
      <section className="section-alt px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Our team
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900">Meet the Faculty</h2>
            <p className="mt-1 text-gray-500">Experts guiding the next generation of technologists.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {faculty.map((f) => (
              <motion.div key={f.name} variants={fadeUp}>
                <div className="premium-card-hover text-center p-6">
                  <div className="relative mx-auto mb-4">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${f.gradient} text-2xl font-bold text-white shadow-lg mx-auto transition-transform duration-300 group-hover:scale-105`}>
                      {f.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-600 shadow-soft">
                      <FiStar size={12} className="fill-current" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{f.name}</h3>
                  <p className="text-xs text-gray-500">{f.role}</p>
                  <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-medium text-blue-700">
                    {f.expertise}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================== PLACEMENT HIGHLIGHTS ========================== */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Top recruiters
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900">Placement Highlights</h2>
            <p className="mt-1 text-gray-500">Our students placed at the world's leading companies.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {samplePlacements.slice(0, 4).map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <div className="premium-card-hover h-full text-center p-5">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 shadow-soft ring-1 ring-gray-100 transition-transform group-hover:scale-110">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.companyName} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="font-display text-lg font-bold text-blue-600">{p.companyName?.[0]}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{p.companyName}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{p.role}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 px-3 py-1 text-xs font-semibold text-white">
                      ₹{p.package} LPA
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {p.eligibility}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                      <FiExternalLink size={11} /> Apply now
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {samplePlacements.length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-400 py-12">
                Placement drives will appear here once posted by the department.
              </p>
            )}
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-10 text-center">
            <Link to="/placements" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
              View All Placements <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================== TESTIMONIALS CAROUSEL ========================== */}
      <section className="section-alt px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Student voices
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900">What our students say</h2>
            <p className="mt-1 text-gray-500">Hear from the students who use the portal every day.</p>
          </motion.div>

          <TestimonialCarousel items={testimonials} />
        </div>
      </section>

      {/* ========================== CTA SECTION ========================== */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-cta p-10 sm:p-14 text-center text-white shadow-premium-lg"
        >
          {/* Decorative dots */}
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-white/80">
              Log in with your roll number and date of birth to get instant access to lecture videos, notes, question papers, and placement drives.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
                Access Portal <FiArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
