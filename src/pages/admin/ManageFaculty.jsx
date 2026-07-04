// src/pages/admin/ManageFaculty.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { FiTrash2, FiUserCheck } from "react-icons/fi";
import { db } from "../../firebase/config";
import { COLLECTIONS, ROLES } from "../../utils/constants";
import { initials } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import StatCard from "../../components/ui/StatCard";

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFaculty() {
    setLoading(true);
    const q = query(collection(db, COLLECTIONS.USERS), where("role", "==", ROLES.FACULTY));
    const snap = await getDocs(q);
    setFaculty(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadFaculty(); }, []);

  async function demoteToStudent(id) {
    await updateDoc(doc(db, COLLECTIONS.USERS, id), { role: ROLES.STUDENT });
    toast.success("Faculty demoted to student");
    loadFaculty();
  }

  async function removeUser(id) {
    if (!confirm("Remove this faculty profile?")) return;
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    toast.success("Faculty removed");
    loadFaculty();
  }

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-bold">Manage Faculty</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">View and manage all faculty accounts.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiUserCheck} label="Total Faculty" value={faculty.length} accent="primary" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : faculty.length === 0 ? (
        <EmptyState title="No faculty registered" description="Faculty accounts appear here when users register as faculty." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f) => (
            <div key={f.id} className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-card dark:border-slate-800/80 dark:bg-dark-card/95">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-sm font-bold text-white">
                  {initials(f.name)}
                </span>
                <div>
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-sm text-slate-500">{f.email}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => demoteToStudent(f.id)} className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-white/5">
                  Demote to Student
                </button>
                <button onClick={() => removeUser(f.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
