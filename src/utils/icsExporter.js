// src/utils/icsExporter.js
import toast from "react-hot-toast";

/**
 * Generate a downloadable .ics calendar file for an event and trigger browser download.
 */
export function exportEventToIcs({ title, description, venue, date, time }) {
  try {
    const eventDate = date ? new Date(date) : new Date();
    const dateStr = eventDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8);
    const startStr = `${dateStr}T090000Z`;
    const endStr = `${dateStr}T170000Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CS Academic Portal//NONSGML Calendar Event//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title || "Academic Event"}`,
      `DESCRIPTION:${(description || title || "").replace(/\n/g, " ")}`,
      `LOCATION:${venue || "CS Department"}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = (title || "event").toLowerCase().replace(/[^a-z0-9]/g, "_");
    link.setAttribute("download", `${safeTitle}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported "${title}" to calendar file (.ics)`);
    return true;
  } catch (err) {
    console.error("ICS Export Error:", err);
    toast.error("Failed to generate calendar event");
    return false;
  }
}
