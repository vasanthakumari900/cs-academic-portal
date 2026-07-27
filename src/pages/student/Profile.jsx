// src/pages/student/Profile.jsx
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/helpers";
import { FiShield } from "react-icons/fi";

export default function Profile() {
  const { profile, user } = useAuth();
  const is24E3006 = user?.rollNumber === "24E3006" || Boolean(user?.photoUrl);
  const photoPath = user?.photoUrl || "/admin_photo.jpg";

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center bg-[#F8FAFC]">
      <h2 className="mb-6 font-sans text-2xl font-bold text-[#1E3A8A]">Student Profile</h2>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
        {is24E3006 ? (
          /* Profile view for roll number 24E3006 / Photo user */
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute -inset-1 rounded-2xl bg-[#1E3A8A]/20 blur-sm" />
              <img
                src={photoPath}
                alt={user?.name || "THARUN B S"}
                className="relative h-60 w-48 sm:h-64 sm:w-52 object-cover rounded-2xl border-4 border-[#1E3A8A] shadow-md mx-auto"
                onError={(e) => {
                  e.target.src = "/admin_photo.jpg";
                }}
              />
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-wider uppercase">
              {user?.name || "THARUN B S"}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1E3A8A] px-3.5 py-1 text-xs font-extrabold text-white shadow-sm tracking-widest uppercase">
                <FiShield size={12} /> {user?.adminBadge || "ADMIN"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-xs font-bold text-[#1E3A8A]">
                Roll No: {user?.rollNumber || "24E3006"}
              </span>
            </div>
          </div>
        ) : (
          /* Standard profile view for other students */
          <div className="flex flex-col items-center w-full">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1E3A8A] text-2xl font-extrabold text-white shadow-sm mb-4">
              {initials(user?.name || profile?.name || "Student")}
            </div>

            <h3 className="font-sans text-xl font-bold text-[#1E3A8A]">
              {user?.name || profile?.name || "Student Name"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Department of Computer Science
            </p>
          </div>
        )}

        <dl className="w-full mt-6 space-y-3 text-sm text-left border-t border-slate-200 pt-5">
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <dt className="text-slate-500 font-medium">Roll Number</dt>
            <dd className="text-[#1E3A8A] font-bold">{user?.rollNumber || "24E3006"}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <dt className="text-slate-500 font-medium">Department</dt>
            <dd className="text-[#1E3A8A] font-semibold">Computer Science</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <dt className="text-slate-500 font-medium">Year &amp; Semester</dt>
            <dd className="text-[#1E3A8A] font-bold">
              {user?.year === 1 ? "1st Year" : user?.year === 2 ? "2nd Year" : "3rd Year"} · Semester {user?.semester || 5}
            </dd>
          </div>
          {user?.section && (
            <div className="flex justify-between border-b border-slate-100 pb-2.5">
              <dt className="text-slate-500 font-medium">Section</dt>
              <dd className="text-[#1E3A8A] font-bold">Section {user.section}</dd>
            </div>
          )}
          <div className="flex justify-between pb-1">
            <dt className="text-slate-500 font-medium">Institution</dt>
            <dd className="text-[#1E3A8A] font-medium">Dwaraka Doss Goverdhan Doss Vaishnav College</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
