// src/components/common/LiveWeatherWidget.jsx
// Live Weather Widget for Chennai, Tamil Nadu
// Built with React, Tailwind CSS, and Open-Meteo Free Public Weather API

import { useState, useEffect, useCallback } from "react";
import { 
  FiMapPin, FiRefreshCw, FiDroplet, FiWind, 
  FiThermometer, FiSun, FiCloud, FiCloudRain, 
  FiCloudLightning, FiCloudDrizzle, FiAlertCircle 
} from "react-icons/fi";

const CHENNAI_LAT = 13.0827;
const CHENNAI_LON = 80.2707;
const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 Minutes

// Helper function to interpret WMO Weather Codes from Open-Meteo API
function getWeatherInfo(code) {
  if (code === 0) {
    return { label: "Sunny / Clear Sky", icon: FiSun, iconColor: "text-amber-500", bgAccent: "from-amber-500/10 to-orange-500/10" };
  }
  if (code >= 1 && code <= 3) {
    return { label: "Partly Cloudy", icon: FiCloud, iconColor: "text-sky-500", bgAccent: "from-sky-500/10 to-blue-500/10" };
  }
  if (code === 45 || code === 48) {
    return { label: "Foggy / Hazy", icon: FiCloud, iconColor: "text-slate-400", bgAccent: "from-slate-400/10 to-gray-400/10" };
  }
  if (code >= 51 && code <= 57) {
    return { label: "Light Drizzle", icon: FiCloudDrizzle, iconColor: "text-cyan-600", bgAccent: "from-cyan-500/10 to-teal-500/10" };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: "Rain Showers", icon: FiCloudRain, iconColor: "text-blue-600", bgAccent: "from-blue-600/10 to-indigo-600/10" };
  }
  if (code >= 95) {
    return { label: "Thunderstorm", icon: FiCloudLightning, iconColor: "text-purple-600", bgAccent: "from-purple-600/10 to-rose-600/10" };
  }
  return { label: "Partly Clear", icon: FiSun, iconColor: "text-amber-500", bgAccent: "from-amber-500/10 to-orange-500/10" };
}

export default function LiveWeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHENNAI_LAT}&longitude=${CHENNAI_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather service responded with status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;

      setWeather({
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        code: current.weather_code,
      });

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } catch (err) {
      console.error("Failed to fetch live weather data:", err);
      setError("Unable to load live weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();

    // Auto-refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const weatherDetails = weather ? getWeatherInfo(weather.code) : null;
  const WeatherIcon = weatherDetails ? weatherDetails.icon : FiSun;

  return (
    <div className="w-full rounded-2xl border border-[#E6DAB8] bg-white/90 backdrop-blur-md shadow-md p-4 sm:p-5 text-left transition-all duration-300">
      {/* Top Bar: Location & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5EBD0]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7F011F]/10 text-[#7F011F] shrink-0">
            <FiMapPin size={15} />
          </span>
          <div className="min-w-0 leading-tight">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#7F011F] truncate">
              Chennai, Tamil Nadu
            </h4>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#6B4F45]">
              Live Campus Weather
            </p>
          </div>
        </div>

        <button
          onClick={fetchWeather}
          disabled={loading}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#7F011F] hover:text-[#660119] bg-[#F5EBD0]/50 hover:bg-[#F5EBD0] px-2.5 py-1 rounded-lg transition-all border border-[#E6DAB8] disabled:opacity-50 cursor-pointer"
          title="Refresh Live Weather"
        >
          <FiRefreshCw size={11} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Loading State Skeleton */}
      {loading && !weather && (
        <div className="py-6 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-full border-3 border-[#7F011F] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-[#6B4F45]">Fetching Chennai weather...</p>
        </div>
      )}

      {/* Error State */}
      {error && !weather && !loading && (
        <div className="py-4 text-center space-y-2">
          <div className="flex justify-center text-rose-600">
            <FiAlertCircle size={24} />
          </div>
          <p className="text-xs font-bold text-slate-700">{error}</p>
          <button
            onClick={fetchWeather}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#7F011F] px-3 py-1.5 rounded-lg hover:bg-[#660119] transition-all"
          >
            <FiRefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Weather Content */}
      {weather && weatherDetails && (
        <div className="pt-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Temperature & Icon */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className={`p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br ${weatherDetails.bgAccent} border border-[#E6DAB8]/60 shrink-0`}>
                <WeatherIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${weatherDetails.iconColor}`} />
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="text-2xl sm:text-3xl font-black text-[#7F011F] tracking-tight">
                    {weather.temp}°
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#6B4F45]">C</span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-[#7F011F] capitalize truncate mt-0.5">
                  {weatherDetails.label}
                </p>
              </div>
            </div>

            {/* Right: Last Updated Badge */}
            <div className="text-right shrink-0">
              <span className="inline-block rounded-full bg-[#F5EBD0] px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-[#7F011F] uppercase border border-[#E6DAB8]">
                LIVE
              </span>
              <p className="text-[9px] sm:text-[10px] font-semibold text-[#6B4F45] mt-1">
                {lastUpdated}
              </p>
            </div>
          </div>

          {/* Stats Grid: Humidity, Wind, Feels Like */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2 pt-2.5 border-t border-[#F5EBD0]/80">
            {/* Feels Like */}
            <div className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#F5EBD0]/30 p-1.5 sm:p-2 border border-[#E6DAB8]/40 min-w-0">
              <FiThermometer className="text-[#7F011F] shrink-0" size={13} />
              <div className="min-w-0 leading-tight">
                <p className="text-[8px] sm:text-[10px] font-semibold text-[#6B4F45] truncate">Feels Like</p>
                <p className="text-[11px] sm:text-xs font-extrabold text-[#7F011F] truncate">{weather.feelsLike}°C</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#F5EBD0]/30 p-1.5 sm:p-2 border border-[#E6DAB8]/40 min-w-0">
              <FiDroplet className="text-sky-600 shrink-0" size={13} />
              <div className="min-w-0 leading-tight">
                <p className="text-[8px] sm:text-[10px] font-semibold text-[#6B4F45] truncate">Humidity</p>
                <p className="text-[11px] sm:text-xs font-extrabold text-[#7F011F] truncate">{weather.humidity}%</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#F5EBD0]/30 p-1.5 sm:p-2 border border-[#E6DAB8]/40 min-w-0">
              <FiWind className="text-teal-600 shrink-0" size={13} />
              <div className="min-w-0 leading-tight">
                <p className="text-[8px] sm:text-[10px] font-semibold text-[#6B4F45] truncate">Wind</p>
                <p className="text-[11px] sm:text-xs font-extrabold text-[#7F011F] truncate">{weather.windSpeed} <span className="text-[8px] font-bold">km/h</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
