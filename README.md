# Skillpath — Modern Learning Platform & Framer React Code Component

> **"One skill can change your direction."**  
> A high-performance, fault-tolerant landing page and Framer React Code Component built to dynamically fetch and display live course catalog data with currency localization and failure resilience.

---

## 1. Problem Statement

Modern learning platforms and creator websites frequently integrate dynamic code components within headless visual design tools like Framer. However, third-party backend microservices and geo-location APIs commonly suffer from network latency, intermittent HTTP 404/500 failures, and data format discrepancies (such as prices provided in subunits like paise or cents).

The challenge is to build a Framer-compatible React component that:
1. Concurrently queries live course and country-detection endpoints without assuming a fixed number of items.
2. Implements resilient fault isolation so that an auxiliary API failure (such as geo-location) does not crash or block the primary course catalog.
3. Formats international currencies accurately and dynamically.
4. Provides designer-friendly Framer property controls (`addPropertyControls`) while strictly maintaining responsive design and visual hierarchy.

---

## 2. Solution Overview

**Skillpath** addresses these challenges through a fault-tolerant frontend architecture:
* **Fault Isolation via `Promise.allSettled`**: Course and country APIs run in parallel; failures in geo-location gracefully fall back to USD without degrading the course catalogue display.
* **Framer Compatibility**: Built as a self-contained, portable React component ([SkillpathCourses.tsx](SkillpathCourses.tsx)) registered with Framer property controls (`sectionTitle` and `cardRadius`).
* **Dynamic Currency Localization**: Automatically converts subunits (`pricePaise / 100` to INR `₹` and `priceUsdCents / 100` to USD `$`) using the JavaScript `Intl.NumberFormat` API.
* **Focused Visual Aesthetic**: Engineered around a 5-color dark palette (`#0D0B33`, `#4C2F6F`, `#5248A0`, `#C366A8`, `#E7C9E7`) designed for calm, distraction-free study.

---

## 3. Key Features

- **Live Data Ingestion**: Consumes live course catalog data containing dynamic sets of 5–10 items.
- **Fault-Tolerant State Engine**: Seamlessly manages 5 distinct UI states:
  1. `Loading` — Understated status indicator during in-flight network requests.
  2. `Error` — Non-alarmist message when the primary Course API fails.
  3. `Empty` — Clean empty-catalog state when `[]` is returned.
  4. `Success` — Responsive grid of cards rendered from live data.
  5. `Partial Failure Fallback` — Quietly falls back to USD when the Country API fails while courses succeed.
- **2-Line Text Clamping**: CSS multi-line truncation (`-webkit-line-clamp: 2`) preventing uneven card heights.
- **Framer Property Controls**: Canvas-level controls for `sectionTitle` (String) and `cardRadius` (Number, 0–32px).
- **Responsive Layout Engine**: CSS Grid breakpoints automatically adjusting across Desktop (3 cols), Tablet (2 cols), and Mobile (1 col).
- **Smooth Anchor Navigation**: Hero CTA (*"Explore courses"*) smoothly scrolls to the course catalog without triggering network re-fetches.

---

## 4. User Roles & Permissions

* **Student / Public Visitor**: Can browse the landing page, view live course listings, and inspect localized pricing.
* **Content Designer / Framer Editor**: Can customize section titles and card corner radiuses via Framer property controls.
* **Authentication / Role-Based Access Control (RBAC)**: *Not currently implemented (Public catalog view only).*

---

## 5. Technology Stack

* **Frontend Framework**: React 18.3.1
* **Language**: TypeScript 5.6.3 (Strict Mode)
* **Build Tool & Bundler**: Vite 5.4.10 / 5.4.21
* **Component System**: Framer Code Component API (`framer` / `addPropertyControls`)
* **Styling**: Scoped CSS-in-JS + Scoped Media Queries (Zero external CSS framework overhead)
* **Runtime / Engine**: Node.js v22.14.0

---

## 6. System & Application Architecture

```
                                +-----------------------------+
                                |      Skillpath Client       |
                                | (Vite / Framer React App)   |
                                +--------------+--------------+
                                               |
                        +----------------------+----------------------+
                        | (Promise.allSettled Concurrent Fetch)       |
                        v                                             v
       +--------------------------------+            +--------------------------------+
       |       Course Data API          |            |       Country Code API         |
       |  GET /assignment/course-data   |            |  GET /assignment/country-code  |
       |  (Returns Course[] or 404/500) |            |  (Returns IN/US or 404/500)    |
       +--------------------------------+            +--------------------------------+
                        |                                             |
                        | (Success: Course[])                         | (Failure: Fallback to 'US')
                        +----------------------+----------------------+
                                               |
                                               v
                                +-----------------------------+
                                |        State Engine         |
                                |  (SkillpathCourses.tsx)     |
                                +--------------+--------------+
                                               |
         +--------------------+----------------+--------------------+
         |                    |                                     |
         v                    v                                     v
+-----------------+  +-----------------+                  +-------------------+
|  Loading State  |  |   Error State   |                  |   Success State   |
|   (In-Flight)   |  | (Primary Fail)  |                  | (Responsive Grid) |
+-----------------+  +-----------------+                  +-------------------+
```

---

## 7. Frontend Component Architecture

```
SkillpathLandingPage (Page Wrapper)
├── Navigation Bar (Brand Logo)
├── Hero Section (Headline, Supporting Copy, Smooth-Scroll CTA, Full-Width Background)
├── SkillpathCourses (Framer React Code Component)
│   ├── Section Header (Title from sectionTitle prop)
│   ├── State Renderer:
│   │   ├── Loading State (Loading message)
│   │   ├── Error State (Error message)
│   │   ├── Empty State (No courses message)
│   │   └── Course Grid (Success State)
│   │       └── CourseCard (x N, uses cardRadius prop)
│   │           ├── Category Badge (mainCategory)
│   │           ├── Course Title (courseName)
│   │           ├── Description (2-line clamped)
│   │           └── Formatted Price (INR / USD localized)
└── Footer (Navigation links & Copyright notice)
```

---

## 8. Backend Architecture & API Specifications

The application interfaces with external REST microservices hosted on Render:

| Endpoint | Method | Response Payload (200 OK) | Failure Behavior |
| :--- | :---: | :--- | :--- |
| `https://syncsphere-hiv6.onrender.com/assignment/course-data` | `GET` | Array of `Course` objects (5–10 items) | Intermittent 404/500 (triggers Error state) |
| `https://syncsphere-hiv6.onrender.com/assignment/country-code` | `GET` | `{"country_code": "IN"}` or `{"country_code": "US"}` | Intermittent 404/500 (triggers USD fallback) |

* **Backend Services & Persistence**: Provided by external API endpoints.
* **Authentication / WebSockets / Real-Time Sync**: *Not currently implemented.*

---

## 9. Important Business Logic

### 1. Currency Formatting & Conversion
```typescript
const formatPrice = (course: Course): string => {
  if (countryCode === "IN" && typeof course.pricePaise === "number") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(course.pricePaise / 100);
  }

  const cents = typeof course.priceUsdCents === "number" ? course.priceUsdCents : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
};
```

### 2. Partial Failure Isolation
```typescript
const [courseResult, countryResult] = await Promise.allSettled([
  courseFetchPromise,
  countryFetchPromise,
]);

// Country Code Resolution with USD Fallback
if (countryResult.status === "fulfilled" && countryResult.value?.country_code) {
  const code = countryResult.value.country_code.toUpperCase();
  setCountryCode(code === "IN" || code === "US" ? code : "US");
} else {
  // Non-blocking fallback
  setCountryCode("US");
}
```

---

## 10. Folder & Project Structure

```
Skillpath/
├── public/
│   ├── hero-bg.png            # Full-width Hero background image
│   └── courses-bg.png         # Abstract Courses section background artwork
├── dist/                      # Production build output
├── SkillpathCourses.tsx       # Core Framer React Code Component (Portable)
├── SkillpathLandingPage.tsx   # Complete Landing Page wrapper (Hero + Courses + Footer)
├── framer-shim.ts             # Local development shim for Framer runtime
├── main.tsx                   # React root entry point
├── index.html                 # HTML entry point with metadata
├── vite.config.ts             # Vite configuration and alias resolution
├── tsconfig.json              # TypeScript compiler configuration
└── package.json               # Dependencies and scripts
```

---

## 11. Security, Validation & Error Handling

* **Defensive Data Handling**: All dynamic properties include safe fallbacks (`course.courseName || "Untitled Course"`, `course.description || "No description provided."`) to prevent rendering crashes on malformed data.
* **XSS Prevention**: Pure React DOM binding ensures all string insertions are sanitized and escaped by default.
* **CORS Compliance**: Live endpoints provide `access-control-allow-origin: *`.
* **Memory Leak Prevention**: `AbortController` cleanly aborts pending asynchronous fetch requests upon component unmounting.

---

## 12. Verification & Testing Performed

| Test Category | Command / Method | Result |
| :--- | :--- | :---: |
| **Type Checking** | `npx tsc --noEmit` | **PASS (0 errors)** |
| **Production Build** | `npx vite build` | **PASS (0 errors)** |
| **Concurrent API Resolution** | Live multi-request simulation | **PASS** |
| **Partial Failure Handling** | Country API 500 / 404 simulation | **PASS (USD fallback)** |
| **Responsive Layout** | Desktop (>1024px), Tablet (641–1024px), Mobile (<=640px) | **PASS (0 overflow)** |
| **Anchor Navigation** | Hero CTA click test | **PASS (smooth scroll)** |

---

## 13. Setup & Installation Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher (v22.x recommended)
* **npm**: v9.0.0 or higher

### Installation
1. Clone or navigate to the project directory:
   ```bash
   cd SkillPath
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the port specified in terminal output).

### Building for Production
To build the optimized production bundle:
```bash
npm run build
```

---

## 14. Known Limitations & Future Improvements

### Known Limitations
* **Intentionally Flaky Backend**: The live demo API endpoint is programmed to fail ~33% of the time with 404/500 responses as part of the assignment simulation.
* **Static Content for About/Privacy**: Footer policy links point to page anchors rather than dedicated multi-page routes.

### Future Improvements
1. **Interactive Retry Button**: Allow users to manually retry failed course requests without a full browser refresh.
2. **Category Filter & Search**: Client-side filtering by `mainCategory` or search keywords.
3. **Course Modal / Detail View**: Expandable drawer with full curriculum breakdown and refund policy details (`refundable` flag).
4. **Skeleton Loading Placeholders**: Animated shimmer placeholders matching card dimensions during initial load.

---

## 15. Key Files, Components & Concepts (Ranked for Technical Interview)

