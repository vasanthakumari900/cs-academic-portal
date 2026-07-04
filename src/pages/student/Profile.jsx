// src/pages/student/Profile.jsx
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/ui/GlassCard";
import { initials } from "../../utils/helpers";

export default function Profile() {
  const { profile, user } = useAuth();

  return (
    <div className="max-w-xl">
      <h2 className="mb-6 font-display text-2xl font-bold">Profile</h2>
      <GlassCard hover={false}>
        <div className="mb-6 flex items-center gap-4">           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-xl font-bold text-white">
            {initials(profile?.name || "U")}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">{profile?.name}</h3>
            <span className="inline-block rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-maroon dark:bg-gold/10 dark:text-gold">
              {profile?.role}
            </span>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/10">
            <dt className="text-slate-500">Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-white/10">
            <dt className="text-slate-500">Bookmarks</dt>
            <dd>{profile?.bookmarks?.length ?? 0}</dd>
          </div>
        </dl>
      </GlassCard>
    </div>
  );
}
