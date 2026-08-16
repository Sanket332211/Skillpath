import * as React from "react"
import * as ReactDOM from "react-dom/client"
import SkillpathLandingPage from "./SkillpathLandingPage"

const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SkillpathLandingPage />
    </React.StrictMode>
  )
}
