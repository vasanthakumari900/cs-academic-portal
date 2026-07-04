// src/pages/admin/Settings.jsx
import { useTheme } from "../../context/ThemeContext";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-display text-2xl font-bold">Settings</h2>

      <GlassCard hover={false}>
        <h3 className="mb-1 font-display font-semibold">Appearance</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Choose how the portal looks for you. This only affects your device.
        </p>
        <Button variant="outline" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-1 font-display font-semibold">Data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Firebase project configuration is managed via environment variables
          in <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-white/10">.env</code>. Update Firestore security rules
          in the Firebase Console to control who can read/write each collection.
        </p>
      </GlassCard>
    </div>
  );
}
