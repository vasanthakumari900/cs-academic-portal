// src/pages/admin/ManagePlacements.jsx
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { placementService } from "../../services/placementService";
import { uploadFile } from "../../services/storageService";
import { STORAGE_PATHS } from "../../utils/constants";
import EmptyState from "../../components/ui/EmptyState";

export default function ManagePlacements() {
  const { items, loading, refetch } = useFirestoreList(placementService, { sortBy: "createdAt" });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [logo, setLogo] = useState(null);

  async function onSubmit(data) {
    try {
      let logoUrl = "";
      if (logo) logoUrl = await uploadFile(STORAGE_PATHS.LOGOS, logo);
      await placementService.create({ ...data, logoUrl });
      toast.success("Placement drive added");
      reset();
      setLogo(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to add drive");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this placement drive?")) return;
    await placementService.remove(id);
    toast.success("Deleted");
    refetch();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 max-w-6xl mx-auto py-8 px-4 text-left bg-[#F8FAFC]">
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm lg:col-span-1 h-fit">
        <h3 className="mb-4 flex items-center gap-2 font-sans font-bold text-[#0F4C81] border-b border-[#E5E7EB] pb-2"><FiPlus className="text-[#0F4C81]" /> New Drive</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("companyName", { required: true })} placeholder="Company name" className="input-premium" />
          <input {...register("role", { required: true })} placeholder="Role" className="input-premium" />
          <input {...register("package", { required: true })} placeholder="Package (LPA)" type="number" step="0.1" className="input-premium" />
          <input {...register("eligibility", { required: true })} placeholder="Eligibility (e.g. CGPA 7+)" className="input-premium" />
          <input {...register("deadline", { required: true })} type="date" className="input-premium" />
          <input {...register("applyLink", { required: true })} placeholder="Apply link (URL)" className="input-premium" />
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] mb-1">Company Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-[#6B7280] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0F4C81]/10 file:text-[#0F4C81] hover:file:bg-[#0F4C81]/20" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] py-2.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50">
            {isSubmitting ? "Adding…" : "Add Drive"}
          </button>
        </form>
      </div>

      <div className="space-y-3 lg:col-span-2">
        <h3 className="font-sans font-bold text-[#0F4C81] border-b border-[#E5E7EB] pb-2 text-left">Active Drives</h3>
        {!loading && items.length === 0 && <EmptyState title="No drives yet" description="Add your first placement drive using the form." />}
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:shadow-sm transition-all flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold text-[#0F4C81]">{p.companyName} — <span className="text-[#6B7280] font-normal">{p.role}</span></p>
              <p className="text-xs text-[#6B7280] mt-1">₹{p.package} LPA · Deadline {p.deadline}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-650 hover:bg-red-50 hover:text-red-800 transition-colors">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
