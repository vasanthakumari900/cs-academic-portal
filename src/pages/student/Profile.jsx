// src/pages/student/Profile.jsx
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/helpers";

export default function Profile() {
  const { profile, user } = useAuth();

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-left">
      <h2 className="mb-6 font-sans text-2xl font-bold text-[#0F4C81]">Profile</h2>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F4C81] text-xl font-bold text-white shadow-sm">
            {initials(profile?.name || "U")}
          </div>
          <div>
            <h3 className="font-sans text-lg font-semibold text-[#0F4C81]">{profile?.name}</h3>
            <span className="inline-block rounded-full bg-[#0F4C81]/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-[#0F4C81]">
              {profile?.role}
            </span>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
            <dt className="text-[#6B7280]">Email</dt>
            <dd className="text-[#0F4C81] font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
            <dt className="text-[#6B7280]">Bookmarks</dt>
            <dd className="text-[#0F4C81] font-medium">{profile?.bookmarks?.length ?? 0}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
