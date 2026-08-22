# CS Academic Portal - Issue Tracking & Resolution Audit Log

Last Updated: August 22, 2026

## 1. Resolved Issues

- [x] **Placement Calendar Stub**: Replaced `alert(...)` stub in `PlacementCalendarTab.jsx` with working `.ics` calendar exporter (`icsExporter.js`) + success toasts.
- [x] **Corrupted Placement ID**: Replaced `place-[#D97706]` in `searchService.js` with slug ID `place-cognizant-cts`.
- [x] **Table Responsiveness**: Cleaned up `.table-responsive` CSS and ensured all admin and content tables wrap in `overflow-x-auto`.
- [x] **Groq API Key Security**: Moved Groq AI calls behind serverless proxy endpoint `/api/groq` (`api/groq.js` & `vite.config.js` dev server middleware). Key is no longer shipped in client bundle.
- [x] **Admin Authorization Bypass**: Removed hardcoded roll numbers (`24E3006`/`24E3013`) from `ProtectedRoute.jsx` and `StudentDashboard.jsx`. Authorization strictly relies on role permissions.
- [x] **Bundle Performance & Code Splitting**:
  - Implemented `React.lazy()` + `<Suspense>` route-level code splitting in `App.jsx`.
  - Dynamically imported `react-pdf` (`documentParser.js`, `ocrService.js`, `PdfPreviewModal.jsx`).
  - Dynamically imported `jspdf` (`studyGuidePdfExporter.js`, `pdfGenerator.js`, `ResumeBuilderTab.jsx`, `StudentPlacementTab.jsx`, `CollegeCalendar.jsx`).
  - Code-split `recharts` to admin analytics and dashboard pages.
  - Reduced main bundle size from **2.07 MB** down to **~379 KB**.
- [x] **Accessibility (a11y)**:
  - Added `<label htmlFor>` + matching `id` attributes on form fields in `Register.jsx` and `ForgotPassword.jsx`.
  - Added `aria-label` attributes to icon-only buttons (modals, search, chat FAB, calendar).
  - Added `@media (prefers-reduced-motion: reduce)` in `index.css` for floating-orb, shine-sweep, and pulse animations.
  - Added visible keyboard focus rings (`focus-visible:ring-2`) on interactive card components (`BentoCard3D`).
- [x] **Feature Completeness**:
  - Added "Continue where you left off" section on `StudentDashboard.jsx` driven by `recentlyViewed.js`.
  - Added reusable `ConfirmModal.jsx` component for destructive actions.
  - Implemented row checkboxes and bulk delete capability in `ManageUsers.jsx` and `ManageStudents.jsx`.
  - Added "Export CIA Exams (.ics)" calendar export button in `CollegeCalendar.jsx`.
- [x] **Repo Hygiene**:
  - Deleted `scratch/`, `server.log`, `%TEMP%vite-log.txt`, `git.ps1`, `folder.html`, `os_folder.html`, `sem 1 english/` duplicate directory, and root vite logs.
  - Updated `.gitignore` with all temporary/debug file patterns.

## 2. Active Monitoring & Verification

- `npm run lint`: **0 errors, 0 warnings**.
- `npm run build`: **Build succeeds cleanly** with on-demand chunk loading.
