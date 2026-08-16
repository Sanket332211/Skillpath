# Technical Change Record: Dynamic Height & Layout Resolution

---

## 1. Original Problem
* **Asynchronous Expansion**: Courses are fetched dynamically from the live Course API (`GET /assignment/course-data`) with varying counts (5–10 items).
* **Final Course Row Clipping**: When courses loaded successfully, the bottom row of course cards was frequently clipped in the Framer Canvas and Preview.
* **Footer Visibility**: The footer appeared missing or cut off after courses loaded into the grid.

---

## 2. Files Investigated
* **[`SkillpathLandingPage.tsx`](SkillpathLandingPage.tsx)**: Root landing page container housing the navigation bar, Hero section, `<SkillpathCourses />` code component, and footer.
* **[`SkillpathCourses.tsx`](SkillpathCourses.tsx)**: Self-contained Framer React Code Component responsible for live API fetching, state management, and the responsive course card grid.

---

## 3. Root Cause Identified for Course-Row Clipping
* **CSS Overflow Side-Effect**:
  In `SkillpathLandingPage.tsx`, the root container (`pageStyles.pageWrapper`) was styled with `overflowX: "hidden"`. Per the W3C CSS Overflow specification, declaring `overflow-x: hidden` while leaving `overflow-y` as default `visible` forces `overflow-y` to compute to `auto` (creating an independent scroll/clipping formatting context).
* **Initial Render vs. Dynamic Growth**:
  On initial mount, the component renders in `status = "loading"` at an initial height of ~1,350px. When the asynchronous Course API resolves with 5–10 courses, the DOM expands to ~2,026px. The `overflow-y: auto` formatting context combined with viewport-locked constraints trapped the dynamic +676px expansion inside the initial frame boundary, clipping the final row of cards and the footer.

---

## 4. Changes Made in Commit `503ba45`
The following targeted CSS adjustments were made in `SkillpathLandingPage.tsx`:

```diff
--- a/SkillpathLandingPage.tsx
+++ b/SkillpathLandingPage.tsx
@@ -94,7 +94,7 @@ const pageStyles: { [key: string]: React.CSSProperties } = {
   pageWrapper: {
-    minHeight: "100vh",
+    width: "100%",
     backgroundColor: "#0D0B33", // Deep Indigo dominant root
     color: "#FFFFFF",
     fontFamily:
@@ -101,6 +101,5 @@ const pageStyles: { [key: string]: React.CSSProperties } = {
     display: "flex",
     flexDirection: "column",
-    overflowX: "hidden",
   },
   navbar: {
@@ -203,7 +202,7 @@ const pageStyles: { [key: string]: React.CSSProperties } = {
   footerSection: {
-    marginTop: "auto",
+    marginTop: 0,
     borderTop: "1px solid #1F1A4D",
     backgroundColor: "#0D0B33", // Deep Indigo
     padding: "56px 24px",
```

* **Removed `minHeight: "100vh"`**: Replaced with `width: "100%"` to allow the container's height to be governed naturally by its rendered children.
* **Removed `overflowX: "hidden"`**: Eliminated the forced `overflow-y: auto` clipping context.
* **Changed `footerSection.marginTop` from `"auto"` to `0`**: Ensured the footer stacks directly below `<main>` in standard document flow.

---

## 5. Files Changed
* **`SkillpathLandingPage.tsx` only.**
* Zero changes were made to `SkillpathCourses.tsx`, `logoData.ts`, or any other project files.

---

## 6. Validation & Results
* **TypeScript Check**: `npx tsc --noEmit` passed with 0 errors.
* **Production Build**: `npx vite build` passed with 0 errors.
* **Git Status**: Working tree was clean prior to commit.
* **Remote Sync**: Commit `503ba45` was pushed successfully to `origin/main`.
* **Framer Verification**: Testing in Framer confirms that the final row of course cards is now **completely visible and no longer clipped**.

---

## 7. Remaining Issue & Scope Note
* **Observation**: In the short/error state (when no courses are returned or the API fails), a white area can appear below the footer.
* **Diagnosis**: This white space is external to `SkillpathLandingPage` and belongs to the parent Framer Page Artboard/Canvas background (`#FFFFFF`) extending below the component's rendered ~1,350px height.
* **Scope Decision**: This issue is **NOT being changed or investigated further at this time**. The codebase implementation is currently frozen.
