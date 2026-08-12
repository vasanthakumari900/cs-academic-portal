import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMusic,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiChevronUp,
  FiChevronDown,
  FiClock,
  FiCloudRain,
  FiHeadphones,
  FiCoffee,
  FiZap,
} from "react-icons/fi";

const SOUNDTRACKS = [
  { id: "lofi", name: "Cyberpunk Lofi", icon: FiHeadphones, type: "synth-lofi" },
  { id: "rain", name: "Cyber Rain", icon: FiCloudRain, type: "synth-rain" },
  { id: "focus", name: "Deep Focus Drone", icon: FiZap, type: "synth-focus" },
  { id: "cafe", name: "Ambient Cafe", icon: FiCoffee, type: "synth-cafe" },
];

const TIMER_PRESETS = [
  { label: "15m", mins: 15 },
  { label: "25m", mins: 25 },
  { label: "45m", mins: 45 },
  { label: "60m", mins: 60 },
];

export default function FocusStudio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState(SOUNDTRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Pomodoro State
  const [timerMode, setTimerMode] = useState("work");
  const [workDuration, setWorkDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Listen for global custom event to activate timer from student dashboard
  useEffect(() => {
    const handleGlobalActivate = (e) => {
      const mins = e?.detail?.duration || 25;
      setWorkDuration(mins);
      setTimerMode("work");
      setTimeLeft(mins * 60);
      setIsTimerRunning(true);
      setIsOpen(true);
      if (!isPlaying) {
        startAudioSynth();
        setIsPlaying(true);
      }
      toast.success(`⚡ ${mins}-Minute Focus Session Activated! Keep studying!`);
    };

    window.addEventListener("activate-focus-timer", handleGlobalActivate);
    return () => window.removeEventListener("activate-focus-timer", handleGlobalActivate);
  }, [isPlaying]);

  // ── Web Audio Synth Generator ──
  const startAudioSynth = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    stopAudioSynth();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    synthNodesRef.current = [masterGain];

    if (activeSound.id === "rain") {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      synthNodesRef.current.push(whiteNoise, filter);
    } else if (activeSound.id === "lofi" || activeSound.id === "focus") {
      const freqs = activeSound.id === "lofi" ? [130.81, 196.00, 261.63] : [110.00, 164.81, 220.00];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        oscGain.gain.setValueAtTime(0.08, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 3;
        lfo.connect(osc.frequency);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        synthNodesRef.current.push(osc, oscGain, lfo, lfoGain);
      });
    } else {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.value = 146.83;
      osc2.frequency.value = 220.0;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      synthNodesRef.current.push(osc1, osc2, filter);
    }
  };

  const stopAudioSynth = () => {
    synthNodesRef.current.forEach((node) => {
      if (node.stop) {
        try { node.stop(); } catch (e) { /* ignore */ }
      }
      if (node.disconnect) {
        try { node.disconnect(); } catch (e) { /* ignore */ }
      }
    });
    synthNodesRef.current = [];
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      startAudioSynth();
      setIsPlaying(true);
    } else {
      stopAudioSynth();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudioSynth();
    }
    return () => {
      stopAudioSynth();
    };
  }, [activeSound]);

  useEffect(() => {
    if (synthNodesRef.current.length > 0 && synthNodesRef.current[0].gain) {
      synthNodesRef.current[0].gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current ? audioCtxRef.current.currentTime : 0
      );
    }
  }, [volume, isMuted]);

  // ── Canvas Audio Equalizer ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 12;
      const barWidth = 3;
      const gap = 3;

      for (let i = 0; i < barCount; i++) {
        const height = isPlaying ? Math.sin(phase + i * 0.4) * 10 + 12 : 4;
        const x = i * (barWidth + gap) + 4;
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, "#F4C266");
        gradient.addColorStop(1, "#C50337");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      phase += 0.15;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // ── Pomodoro Timer Countdown ──
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerMode === "work") {
        toast.success("🎉 Focus session completed! Time for a 5-minute break.");
        setTimerMode("break");
        setTimeLeft(5 * 60);
      } else {
        toast.success("🔔 Break over! Ready for your next study sprint?");
        setTimerMode("work");
        setTimeLeft(workDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode, workDuration]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerTotalSeconds = timerMode === "work" ? workDuration * 60 : 5 * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((timerTotalSeconds - timeLeft) / timerTotalSeconds) * 100)
  );

  const handleSelectPreset = (mins) => {
    setWorkDuration(mins);
    setTimerMode("work");
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      {/* ── COMPACT DRAWER CARD (Fits Viewport Height) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-3 w-[300px] sm:w-[330px] max-h-[78vh] overflow-y-auto rounded-3xl bg-[#1D0A14]/95 border border-[#F4C266]/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl text-white space-y-3.5"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] text-[#F4C266] shadow-md border border-[#F4C266]/30">
                  <FiMusic size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider font-heading text-white">Student Focus Studio</h4>
                  <p className="text-[10px] text-[#D9C2CA]">Lofi Soundboard &amp; Timer</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#D9C2CA] hover:bg-white/10 hover:text-white transition-all"
              >
                <FiChevronDown size={18} />
              </button>
            </div>

            {/* Soundscape Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-[#F4C266] uppercase tracking-wider font-heading">
                Ambient Soundscape
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {SOUNDTRACKS.map((track) => {
                  const Icon = track.icon;
                  const isActive = activeSound.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setActiveSound(track)}
                      className={`flex items-center gap-2 rounded-xl p-2 text-left text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white shadow-md border border-[#F4C266]"
                          : "bg-white/5 text-[#D9C2CA] hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-[#F4C266]" : ""} />
                      <span className="truncate">{track.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-2.5 border border-white/10">
              <button
                onClick={handleTogglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#F4C266] to-[#D97706] text-[#2A0D13] font-black shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} className="ml-0.5" />}
              </button>

              <canvas ref={canvasRef} width="80" height="24" className="mx-1" />

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-[#D9C2CA] hover:text-white transition-colors p-1"
                >
                  {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-14 accent-[#F4C266] cursor-pointer"
                />
              </div>
            </div>

            {/* Student Pomodoro Study Timer Box */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-[#F4C266]">
                  <FiClock size={13} />
                  <span className="uppercase tracking-wider font-extrabold text-[10px]">
                    {timerMode === "work" ? `${workDuration}-Min Sprint` : "5-Min Break"}
                  </span>
                </div>

                {/* Duration Presets */}
                <div className="flex gap-1">
                  {TIMER_PRESETS.map((preset) => (
                    <button
                      key={preset.mins}
                      onClick={() => handleSelectPreset(preset.mins)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-all ${
                        workDuration === preset.mins && timerMode === "work"
                          ? "bg-[#C50337] text-white shadow-sm border border-[#F4C266]"
                          : "bg-white/10 text-[#D9C2CA] hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Display & Controls */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="text-3xl font-black font-mono text-white tracking-wider">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsTimerRunning(!isTimerRunning);
                      if (!isTimerRunning) {
                        toast.success(`⚡ Focus Timer Activated!`);
                        if (!isPlaying) handleTogglePlay();
                      }
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 ${
                      isTimerRunning
                        ? "bg-[#D97706] text-white"
                        : "bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white border border-[#F4C266]"
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <FiPause size={13} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <FiPlay size={13} />
                        <span>Activate</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeLeft(timerTotalSeconds);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-[#D9C2CA] hover:text-white transition-all active:scale-95"
                    title="Reset Timer"
                  >
                    <FiRotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F4C266] to-[#C50337] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MINIMIZED COMPACT FLOATING ACTION PILL ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#3A101A] via-[#22101A] to-[#14070D] px-3.5 py-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)] border border-[#F4C266]/40 backdrop-blur-xl cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#C50337] to-[#7F011F] text-[#F4C266] shadow-sm">
          <FiMusic size={14} className={isPlaying || isTimerRunning ? "animate-spin" : ""} />
        </div>

        <div className="text-left font-heading">
          <p className="text-[11px] font-extrabold text-white leading-none flex items-center gap-1">
            <span>Focus Studio</span>
            {isTimerRunning && (
              <span className="rounded-full bg-[#C50337] px-1.5 py-0.2 text-[8px] font-mono font-bold text-white animate-pulse">
                {formatTime(timeLeft)}
              </span>
            )}
          </p>
          <p className="text-[9px] font-bold text-[#F4C266] leading-tight mt-0.5">
            {isTimerRunning ? "Timer Running" : isPlaying ? activeSound.name : "Click to Activate Timer"}
          </p>
        </div>

        <div className="ml-1 text-[#D9C2CA] group-hover:text-white transition-colors">
          {isOpen ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
        </div>
      </motion.button>
    </div>
  );
}
