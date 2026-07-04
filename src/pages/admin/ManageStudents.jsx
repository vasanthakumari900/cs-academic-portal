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
    <div>
      <h2 className="mb-2 font-display text-2xl font-bold">Manage Students</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">View and manage all student accounts.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiUsers} label="Total Students" value={students.length} accent="accent" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState title="No students registered" description="Student accounts appear here when users register." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Bookmarks</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((s) => (
                <tr key={s.id} className="bg-white dark:bg-dark">
                  <td className="flex items-center gap-2 px-4 py-3 font-medium">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-accent text-xs font-bold text-white">
                      {initials(s.name)}
                    </span>
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{s.email}</td>
                  <td className="px-4 py-3 text-slate-500">{s.bookmarks?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => promoteToFaculty(s.id)} className="mr-2 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700">
                      Promote
                    </button>
                    <button onClick={() => removeUser(s.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10">
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
