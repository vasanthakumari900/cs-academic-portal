// src/pages/student/Profile.jsx
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/helpers";
import { FiShield } from "react-icons/fi";

export default function Profile() {
  const { profile, user } = useAuth();
  const is24E3006 = user?.rollNumber === "24E3006";

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center">
      <h2 className="mb-6 font-sans text-2xl font-bold text-[#0F4C81]">Profile</h2>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
        {is24E3006 ? (
          /* Profile view for roll number 24E3006 ONLY */
          <div className="flex flex-col items-center">
            <img
              src={user?.photoUrl || "/admin_photo.jpg"}
              alt="THARUN B S"
              className="h-64 w-52 sm:h-72 sm:w-60 object-cover rounded-2xl border-4 border-[#0F4C81] shadow-xl mx-auto"
            />
            <h3 className="mt-5 font-sans text-2xl sm:text-3xl font-extrabold text-[#0F4C81] tracking-wider uppercase">
              {user?.name || "THARUN B S"}
            </h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C50337] px-3.5 py-1 text-xs font-extrabold text-white shadow-sm tracking-widest uppercase">
                <FiShield size={12} /> ADMIN
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C81]/10 px-3 py-1 text-xs font-bold text-[#0F4C81]">
                Roll No: 24E3006
              </span>
            </div>
          </div>
        ) : (
          /* Original profile view for all other students */
          <div className="flex flex-col items-center w-full">
            <div className="mb-6 flex items-center gap-4 text-left w-full">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0F4C81] text-xl font-bold text-white shadow-sm">
                {initials(user?.name || profile?.name || "S")}
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-[#0F4C81]">{user?.name || profile?.name}</h3>
                <span className="inline-block rounded-full bg-[#0F4C81]/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-[#0F4C81]">
                  Student
                </span>
              </div>
            </div>
          </div>
        )}

        <dl className="w-full mt-6 space-y-3 text-sm text-left border-t border-[#E5E7EB] pt-4">
          <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
            <dt className="text-[#6B7280]">Roll Number</dt>
            <dd className="text-[#0F4C81] font-bold">{user?.rollNumber}</dd>
          </div>
          {user?.section && (
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
              <dt className="text-[#6B7280]">Section & Year</dt>
              <dd className="text-[#0F4C81] font-bold">Sec {user.section} · {user.year === 1 ? "1st Year" : user.year === 2 ? "2nd Year" : "3rd Year"}</dd>
            </div>
          )}
          <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
            <dt className="text-[#6B7280]">Department</dt>
            <dd className="text-[#0F4C81] font-medium">Computer Science</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
