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
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Manage Users</h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="bg-white dark:bg-dark">
                  <td className="flex items-center gap-2 px-4 py-3 font-medium">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-xs font-bold text-white">
                      {initials(u.name)}
                    </span>
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-bg px-2 py-1 text-xs outline-none dark:border-slate-700 dark:bg-dark"
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeUser(u.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10">
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
