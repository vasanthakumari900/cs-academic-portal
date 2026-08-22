// src/pages/admin/ManageStudents.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers, FiCheckSquare, FiSquare } from "react-icons/fi";
import { db } from "../../firebase/config";
import { COLLECTIONS, ROLES } from "../../utils/constants";
import { initials } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import StatCard from "../../components/ui/StatCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, targetId: null, isBulk: false });

  async function loadStudents() {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where("role", "==", ROLES.STUDENT));
      const snap = await getDocs(q);
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn("Failed to load students:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  async function promoteToFaculty(id) {
    await updateDoc(doc(db, COLLECTIONS.USERS, id), { role: ROLES.FACULTY });
    toast.success("Student promoted to faculty");
    loadStudents();
  }

  function handlePromptDelete(id) {
    setConfirmState({ isOpen: true, targetId: id, isBulk: false });
  }

  function handlePromptBulkDelete() {
    if (selectedIds.length === 0) return;
    setConfirmState({ isOpen: true, targetId: null, isBulk: true });
  }

  async function handleConfirmDelete() {
    const { targetId, isBulk } = confirmState;
    setConfirmState({ isOpen: false, targetId: null, isBulk: false });

    if (isBulk) {
      for (const id of selectedIds) {
        try {
          await deleteDoc(doc(db, COLLECTIONS.USERS, id));
        } catch (e) {
          console.error(e);
        }
      }
      toast.success(`Removed ${selectedIds.length} student records`);
      setSelectedIds([]);
    } else if (targetId) {
      await deleteDoc(doc(db, COLLECTIONS.USERS, targetId));
      toast.success("Student removed");
    }
    loadStudents();
  }

  function toggleSelectAll() {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  }

  function toggleSelectOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-left bg-[#F8FAFC]">
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.isBulk ? `Delete ${selectedIds.length} Student Records?` : "Delete Student Record?"}
        message="This action will remove the student profile from Firestore. This cannot be undone."
        confirmLabel="Delete Record(s)"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, targetId: null, isBulk: false })}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Manage Students</h2>
          <p className="text-sm text-[#6B7280]">View and manage all student accounts.</p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handlePromptBulkDelete}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm"
          >
            <FiTrash2 size={14} /> Bulk Delete ({selectedIds.length})
          </button>
        )}
      </div>

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
        <div className="overflow-x-auto rounded-xl border border-[#F0E2E6] dark:border-white/10 bg-white dark:bg-[#22101A] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs uppercase text-[#6B7280] font-semibold">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <button onClick={toggleSelectAll} aria-label="Select all students" className="text-slate-500 hover:text-slate-700">
                    {selectedIds.length === students.length ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                  </button>
                </th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Bookmarks</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {students.map((s) => (
                <tr key={s.id} className={`transition-colors ${selectedIds.includes(s.id) ? "bg-amber-50/50" : "bg-white hover:bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleSelectOne(s.id)} aria-label={`Select ${s.name}`} className="text-slate-500 hover:text-slate-700">
                      {selectedIds.includes(s.id) ? <FiCheckSquare size={16} className="text-[#0F4C81]" /> : <FiSquare size={16} />}
                    </button>
                  </td>
                  <td className="flex items-center gap-2 px-4 py-3.5 font-medium text-[#0F4C81]">
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
                    <button
                      onClick={() => handlePromptDelete(s.id)}
                      aria-label={`Delete ${s.name}`}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
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
