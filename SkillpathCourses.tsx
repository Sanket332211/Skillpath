import * as React from "react"
import { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// Type definition matching the live API response schema
export interface Course {
  courseName: string
  courseCode: string
  description: string
  mainCategory: string
  shortCourse?: string
  courseType?: string
  pricePaise?: number
  priceUsdCents?: number
  mangoId?: string
  refundable?: boolean
}

// Props interface for Framer property controls
export interface SkillpathCoursesProps {
  sectionTitle?: string
  cardRadius?: number
}

// Component state machine type
export type FetchStatus = "loading" | "error" | "empty" | "success"

// API Endpoints
const COURSE_API_URL = "https://syncsphere-hiv6.onrender.com/assignment/course-data"
const COUNTRY_API_URL = "https://syncsphere-hiv6.onrender.com/assignment/country-code"

export default function SkillpathCourses(props: SkillpathCoursesProps) {
  const {
    sectionTitle = "Choose your next skill.",
    cardRadius = 12,
  } = props

  const [status, setStatus] = useState<FetchStatus>("loading")
  const [courses, setCourses] = useState<Course[]>([])
  const [countryCode, setCountryCode] = useState<"IN" | "US">("US") // Internal USD default

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    async function fetchCourseAndCountryData() {
      setStatus("loading")
      console.log("[Skillpath] Fetching live course and country data...")

      try {
        // Course API GET Request
        const courseFetchPromise = fetch(COURSE_API_URL, {
          method: "GET",
          signal,
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(`Course API failed with HTTP ${res.status}`)
          }
          return (await res.json()) as Course[]
        })

        // Country API GET Request
        const countryFetchPromise = fetch(COUNTRY_API_URL, {
          method: "GET",
          signal,
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(`Country API failed with HTTP ${res.status}`)
          }
          return (await res.json()) as { country_code?: string }
        })

        // Independent concurrent resolution
        const [courseResult, countryResult] = await Promise.allSettled([
          courseFetchPromise,
          countryFetchPromise,
        ])

        // Do not update state if unmounted
        if (signal.aborted) return

        // 1. Resolve Country Code (with internal USD fallback on failure)
        if (
          countryResult.status === "fulfilled" &&
          countryResult.value?.country_code
        ) {
          const code = countryResult.value.country_code.toUpperCase()
          if (code === "IN" || code === "US") {
            setCountryCode(code)
            console.log(`[Skillpath] Country API resolved: ${code}`)
          } else {
            setCountryCode("US")
            console.log(`[Skillpath] Country API unknown (${code}) -> Fallback to USD`)
          }
        } else {
          // Partial failure: country API failed (404/500), quietly fallback to USD
          setCountryCode("US")
          console.warn("[Skillpath] Country API non-fatal failure -> Fallback to USD")
        }

        // 2. Resolve Course Data
        if (courseResult.status === "fulfilled") {
          const data = courseResult.value
          if (Array.isArray(data)) {
            if (data.length === 0) {
              setCourses([])
              setStatus("empty")
              console.log("[Skillpath] Course API returned empty list (0 courses).")
            } else {
              setCourses(data)
              setStatus("success")
              console.log(`[Skillpath] Course API success: Loaded ${data.length} courses.`)
            }
          } else {
            setStatus("error")
            console.error("[Skillpath] Course API returned non-array payload.")
          }
        } else {
          // Course API failed (404/500/network error)
          setStatus("error")
          console.warn("[Skillpath] Course API failed (natural 404/500 error). Displaying error state.")
        }
      } catch (err: unknown) {
        if (signal.aborted) return
        setStatus("error")
        console.error("[Skillpath] Network error while fetching data:", err)
      }
    }

    fetchCourseAndCountryData()

    return () => {
      abortController.abort()
    }
  }, [])

  // Currency Formatter Helper
  const formatPrice = (course: Course): string => {
    if (countryCode === "IN" && typeof course.pricePaise === "number") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(course.pricePaise / 100)
    }

    const cents =
      typeof course.priceUsdCents === "number" ? course.priceUsdCents : 0
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100)
  }

  return (
    <section id="courses" style={styles.sectionContainer}>
      <style>{responsiveStyles}</style>

      <div className="skillpath-content-wrapper" style={styles.contentWrapper}>
        {/* Section Header */}
        <header style={styles.header}>
          <p style={styles.subheading}>Curated Curriculum</p>
          <h2 style={styles.title}>{sectionTitle}</h2>
        </header>

        {/* State Rendering Container */}
        <div style={styles.stateContainer}>
          {status === "loading" && (
            <div style={styles.stateMessage}>
              <p style={styles.loadingText}>Loading courses...</p>
            </div>
          )}

          {status === "error" && (
            <div style={styles.stateMessage}>
              <p style={styles.errorText}>
                Unable to load courses at this time. Please check back shortly.
              </p>
            </div>
          )}

          {status === "empty" && (
            <div style={styles.stateMessage}>
              <p style={styles.emptyText}>No courses are currently available.</p>
            </div>
          )}

          {status === "success" && (
            <div className="skillpath-course-grid" style={styles.grid}>
              {courses.map((course, index) => (
                <article
                  key={course.mangoId || course.courseCode || `course-${index}`}
                  className="skillpath-course-card"
                  style={{
                    ...styles.card,
                    borderRadius: `${cardRadius}px`,
                  }}
                >
                  {/* Subtle decorative knowledge network accent in corner */}
                  <svg
                    aria-hidden="true"
                    style={styles.cardNetworkPattern}
                    viewBox="0 0 140 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M140 12 C100 12, 85 38, 50 38 C20 38, 5 70, -15 70"
                      stroke="#5248A0"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity="0.32"
                    />
                    <path
                      d="M140 48 C95 48, 80 82, 35 82"
                      stroke="#C366A8"
                      strokeWidth="1"
                      opacity="0.22"
                    />
                    <circle cx="102" cy="12" r="2.5" fill="#E7C9E7" opacity="0.55" />
                    <circle cx="85" cy="38" r="2" fill="#5248A0" opacity="0.45" />
                    <circle cx="50" cy="38" r="2.5" fill="#C366A8" opacity="0.5" />
                    <circle cx="35" cy="82" r="2" fill="#E7C9E7" opacity="0.4" />
                  </svg>

                  {/* Clean Content Area */}
                  <div style={styles.cardContentInner}>
                    <div>
                      <div style={styles.cardHeader}>
                        <span style={styles.categoryBadge}>
                          {course.mainCategory || "General"}
                        </span>
                      </div>
                      <h3 style={styles.courseName}>
                        {course.courseName || "Untitled Course"}
                      </h3>
                      <p style={styles.description}>
                        {course.description || "No description provided."}
                      </p>
                    </div>
                    <div style={styles.cardFooter}>
                      <span style={styles.priceLabel}>{formatPrice(course)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Default property values
SkillpathCourses.defaultProps = {
  sectionTitle: "Choose your next skill.",
  cardRadius: 12,
}

// Framer Property Controls Registration
addPropertyControls(SkillpathCourses, {
  sectionTitle: {
    type: ControlType.String,
    title: "Section Title",
    defaultValue: "Choose your next skill.",
    description: "Heading text displayed above the course grid.",
  },
  cardRadius: {
    type: ControlType.Number,
    title: "Card Radius",
    defaultValue: 12,
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    description: "Corner radius for each course card.",
  },
})

// Scoped inline styles for Framer Code Component using Deep Purple & Deep Indigo surfaces
const styles: { [key: string]: React.CSSProperties } = {
  sectionContainer: {
    width: "100%",
    backgroundColor: "#4C2F6F", // Deep Purple dominant base
    backgroundImage: `
      linear-gradient(180deg, rgba(76, 47, 111, 0.46) 0%, rgba(76, 47, 111, 0.38) 45%, rgba(13, 11, 51, 0.55) 100%),
      url('/courses-bg.png')
    `,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    padding: "96px 24px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#FFFFFF",
  },
  contentWrapper: {
    maxWidth: "1140px",
    margin: "0 auto",
    width: "100%",
  },
  header: {
    marginBottom: "48px",
  },
  subheading: {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#E7C9E7", // Soft Lavender accent
    margin: "0 0 10px 0",
  },
  title: {
    fontSize: "34px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#FFFFFF",
    margin: 0,
    lineHeight: 1.2,
  },
  stateContainer: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  stateMessage: {
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#0D0B33", // Deep Indigo dark surface
    borderRadius: "12px",
    border: "1px solid rgba(82, 72, 160, 0.35)",
  },
  loadingText: {
    fontSize: "15px",
    color: "#E7C9E7", // Soft Lavender
    margin: 0,
    letterSpacing: "0.02em",
  },
  errorText: {
    fontSize: "15px",
    color: "#D4CCE3",
    margin: 0,
    lineHeight: 1.5,
  },
  emptyText: {
    fontSize: "15px",
    color: "#D4CCE3",
    margin: 0,
  },
  grid: {
    display: "grid",
    width: "100%",
  },
  card: {
    backgroundColor: "#0D0B33", // Deep Indigo base
    backgroundImage: `
      radial-gradient(circle at top right, rgba(82, 72, 160, 0.18) 0%, transparent 55%),
      radial-gradient(circle at bottom left, rgba(195, 102, 168, 0.08) 0%, transparent 45%)
    `,
    border: "1px solid rgba(82, 72, 160, 0.32)", // Subtle low-opacity Violet border
    padding: "28px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
  },
  cardNetworkPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "140px",
    height: "100px",
    pointerEvents: "none",
    zIndex: 0,
  },
  cardContentInner: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  cardHeader: {
    marginBottom: "16px",
  },
  categoryBadge: {
    display: "inline-block",
    backgroundColor: "#2E1E45", // Dark mauve/purple tone
    color: "#C366A8", // Accent Mauve
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "4px",
    letterSpacing: "0.02em",
  },
  courseName: {
    fontSize: "19px",
    fontWeight: 600,
    color: "#FFFFFF",
    margin: "0 0 10px 0",
    lineHeight: 1.35,
    letterSpacing: "-0.01em",
  },
  description: {
    fontSize: "14px",
    color: "#D4CCE3", // Soft light text for clear readability
    lineHeight: 1.55,
    margin: "0 0 24px 0",
    // 2-line clean clamping
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: "18px",
    borderTop: "1px solid rgba(82, 72, 160, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#C366A8", // Accent Mauve for price
    letterSpacing: "-0.01em",
  },
}

// Scoped container queries & media queries for 3-col Desktop, 2-col Tablet, 1-col Mobile
const responsiveStyles = `
  .skillpath-content-wrapper {
    container-type: inline-size;
  }

  .skillpath-course-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  @container (max-width: 1024px) {
    .skillpath-course-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @container (max-width: 640px) {
    .skillpath-course-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  @media (max-width: 1024px) {
    .skillpath-course-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 640px) {
    .skillpath-course-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .skillpath-course-card:hover {
    border-color: rgba(195, 102, 168, 0.65);
    box-shadow: 0 8px 28px rgba(13, 11, 51, 0.45);
  }
`
