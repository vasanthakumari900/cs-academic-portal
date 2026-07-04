// src/pages/admin/ManagePlacements.jsx
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { placementService } from "../../services/placementService";
import { uploadFile } from "../../services/storageService";
import { STORAGE_PATHS } from "../../utils/constants";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="lg:col-span-1">
        <h3 className="mb-4 flex items-center gap-2 font-display font-semibold"><FiPlus /> New Drive</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("companyName", { required: true })} placeholder="Company name" className="input-field" />
          <input {...register("role", { required: true })} placeholder="Role" className="input-field" />
          <input {...register("package", { required: true })} placeholder="Package (LPA)" type="number" step="0.1" className="input-field" />
          <input {...register("eligibility", { required: true })} placeholder="Eligibility (e.g. CGPA 7+)" className="input-field" />
          <input {...register("deadline", { required: true })} type="date" className="input-field" />
          <input {...register("applyLink", { required: true })} placeholder="Apply link (URL)" className="input-field" />
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
            className="w-full text-xs" />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding…" : "Add Drive"}
          </Button>
        </form>
      </GlassCard>

      <div className="space-y-3 lg:col-span-2">
        <h3 className="font-display font-semibold">Active Drives</h3>
        {!loading && items.length === 0 && <EmptyState title="No drives yet" description="Add your first placement drive using the form." />}
        {items.map((p) => (
          <GlassCard key={p.id} hover={false} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{p.companyName} — {p.role}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">₹{p.package} LPA · Deadline {p.deadline}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10">
              <FiTrash2 size={16} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
