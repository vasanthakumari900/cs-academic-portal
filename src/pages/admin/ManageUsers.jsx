// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FiTrash2, FiCheckSquare, FiSquare } from "react-icons/fi";
import { db } from "../../firebase/config";
import { COLLECTIONS, ROLES } from "../../utils/constants";
import { initials } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, targetId: null, isBulk: false });

  async function loadUsers() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.USERS));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn("Failed to load users:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function changeRole(id, role) {
    await updateDoc(doc(db, COLLECTIONS.USERS, id), { role });
    toast.success("Role updated");
    loadUsers();
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
      toast.success(`Removed ${selectedIds.length} user records`);
      setSelectedIds([]);
    } else if (targetId) {
      await deleteDoc(doc(db, COLLECTIONS.USERS, targetId));
      toast.success("User removed");
    }
    loadUsers();
  }

  function toggleSelectAll() {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
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
        title={confirmState.isBulk ? `Delete ${selectedIds.length} Users?` : "Delete User Record?"}
        message="This action will remove the user profile entry from Firestore. This cannot be undone."
        confirmLabel="Delete User(s)"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, targetId: null, isBulk: false })}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">Manage Users</h2>
          <p className="text-xs text-slate-500 mt-1">Review student & faculty roles or delete records.</p>
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

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#F0E2E6] dark:border-white/10 bg-white dark:bg-[#22101A] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs uppercase text-[#6B7280] font-semibold">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <button onClick={toggleSelectAll} aria-label="Select all users" className="text-slate-500 hover:text-slate-700">
                    {selectedIds.length === users.length ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                  </button>
                </th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.map((u) => (
                <tr key={u.id} className={`transition-colors ${selectedIds.includes(u.id) ? "bg-amber-50/50" : "bg-white hover:bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleSelectOne(u.id)} aria-label={`Select ${u.name}`} className="text-slate-500 hover:text-slate-700">
                      {selectedIds.includes(u.id) ? <FiCheckSquare size={16} className="text-[#0F4C81]" /> : <FiSquare size={16} />}
                    </button>
                  </td>
                  <td className="flex items-center gap-2 px-4 py-3.5 font-medium text-[#0F4C81]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C81] text-xs font-bold text-white shadow-sm">
                      {initials(u.name)}
                    </span>
                    {u.name}
                  </td>
                  <td className="px-4 py-3.5 text-[#6B7280]">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-xs text-[#0F4C81] outline-none focus:border-[#0F4C81] transition-all"
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handlePromptDelete(u.id)}
                      aria-label={`Delete ${u.name}`}
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
