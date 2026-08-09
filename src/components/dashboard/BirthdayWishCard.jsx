// src/components/dashboard/BirthdayWishCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiGift, FiCalendar, FiHeart, FiCheckCircle } from "react-icons/fi";
import { getBirthdayStatus } from "../../utils/birthdayUtils";
import { STUDENTS } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function BirthdayWishCard({ user }) {
  // Persist "thanked" per student per year so it survives page visits/refreshes
  const [thanked, setThanked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cs_portal_birthday_thanked") || "{}");
      return !!user?.rollNumber && saved[user.rollNumber] === new Date().getFullYear();
    } catch {
      return false;
    }
  });

  // Universal DOB lookup for 100% of all students (1st, 2nd, and 3rd Year)
  const dobStr = user?.dob || (user?.rollNumber && STUDENTS[user.rollNumber] ? STUDENTS[user.rollNumber].dob : null);

  if (!user || !dobStr) return null;

  const status = getBirthdayStatus(dobStr);

  if (!status.isUpcoming) return null;

  const { isToday, daysLeft, formattedDobDate, nextAge } = status;
  const firstName = user.name ? user.name.split(" ")[0] : "Student";
  const isOneDayBefore = daysLeft === 1;

  const handleThankClick = () => {
    setThanked(true);
    // Remember this student thanked for the current year (keyed by roll number)
    if (!user?.rollNumber) return;
    try {
      const saved = JSON.parse(localStorage.getItem("cs_portal_birthday_thanked") || "{}");
      saved[user.rollNumber] = new Date().getFullYear();
      localStorage.setItem("cs_portal_birthday_thanked", JSON.stringify(saved));
    } catch (e) {
      console.warn("Birthday thanks persistence notice:", e);
    }
    toast.success(`🎉 Thank you, ${firstName}! The CS Department wishes you a happy birthday! 🎁`, {
      duration: 5000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mt-4 rounded-2xl bg-gradient-to-r from-[#F0FDFA] via-[#CCFBF1]/30 to-[#F0FDFA] dark:bg-teal-950/80 border-2 border-[#D97706]/70 p-4 sm:p-5 shadow-neu-raised text-left space-y-3"
    >
      {/* Left-Side Notification Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#5EEAD4]/40 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D97706] text-white shadow-sm shrink-0">
            <FiGift size={20} className="animate-bounce" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-mono font-extrabold text-[#134E4A] dark:text-[#CCFBF1] tracking-tight">
              {isToday
                ? "🎉 Department Birthday Wishes"
                : isOneDayBefore
                ? "🎂 1 Day Before Birthday - Advance Wish"
                : `⏳ Birthday Countdown (${daysLeft} Days Remaining)`}
            </h3>
            <p className="text-[10px] font-mono font-bold text-[#D97706]">
              Department of Computer Science (DDGDVC)
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border shadow-xs ${
            isToday
              ? "bg-[#D97706] text-white animate-pulse"
              : isOneDayBefore
              ? "bg-amber-600 text-white"
              : "bg-amber-100 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-200 border-amber-300"
          }`}
        >
          {isToday
            ? "🎂 TODAY!"
            : isOneDayBefore
            ? "🌟 1 DAY REMAINING"
            : `⏳ ${daysLeft} DAYS REMAINING`}
        </span>
      </div>

      {/* Birthday Structured Content */}
      <div className="bg-white dark:bg-teal-950 p-3.5 sm:p-4 rounded-xl border border-[#5EEAD4]/50 dark:border-teal-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] uppercase font-mono font-bold text-[#64748B] dark:text-[#5EEAD4]/80 flex items-center gap-1">
            <FiCalendar size={12} className="text-[#D97706]" /> Date of Birth
          </span>
          <span className="font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] bg-[#CCFBF1]/40 dark:bg-teal-900/40 px-2.5 py-0.5 rounded-md border border-[#5EEAD4]/50 text-xs">
            {formattedDobDate}
          </span>
        </div>

        {/* Structured Message */}
        <div className="pt-2 border-t border-[#5EEAD4]/20 space-y-1">
          <h4 className="text-xs sm:text-sm font-mono font-bold text-[#134E4A] dark:text-[#CCFBF1] leading-snug">
            {isToday ? (
              <>🎉 Happy Birthday, <span className="text-[#D97706]">{user.name}</span>! 🎂</>
            ) : isOneDayBefore ? (
              <>🎂 Advance Happy Birthday, <span className="text-[#D97706]">{user.name}</span>! 🎉</>
            ) : (
              <>⏳ Birthday Countdown for <span className="text-[#D97706]">{user.name}</span></>
            )}
          </h4>

          <p className="text-xs text-[#134E4A]/80 dark:text-[#CCFBF1]/80 font-medium leading-relaxed">
            {isToday ? (
              <>
                <strong>Happy Birthday from the Department of Computer Science!</strong> The department wishes you a wonderful birthday turning <strong>{nextAge}</strong> and blessings for a brilliant, successful year ahead! 🚀🎁
              </>
            ) : isOneDayBefore ? (
              <>
                <strong>Advance Happy Birthday from the Department of Computer Science!</strong> Only <strong>1 day remaining</strong> until your special day on <strong>{formattedDobDate}</strong>! Sending you departmental blessings for a fantastic year ahead! 🌟🎈
              </>
            ) : (
              <>
                There are <strong>{daysLeft} days remaining</strong> until your birthday on <strong>{formattedDobDate}</strong>! The Department of Computer Science sends you early wishes and warm blessings for your upcoming celebration! ✨🎁
              </>
            )}
          </p>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleThankClick}
          disabled={thanked}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold shadow-neu-raised transition-all active:scale-98 cursor-pointer ${
            thanked
              ? "bg-[#16A34A] text-white cursor-default"
              : "bg-[#0D9488] hover:bg-[#0F766E] text-white"
          }`}
        >
          {thanked ? (
            <>
              <FiCheckCircle size={14} />
              <span>Department Blessings Received! ✨</span>
            </>
          ) : (
            <>
              <FiHeart size={14} className="text-amber-300 fill-amber-300" />
              <span>
                {isToday
                  ? "Thank You CS Department! 🎉"
                  : isOneDayBefore
                  ? "Receive Advance Birthday Wish ✨"
                  : "Acknowledge Countdown ✨"}
              </span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
