// src/pages/student/RecentlyViewed.jsx
import { useState, useEffect } from "react";
import { FiClock, FiTrash2 } from "react-icons/fi";
import { getRecentlyViewed, clearRecentlyViewed } from "../../utils/recentlyViewed";
import GlassCard from "../../components/ui/GlassCard";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/helpers";

const typeLabels = {
  video: { label: "Video", color: "bg-maroon/10 text-maroon dark:bg-gold/10 dark:text-gold" },
  note: { label: "Note", color: "bg-accent/10 text-accent" },
  paper: { label: "Question Paper", color: "bg-secondary/10 text-secondary" },
};

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  function handleClear() {
    clearRecentlyViewed();
    setItems([]);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Recently Viewed</h2>
          <p className="text-slate-500 dark:text-slate-400">Your browsing history across the portal.</p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" onClick={handleClear} className="gap-2">
            <FiTrash2 size={16} /> Clear all
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="Nothing viewed yet"
          description="Videos and documents you open will appear here for quick access."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const meta = typeLabels[item.type] || typeLabels.video;
            return (
              <GlassCard key={`${item.type}-${item.id}`} hover>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${meta.color}`}>
                  {meta.label}
                </span>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                {item.subject && <p className="mt-1 text-sm text-slate-500">{item.subject}</p>}
                <p className="mt-2 text-xs text-slate-400">
                  Viewed {formatDate(new Date(item.viewedAt))}
                </p>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
