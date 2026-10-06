# Job Application Tracker

A production-ready, full-stack **Job Application Tracker** web application designed to organize, manage, and accelerate your job search pipeline. Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **MongoDB / Mongoose**.

---

## 🚀 Key Features

* **Dashboard & Career Metrics:**
  * Real-time KPI summary cards: Total Applications, Applied, Interviews, Offers, Follow-ups Due.
  * Computed interview conversion rate, offer success rate, and active pipeline health.
  * Interactive analytics charts powered by **Recharts**: Status Distribution and 6-Month Application Timeline.
  * Quick-access recent activity feed with instant status switching.

* **Full-Featured Job Table:**
  * 11 comprehensive columns: `#`, `Job Description` (with snippet & modal viewer), `Company` (with automatic domain favicons/initials), `Email` (`mailto:` with 1-click clipboard copy), `Location`, `CV` (direct external link), `Update` (interview logs & count badges), `Website` (direct external link), `Status` (live dropdown selector), `Application Date`, and `Actions` (Edit & Delete).
  * Smooth mobile-responsive transition: transforms table rows into clean cards on mobile devices.

* **Real-time Status Management:**
  * Colored status badges: `Saved`, `Applied`, `Follow Up`, `Interview`, `Technical Test`, `Offer`, `Rejected`, `Withdrawn`.
  * Instant status change dropdown directly in table rows and detail modals with immediate MongoDB updates.

* **Interview & Process Timeline Tracker:**
  * Chronological log of interview rounds, recruiter screens, technical assessments, and pairing sessions.
  * Add, view, edit, and delete interview update entries with timestamps.

* **Gmail Follow-Up Tracker & Quick Action:**
  * Track follow-up history with automatic counter incrementation (`followUpCount`).
  * **"Send in Gmail" Action:** Generates prefilled Gmail compose URLs (`https://mail.google.com/mail/?view=cm&...`) with recipient email, personalized subject, and polite body templates.
  * **"Mark as Followed Up":** One-click logging of follow-up timestamp to database.

* **Server-Side Search, Filtering, Sorting & Pagination:**
  * Debounced global search across job titles, companies, recruiter emails, locations, and notes using MongoDB queries.
  * Multi-dimensional filters: Status, Location, Company.
  * Server-side sorting by Application Date, Company, Job Title, Status, and Created Date.
  * Dynamic pagination with configurable limits (10, 20, 50, 100 per page).

* **Personal Profile & Portfolio Management:**
  * Candidate identity profile: Full Name, Professional Title, Personal Gmail, Phone, Location, GitHub, LinkedIn, Portfolio Website, Master CV Link, and Professional Bio.
  * Live candidate preview card with instant link verification.

* **Design & Aesthetics:**
  * Sleek Light & Dark mode support via `next-themes`.
  * Modern glassmorphism, responsive cards, polished modal dialogs via Radix UI primitives, and interactive toast notifications via Sonner.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + custom animations
* **UI Primitives:** Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, etc.)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
* **Date Utilities:** [date-fns](https://date-fns.org/)

---

## 📁 Project Structure

```text
JobTracker/
├── scripts/
│   └── seed.mjs                   # Sample dataset seeder script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/         # Dashboard metrics & analytics aggregation
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts       # GET (paginated/filtered) & POST (create job)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts   # GET, PATCH, DELETE single job
│   │   │   │       ├── updates/   # POST, PATCH, DELETE interview updates
│   │   │   │       └── followups/ # POST, PATCH, DELETE Gmail follow-ups
│   │   │   └── profile/
│   │   │       └── route.ts       # GET & PATCH candidate profile
│   │   ├── applications/          # Main job application table view
│   │   ├── dashboard/             # Dashboard route redirect
│   │   ├── jobs/
│   │   │   ├── new/               # Dedicated job creation page
│   │   │   └── [id]/              # Detailed job overview page
│   │   ├── profile/               # Candidate profile page
│   │   ├── globals.css            # Design tokens, variables & glass styles
│   │   ├── layout.tsx             # Root layout with ThemeProvider & Toaster
│   │   └── page.tsx               # Primary dashboard page
│   ├── components/
│   │   ├── dashboard/             # Stats cards, Recharts components, recent list
│   │   ├── jobs/                  # JobTable, JobRow, Search, Filter, Modals
│   │   ├── layout/                # Navbar, Sidebar, AppLayout drawer
│   │   ├── profile/               # Candidate profile form & live preview card
│   │   ├── providers/             # NextThemes ThemeProvider
│   │   └── ui/                    # Button, Badge, Modal, Input, Textarea, etc.
│   ├── lib/
│   │   ├── mongodb.ts             # Cached Mongoose connection helper
│   │   ├── utils.ts               # Date formatters, status configs, Gmail link generator
│   │   └── validations/           # Zod schemas for jobs and profiles
│   ├── models/
│   │   ├── Job.ts                 # MongoDB Mongoose Job model & indexes
│   │   └── Profile.ts             # MongoDB Mongoose Profile model
│   └── types/
│       ├── job.ts                 # TypeScript types for Jobs & API responses
│       └── profile.ts             # TypeScript types for Candidate profile
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/jobtracker
```

For MongoDB Atlas (cloud), format as:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobtracker?retryWrites=true&w=majority
```

> **Security Note:** `MONGODB_URI` is strictly server-side and never exposed to the client. `.env.local` is added to `.gitignore`.

---

## 📦 Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure MongoDB:**
   Ensure MongoDB is running locally on port `27017` or supply your MongoDB Atlas URI in `.env.local`.

3. **Seed Sample Data (Optional):**
   Seed 8 realistic job applications across diverse companies (Stripe, Shopify, Google, Vercel, Spotify, etc.) and candidate profile:
   ```bash
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production Build & Verification:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📡 API Documentation

### Jobs API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs?page=1&limit=10&search=react&status=Interview&sortBy=applicationDate&sortOrder=desc` | Fetch paginated, filtered, and sorted jobs list |
| `POST` | `/api/jobs` | Create new job application |
| `GET` | `/api/jobs/:id` | Fetch single job with full update & follow-up logs |
| `PATCH` | `/api/jobs/:id` | Update job fields (partial update supported) |
| `DELETE` | `/api/jobs/:id` | Delete job application |

### Interview Updates API
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs/:id/updates` | Add interview round / process update |
| `PATCH` | `/api/jobs/:id/updates/:updateId` | Update interview update entry |
| `DELETE` | `/api/jobs/:id/updates/:updateId` | Remove interview update entry |

### Gmail Follow-Ups API
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs/:id/followups` | Log follow-up & increment count |
| `PATCH` | `/api/jobs/:id/followups/:followupId` | Update follow-up record |
| `DELETE` | `/api/jobs/:id/followups/:followupId` | Remove follow-up & decrement count |

### Profile & Dashboard API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get candidate profile (auto-seeded if empty) |
| `PATCH` | `/api/profile` | Update candidate profile & CV links |
| `GET` | `/api/dashboard` | Aggregated KPI stats, conversion rates, and timeline data |

---

## 🗄️ Database Models

### Job Schema (`Job.ts`)
```ts
{
  jobTitle: string (required, indexed);
  companyName: string (required, indexed);
  recruiterName?: string;
  recruiterEmail?: string (indexed);
  location?: string (indexed);
  jobDescriptionShort: string (required);
  jobDescriptionFull?: string;
  cvLink?: string;
  cvName?: string;
  websiteLink?: string;
  applicationDate: Date (default: now, indexed);
  status: "Saved" | "Applied" | "Follow Up" | "Interview" | "Technical Test" | "Offer" | "Rejected" | "Withdrawn" (indexed);
  interviewUpdates: [
    {
      date: Date;
      title?: string;
      content: string;
      createdAt: Date;
    }
  ];
  followUps: [
    {
      date: Date;
      type: "Gmail";
      subject?: string;
      content?: string;
      note?: string;
      createdAt: Date;
    }
  ];
  followUpCount: number (default: 0);
  extraNote?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Profile Schema (`Profile.ts`)
```ts
{
  fullName: string (required);
  professionalTitle: string (required);
  email: string (required);
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  defaultCv?: string;
  defaultCvName?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛡️ Best Practices & Architecture
* **Strict TypeScript:** No `any` shortcuts, typed API contracts across frontend and backend.
* **Mongoose Connection Caching:** Global connection caching across serverless invocations and Next.js hot reload cycles.
* **Debounced Server Search:** Fast query execution without redundant server roundtrips.
* **Component Modularity:** Independent, maintainable components for modals, badges, cards, charts, and table rows.
