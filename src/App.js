import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/layout/Preloader";
import RouteScrollHandler from "./components/layout/RouteScrollHandler";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import MaintenancePage from "./pages/MaintenancePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// ─── Toggle maintenance mode here ───────────────
//   true  → every route shows the maintenance page
//   false → normal site
const MAINTENANCE_MODE = false;
// ────────────────────────────────────────────────

const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [loading, setLoading] = useState(!isAdmin);

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <>
      {!isAdmin && loading && <Preloader onComplete={() => setLoading(false)} />}
      {(isAdmin || !loading) && (
        <>
          <RouteScrollHandler />
          <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<CaseStudyPage />} />
        </Routes>
        </>
      )}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
