// src/components/common/LiveDateTime.jsx
import { useState, useEffect } from "react";

export default function LiveDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar Date Formats in English
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const shortMonth = monthName.substring(0, 3).toUpperCase();
  const dateNum = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  // Clock Angles for Analog Clock
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6; // 360deg / 60s
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = ((hours % 12) + minutes / 60) * 30; // 360deg / 12h

  // Digital Time Format (12-hour AM/PM)
  const displayHours = String(hours % 12 || 12).padStart(2, "0");
  const displayMinutes = String(minutes).padStart(2, "0");
  const displaySeconds = String(seconds).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  return (
    <div className="w-full transition-all duration-300">
      {/* Outer Daily Sheet Card */}
      <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#7F011F] shadow-lg p-3 sm:p-4 text-center transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          
          {/* Left Column: Daily Calendar Sheet */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#FFF5E6]/70 border border-[#E6DAB8] h-full min-h-[175px]">
            {/* Month - Year */}
            <span className="text-xs sm:text-sm font-extrabold text-[#6B4F45] uppercase tracking-wider mb-0.5">
              {shortMonth} - {year}
            </span>

            {/* Giant Date Number */}
            <span className="text-5xl sm:text-6xl font-black text-[#7F011F] leading-none my-1 tracking-tight">
              {dateNum}
            </span>

            {/* Day of Week */}
            <span className="text-base sm:text-lg font-bold text-[#7F011F] mt-0.5">
              {dayName}
            </span>

            {/* Full Date */}
            <span className="text-xs font-semibold text-[#6B4F45] mt-1">
              {dateNum} {monthName} {year}
            </span>
          </div>

          {/* Right Column: Working Analog Clock & Digital Clock */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#FFF5E6]/70 border border-[#E6DAB8] h-full min-h-[175px]">
            
            {/* Real-time Working Analog Clock */}
            <div className="relative w-28 h-28 sm:w-30 sm:h-30 rounded-full border-4 border-[#7F011F] bg-white shadow-inner flex items-center justify-center mb-2 shrink-0">
              
              {/* Clock Numbers 1-12 */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                const angle = (num * 30 - 90) * (Math.PI / 180);
                const radius = 38; // px offset from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <span
                    key={num}
                    className="absolute text-[9px] font-black text-[#7F011F]/90 select-none"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {num}
                  </span>
                );
              })}

              {/* Center Pin */}
              <div className="absolute w-2.5 h-2.5 bg-[#7F011F] rounded-full z-30 shadow-xs" />

              {/* Hour Hand */}
              <div
                className="absolute w-1 bg-[#7F011F] rounded-full origin-bottom z-10 transition-transform duration-300"
                style={{
                  height: "22px",
                  bottom: "50%",
                  transform: `rotate(${hourDeg}deg)`,
                }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-0.75 bg-[#6B4F45] rounded-full origin-bottom z-20 transition-transform duration-300"
                style={{
                  height: "32px",
                  bottom: "50%",
                  transform: `rotate(${minuteDeg}deg)`,
                }}
              />

              {/* Second Hand */}
              <div
                className="absolute w-0.5 bg-[#C50337] rounded-full origin-bottom z-25 transition-transform duration-75"
                style={{
                  height: "36px",
                  bottom: "50%",
                  transform: `rotate(${secondDeg}deg)`,
                }}
              />
            </div>

            {/* Digital Clock Display */}
            <div className="text-center">
              <div className="font-mono text-base sm:text-lg font-black text-[#7F011F] tracking-wider leading-none">
                <span>{displayHours}:{displayMinutes}:</span>
                <span className="text-[#C50337]">{displaySeconds}</span>
                <span className="text-xs font-sans font-bold text-[#7F011F] ml-1">{ampm}</span>
              </div>
              <span className="text-[10px] font-semibold text-[#6B4F45] block mt-1">
                Indian Standard Time (IST)
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
