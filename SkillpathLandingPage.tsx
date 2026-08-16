import * as React from "react"
import { addPropertyControls } from "framer"
import SkillpathCourses from "./SkillpathCourses"

export default function SkillpathLandingPage() {
  const scrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById("courses")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div style={pageStyles.pageWrapper}>
      <style>{heroResponsiveStyles}</style>

      {/* Minimal Navigation / Brand Bar */}
      <nav style={pageStyles.navbar}>
        <div style={pageStyles.navContainer}>
          <a href="#" style={pageStyles.brandLogo}>
            <img
              src="/logo.png"
              alt="Skillpath Logo"
              className="skillpath-brand-icon"
              style={pageStyles.brandIcon}
            />
            <span>Skillpath</span>
          </a>
        </div>
      </nav>

      {/* Hero Section with Full-Width Background Image & Directional Overlay */}
      <header className="skillpath-hero-section" style={pageStyles.heroSection}>
        <div style={pageStyles.heroContainer}>
          <div className="skillpath-hero-content" style={pageStyles.heroContent}>
            <p style={pageStyles.heroEyebrow}>LEARN • BUILD • GROW</p>
            <h1 style={pageStyles.heroHeadline}>
              One skill can change your direction.
            </h1>
            <p style={pageStyles.heroSupportingLine}>
              Learn at your own pace, build useful skills, and take one step closer
              to where you want to be.
            </p>
            <div style={pageStyles.heroAction}>
              <a
                href="#courses"
                onClick={scrollToCourses}
                style={pageStyles.primaryButton}
              >
                Explore courses
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Courses Section (Framer React Code Component) */}
      <main>
        <SkillpathCourses
          sectionTitle="Choose your next skill."
          cardRadius={12}
        />
      </main>

      {/* Footer Section */}
      <footer style={pageStyles.footerSection}>
        <div style={pageStyles.footerContainer}>
          <div style={pageStyles.footerLinks}>
            <a href="#courses" onClick={scrollToCourses} style={pageStyles.footerLink}>
              Courses
            </a>
            <a href="#about" style={pageStyles.footerLink}>
              About
            </a>
            <a href="#privacy" style={pageStyles.footerLink}>
              Privacy
            </a>
          </div>
          <p style={pageStyles.copyright}>
            © 2026 Skillpath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Framer Property Controls Registration to ensure detection by Framer's code-component indexer
addPropertyControls(SkillpathLandingPage, {})

const pageStyles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#0D0B33", // Deep Indigo dominant root
    color: "#FFFFFF",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },
  navbar: {
    width: "100%",
    borderBottom: "1px solid #1F1A4D",
    backgroundColor: "#0D0B33",
    padding: "14px 24px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 10,
  },
  navContainer: {
    maxWidth: "1140px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
  brandLogo: {
    display: "inline-flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#FFFFFF",
    textDecoration: "none",
  },
  brandIcon: {
    height: "46px",
    width: "auto",
    objectFit: "contain",
    display: "block",
  },
  heroSection: {
    width: "100%",
    position: "relative",
    boxSizing: "border-box",
    padding: "128px 24px 116px",
    backgroundColor: "#0D0B33",
    backgroundImage: `
      linear-gradient(90deg, rgba(13, 11, 51, 0.96) 0%, rgba(13, 11, 51, 0.90) 38%, rgba(13, 11, 51, 0.45) 72%, rgba(13, 11, 51, 0.15) 100%),
      url('/hero-bg.png')
    `,
    backgroundPosition: "right center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
  },
  heroContainer: {
    maxWidth: "1140px",
    margin: "0 auto",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heroContent: {
    maxWidth: "580px",
    textAlign: "left",
    boxSizing: "border-box",
  },
  heroEyebrow: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    color: "#C366A8", // Accent Mauve
    margin: "0 0 20px 0",
    textTransform: "uppercase",
  },
  heroHeadline: {
    fontSize: "clamp(34px, 5vw, 54px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    color: "#FFFFFF",
    margin: "0 0 22px 0",
  },
  heroSupportingLine: {
    fontSize: "clamp(16px, 1.9vw, 18px)",
    lineHeight: 1.65,
    color: "#D4CCE3", // Soft light text for clear readability
    margin: "0 0 36px 0",
  },
  heroAction: {
    display: "flex",
    justifyContent: "flex-start",
  },
  primaryButton: {
    display: "inline-block",
    backgroundColor: "#5248A0", // Violet for primary CTA
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: 600,
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    letterSpacing: "0.01em",
    transition: "background-color 0.15s ease",
  },
  footerSection: {
    marginTop: "auto",
    borderTop: "1px solid #1F1A4D",
    backgroundColor: "#0D0B33", // Deep Indigo
    padding: "56px 24px",
    boxSizing: "border-box",
  },
  footerContainer: {
    maxWidth: "1140px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
  },
  footerLinks: {
    display: "flex",
    gap: "36px",
  },
  footerLink: {
    fontSize: "14px",
    color: "#E7C9E7", // Soft Lavender
    textDecoration: "none",
    transition: "color 0.15s ease",
  },
  copyright: {
    fontSize: "13px",
    color: "#8F85A8",
    margin: 0,
  },
}

// Scoped responsive styles for the Hero background, navigation, and layout
const heroResponsiveStyles = `
  @media (max-width: 1024px) {
    .skillpath-brand-icon {
      height: 40px !important;
    }
    .skillpath-hero-section {
      padding: 100px 24px 92px;
      background-image: 
        linear-gradient(90deg, rgba(13, 11, 51, 0.97) 0%, rgba(13, 11, 51, 0.92) 48%, rgba(13, 11, 51, 0.55) 80%, rgba(13, 11, 51, 0.25) 100%),
        url('/hero-bg.png');
    }
    .skillpath-hero-content {
      max-width: 500px;
    }
  }

  @media (max-width: 640px) {
    .skillpath-brand-icon {
      height: 36px !important;
    }
    .skillpath-hero-section {
      padding: 76px 20px 68px;
      background-image: 
        linear-gradient(180deg, rgba(13, 11, 51, 0.94) 0%, rgba(13, 11, 51, 0.90) 100%),
        url('/hero-bg.png');
      background-position: 70% center;
    }
    .skillpath-hero-content {
      max-width: 100%;
    }
  }
`
