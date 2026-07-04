# CS Academic Portal

A production-quality, role-based academic portal for a Computer Science department. Built as a real SaaS-style application with premium glassmorphic UI, dark/light mode, Firebase backend, and full module coverage.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 6, React Router DOM 6 |
| Styling | Tailwind CSS 3, Framer Motion |
| Backend | Firebase Auth, Firestore, Storage |
| Forms & UX | React Hook Form, React Hot Toast, React Icons |
| Documents | React PDF |
| Charts | Recharts |

## Features

### Authentication & Roles
- Email/password login, register, forgot password
- Three roles: **Student**, **Faculty**, **Admin**
- Protected, role-based routing

### Public Site
- Animated landing page (Hero, Features, Statistics, Faculty, Latest Uploads, Placement Highlights, Testimonials, Footer)
- E-Content, Lecture Notes, Question Papers, Placements browse pages
- Global search across all modules
- Dark / light mode toggle

### Student Dashboard
- Dashboard with stats & recent activity
- Watch videos, download notes, question papers
- Placements feed, bookmarks, recently viewed, profile

### Faculty Dashboard
- Upload videos (with thumbnail), notes, question papers
- Manage uploads, profile
- Floating action button for quick upload

### Admin Dashboard
- Manage users, faculty, students (role promotion/demotion)
- Manage all content (videos, notes, papers, placements)
- Analytics charts, settings

### Extra
- Bookmarks, notifications panel, loading skeletons, toasts
- Infinite scroll pagination, empty states, 404 page
- Firestore & Storage security rules included

---

## Installation

### Prerequisites

- **Node.js 18+** and **npm** ([download](https://nodejs.org/))
- A **Firebase** project ([console.firebase.google.com](https://console.firebase.google.com))

### Step 1 — Clone / open the project

```bash
cd cs-academic-portal
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure Firebase

1. Create a Firebase project.
2. Enable **Authentication → Email/Password**.
3. Create a **Firestore Database** (production mode).
4. Enable **Storage**.
5. Register a **Web App** and copy config values.

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4 — Deploy security rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage
# Select your project; use existing firestore.rules and storage.rules
firebase deploy --only firestore:rules,storage:rules
```

### Step 5 — Create your first admin

1. Run the app and register as Student or Faculty.
2. In Firebase Console → Firestore → `users/{your-uid}`, set `role` to `admin`.
3. Log out and back in.

### Step 6 — Run locally

```bash
npm run dev
```

Open **http://localhost:5173**

### Step 7 — Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to **Vercel**, **Netlify**, or **Firebase Hosting**:

```bash
firebase init hosting   # public directory: dist
firebase deploy --only hosting
```

---

## Project Structure

```
cs-academic-portal/
├── public/                  # Static assets (favicon)
├── src/
│   ├── assets/              # Images & static files
│   ├── components/
│   │   ├── ui/              # Button, GlassCard, StatCard, FAB, LoadingScreen…
│   │   ├── layout/          # Navbar, Sidebar, Footer, GlobalSearch, Notifications
│   │   └── dashboard/       # ModuleBrowser, UploadForm, VideoCard, modals
│   ├── context/             # AuthContext, ThemeContext
│   ├── firebase/            # Firebase initialization
│   ├── hooks/               # useFirestoreList, useDebounce, useInfiniteScroll, useNotifications
│   ├── layouts/             # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── auth/            # Login, Register, ForgotPassword
│   │   ├── student/         # Dashboard, Videos, Notes, Bookmarks, RecentlyViewed…
│   │   ├── faculty/         # Dashboard, Upload*, ManageUploads, Profile
│   │   ├── admin/           # Dashboard, ManageUsers/Faculty/Students, Analytics…
│   │   └── Home, Search, EContent, Notes, Placements, About, NotFound
│   ├── routes/              # ProtectedRoute
│   ├── services/            # Firestore, Storage, video/note/paper/placement/search/notification
│   ├── styles/              # Tailwind entry (index.css)
│   └── utils/               # constants, helpers, recentlyViewed
├── firestore.rules
├── storage.rules
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | Profiles, roles, bookmarks array |
| `videos` | E-content metadata + Storage URL |
| `notes` | Lecture note PDFs |
| `questionPapers` | Question papers (year, regulation) |
| `placements` | Company drives, packages, deadlines |
| `notifications` | User notifications |

## Storage Paths

```
videos/
notes/
questionpapers/
logos/
```

## Color Palette

| Token | Hex |
|-------|-----|
| Primary | `#2563EB` |
| Secondary | `#0EA5E9` |
| Accent | `#14B8A6` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Background | `#F8FAFC` |
| Dark | `#0F172A` |

## Notes

- Firestore may prompt you to create **composite indexes** the first time filtered queries run — click the link in the browser console error to create them.
- Notifications are stored in Firestore; admins can create them via the Firebase console or by extending the admin panel.
- Bookmarks are stored on the user document (`users/{uid}.bookmarks`).

## License

MIT — use freely for your department portal.
