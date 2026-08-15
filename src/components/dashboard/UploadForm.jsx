// src/components/dashboard/UploadForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { SEMESTERS, SUBJECTS, YEARS, VIDEO_TYPES } from "../../utils/constants";
import { uploadFile } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";

export default function UploadForm({
  service,
  storagePath,
  thumbnailPath,
  fileLabel = "File",
  fileAccept = "*",
  showThumbnail = false,
  showYear = false,
  showVideoType = false,
  extraFields,
  onUploaded,
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { profile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  async function onSubmit(data) {
    if (!file) {
      toast.error(`Please choose a ${fileLabel.toLowerCase()} to upload`);
      return;
    }
    setUploadCompleted(false);
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

      setUploadCompleted(true);
      toast.success("✅ Upload Completed!");

      setTimeout(() => {
        reset();
        setFile(null);
        setThumbnail(null);
        setProgress(0);
        setUploadCompleted(false);
        onUploaded?.();
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Upload failed");
      setProgress(0);
    }
  }

  return (
    <div className="max-w-2xl bg-white dark:bg-slate-900 border border-[#99F6E4] dark:border-slate-800 rounded-xl p-6 shadow-sm text-left">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input-premium"
            placeholder="e.g. Binary Search Trees — Full Lecture"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-premium"
            placeholder="Short description shown to students"
          />
        </div>

        {showVideoType && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Video Type</label>
            <select
              {...register("videoType", { required: true })}
              className="input-premium bg-white"
            >
              {VIDEO_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        )}

        {showYear && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Year</label>
            <select
              {...register("year", { required: true })}
              className="input-premium bg-white"
            >
              {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Semester</label>
            <select
              {...register("semester", { required: true })}
              className="input-premium bg-white"
            >
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Subject</label>
            <select
              {...register("subject", { required: true })}
              className="input-premium bg-white"
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {extraFields?.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">{f.label}</label>
            <input
              type={f.type || "text"}
              {...register(f.name, { required: f.required })}
              className="input-premium"
            />
          </div>
        ))}

        {showThumbnail && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">Thumbnail (optional)</label>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#99F6E4] bg-[#F0FDFA] px-4 py-6 text-center transition-all hover:border-[#D97706]/50 hover:bg-[#CCFBF1]/30">
              <FiUploadCloud size={22} className="text-[#0D9488]" />
              <span className="text-sm text-[#64748B]">
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
          <label className="mb-1 block text-sm font-semibold text-[#134E4A]/70 dark:text-teal-400">{fileLabel}</label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#99F6E4] bg-[#F0FDFA] px-4 py-8 text-center transition-all hover:border-[#D97706]/50 hover:bg-[#CCFBF1]/30">
            <FiUploadCloud size={26} className="text-[#0D9488]" />
            <span className="text-sm text-[#64748B]">
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8F1F4]">
            <div className="h-full bg-[#0D9488] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || uploadCompleted}
          className={`w-full rounded-xl py-3.5 text-sm font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer ${
            uploadCompleted
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30 scale-[1.01]"
              : "bg-[#0D9488] hover:bg-[#0B7A70] disabled:opacity-80"
          }`}
        >
          {uploadCompleted ? (
            <>
              <FiCheckCircle size={20} className="text-white animate-bounce" />
              <span>✅ Upload Completed!</span>
            </>
          ) : isSubmitting ? (
            <>
              <FiUploadCloud size={18} className="animate-pulse" />
              <span>{progress >= 100 ? "Finalizing upload..." : `Uploading (${progress}%)...`}</span>
            </>
          ) : (
            "Upload Content"
          )}
        </button>
      </form>
    </div>
  );
}
