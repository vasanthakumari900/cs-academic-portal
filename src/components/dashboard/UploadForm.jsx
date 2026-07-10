// src/components/dashboard/UploadForm.jsx
// Shared upload form for videos / notes / question papers. Faculty pages
// pass the storage path, Firestore service and any extra fields (e.g. year,
// regulation for question papers).
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { SEMESTERS, SUBJECTS, YEARS, VIDEO_TYPES } from "../../utils/constants";
import { uploadFile } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";

export default function UploadForm({
  service,
  storagePath,
  thumbnailPath,
  fileLabel = "File",
  fileAccept = "*",
  showThumbnail = false,
  showYear = false,
  showVideoType = false,
  extraFields, // array of { name, label, type }
  onUploaded,
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { profile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  async function onSubmit(data) {
    if (!file) {
      toast.error(`Please choose a ${fileLabel.toLowerCase()} to upload`);
      return;
    }
    try {
      const fileUrl = await uploadFile(storagePath, file, setProgress);
      let thumbnailUrl = null;
      if (thumbnail && thumbnailPath) {
        thumbnailUrl = await uploadFile(thumbnailPath, thumbnail);
      }
      await service.create({
        ...data,
        semester: Number(data.semester),
        year: data.year ? Number(data.year) : null,
        fileUrl,
        ...(thumbnailUrl && { thumbnailUrl }),
        facultyName: profile?.name || "Faculty",
        facultyId: profile?.uid,
      });
      toast.success("Uploaded successfully");
      reset();
      setFile(null);
      setThumbnail(null);
      setProgress(0);
      onUploaded?.();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
  }

  return (
    <GlassCard hover={false} className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input-field"
            placeholder="e.g. Binary Search Trees — Full Lecture"
          />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-field"
            placeholder="Short description shown to students"
          />
        </div>

        {showVideoType && (
          <div>
            <label className="mb-1 block text-sm font-medium">Video Type</label>
            <select
              {...register("videoType", { required: true })}
              className="input-field"
            >
              {VIDEO_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        )}

        {showYear && (
          <div>
            <label className="mb-1 block text-sm font-medium">Year</label>
            <select
              {...register("year", { required: true })}
              className="input-field"
            >
              {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Semester</label>
            <select
              {...register("semester", { required: true })}
              className="input-field"
            >
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Subject</label>
            <select
              {...register("subject", { required: true })}
              className="input-field"
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {extraFields?.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-sm font-medium">{f.label}</label>
            <input
              type={f.type || "text"}
              {...register(f.name, { required: f.required })}
              className="input-field"
            />
          </div>
        ))}

        {showThumbnail && (
          <div>
            <label className="mb-1 block text-sm font-medium">Thumbnail (optional)</label>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-6 text-center transition-all hover:border-primary/50 hover:bg-white/80 ">
              <FiUploadCloud size={22} className="text-accent" />
              <span className="text-sm text-white/50">
                {thumbnail ? thumbnail.name : "Click to choose a thumbnail image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">{fileLabel}</label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-8 text-center transition-all hover:border-primary/50 hover:bg-white/80 ">              <FiUploadCloud size={26} className="text-cyan-400" />
            <span className="text-sm text-white/50">
              {file ? file.name : `Click to choose a ${fileLabel.toLowerCase()}`}
            </span>
            <input
              type="file"
              accept={fileAccept}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {progress > 0 && progress < 100 && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 ">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Uploading…" : "Upload"}
        </Button>
      </form>
    </GlassCard>
  );
}
