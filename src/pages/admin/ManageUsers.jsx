// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FiTrash2 } from "react-icons/fi";
import { db } from "../../firebase/config";
import { COLLECTIONS, ROLES } from "../../utils/constants";
import { initials } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function changeRole(id, role) {
    await updateDoc(doc(db, COLLECTIONS.USERS, id), { role });
    toast.success("Role updated");
    loadUsers();
  }

  async function removeUser(id) {
    if (!confirm("Remove this user's profile record? This does not delete their login.")) return;
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    toast.success("User removed");
    loadUsers();
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-left bg-[#F8FAFC]">
      <h2 className="mb-6 font-sans text-2xl font-bold text-[#1F2937]">Manage Users</h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs uppercase text-[#6B7280] font-semibold">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.map((u) => (
                <tr key={u.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="flex items-center gap-2 px-4 py-3.5 font-medium text-[#1F2937]">
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
                      className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-1.5 text-xs text-[#1F2937] outline-none focus:border-[#0F4C81] transition-all"
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => removeUser(u.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors">
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
