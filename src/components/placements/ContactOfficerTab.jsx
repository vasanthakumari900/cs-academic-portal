// src/components/placements/ContactOfficerTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiClock,
  FiMapPin,
  FiUserCheck,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactOfficerTab() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Placement Query",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Query sent to Placement Officer!");
      setForm({ name: "", email: "", phone: "", subject: "Placement Query", message: "" });
    }, 1200);
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FiPhone className="text-[#0F4C81] dark:text-sky-400" /> Contact Training & Placement Officer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Have questions regarding drive registration, eligibility verification, or interview dates? Get in touch with our cell.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Officer Info Card (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#021C4F] to-[#0F4C81] text-white font-extrabold text-2xl shadow-md">
              R
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Prof. Dr. K. Ramanathan
              </h3>
              <p className="text-xs text-slate-500 font-medium">Head of Training & Placement</p>
              <p className="text-[11px] text-[#0F4C81] dark:text-sky-400 font-bold mt-0.5">
                Department of Computer Science
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-[#C50337] shrink-0" size={16} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Email</span>
                <strong className="text-slate-800 dark:text-slate-100">placement.cs@ddgdvc.edu.in</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="text-emerald-600 shrink-0" size={16} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Helpline</span>
                <strong className="text-slate-800 dark:text-slate-100">+91 44 2475 1234 / +91 98765 43210</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiClock className="text-amber-500 shrink-0" size={16} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Office Hours</span>
                <strong className="text-slate-800 dark:text-slate-100">Mon – Fri (10:00 AM – 04:30 PM IST)</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiMapPin className="text-[#0F4C81] shrink-0" size={16} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Office Location</span>
                <strong className="text-slate-800 dark:text-slate-100">
                  Placement Cell, Block B (Room 204), DDGDVC Campus
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b pb-2">
            Send a Direct Query
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student@ddgdvc.edu.in"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Query Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Placement Query">Placement Drive Inquiry</option>
                  <option value="Eligibility Clarification">Eligibility / CGPA Verification</option>
                  <option value="Offer Letter Issue">Offer Letter Issue</option>
                  <option value="Training Session">Placement Training Bootcamp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Query Details / Message *
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your query in detail..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <FiSend size={14} /> {submitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
