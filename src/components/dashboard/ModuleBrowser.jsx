// src/components/dashboard/ModuleBrowser.jsx
// One reusable "browse & filter" experience shared by E-Content, Notes and
// Question Papers — each page just passes its service + a card renderer.
import { useMemo, useState, useCallback, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { SEMESTERS, ALL_SUBJECTS, COURSE_TYPES, YEARS, VIDEO_TYPES } from "../../utils/constants";
import SkeletonCard from "../ui/SkeletonCard";
import EmptyState from "../ui/EmptyState";

const PAGE_SIZE = 9;

export default function ModuleBrowser({ service, renderCard, extraFilters, showYearFilter = false, showVideoTypeFilter = false }) {
  const [courseType, setCourseType] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [videoType, setVideoType] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debouncedSearch = useDebounce(search);

  const { items, loading } = useFirestoreList(service, {
    semester: semester ? Number(semester) : undefined,
    subject: subject || undefined,
    year: year || undefined,
    videoType: videoType || undefined,
  });

  const filtered = useMemo(() => {
    let result = items;

    // UG/PG filter
    if (courseType) {
      result = result.filter((item) => item.courseType === courseType);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.facultyName?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, debouncedSearch, courseType]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    setVisibleCount((c) => c + PAGE_SIZE);
  }, []);

  const lastRef = useInfiniteScroll(loadMore, hasMore, loading);

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [semester, subject, year, videoType, debouncedSearch, courseType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-card dark:border-slate-800/80 dark:bg-dark-card/90 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description…"
            className="input-field pl-10"
          />
        </div>

        <select
          value={courseType}
          onChange={(e) => setCourseType(e.target.value)}
          className="input-field"
        >
          <option value="">All Courses</option>
          {COURSE_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>{ct.label}</option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="input-field"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        >
          <option value="">All Subjects</option>
          {ALL_SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {showYearFilter && (
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input-field"
          >
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        )}

        {showVideoTypeFilter && (
          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            {VIDEO_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        )}

        {extraFilters}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No results found" description="Try a different search term or clear the filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, i) => (
              <div key={item.id} ref={i === visible.length - 1 ? lastRef : null}>
                {renderCard(item)}
              </div>
            ))}
          </div>
          {hasMore && (
            <p className="py-4 text-center text-sm text-slate-400">Scroll for more…</p>
          )}
        </>
      )}
    </div>
  );
}
