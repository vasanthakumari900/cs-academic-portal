// src/pages/admin/ManageStudents.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { db } from "../../firebase/config";
import { COLLECTIONS, ROLES } from "../../utils/constants";
import { initials } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import StatCard from "../../components/ui/StatCard";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    setLoading(true);
    const q = query(collection(db, COLLECTIONS.USERS), where("role", "==", ROLES.STUDENT));
    const snap = await getDocs(q);
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadStudents(); }, []);

  async function promoteToFaculty(id) {
    await updateDoc(doc(db, COLLECTIONS.USERS, id), { role: ROLES.FACULTY });
    toast.success("Student promoted to faculty");
    loadStudents();
  }

  async function removeUser(id) {
    if (!confirm("Remove this student profile?")) return;
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    toast.success("Student removed");
    loadStudents();
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-left bg-[#F8FAFC]">
      <h2 className="mb-2 font-sans text-2xl font-bold text-[#1F2937]">Manage Students</h2>
      <p className="mb-6 text-sm text-[#6B7280]">View and manage all student accounts.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiUsers} label="Total Students" value={students.length} accent="primary" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState title="No students registered" description="Student accounts appear here when users register." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs uppercase text-[#6B7280] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Bookmarks</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {students.map((s) => (
                <tr key={s.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="flex items-center gap-2 px-4 py-3.5 font-medium text-[#1F2937]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C81] text-xs font-bold text-white shadow-sm">
                      {initials(s.name)}
                    </span>
                    {s.name}
                  </td>
                  <td className="px-4 py-3.5 text-[#6B7280]">{s.email}</td>
                  <td className="px-4 py-3.5 text-[#6B7280]">{s.bookmarks?.length ?? 0}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => promoteToFaculty(s.id)} className="mr-2 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F8FAFC] transition-all">
                      Promote
                    </button>
                    <button onClick={() => removeUser(s.id)} className="rounded-lg p-2 text-red-650 hover:bg-red-50 hover:text-red-800 transition-colors">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
