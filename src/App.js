import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Preloader from "./components/layout/Preloader";
import RouteScrollHandler from "./components/layout/RouteScrollHandler";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ElloCafePage from "./pages/ElloCafePage";
import RaffoulMotorsPage from "./pages/RaffoulMotorsPage";
import TopSpeedPage from "./pages/TopSpeedPage";
import AlterPage from "./pages/AlterPage";
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
          <Route path="/projects/ello-cafe" element={<ElloCafePage />} />
          <Route path="/projects/raffoul-motors" element={<RaffoulMotorsPage />} />
          <Route path="/projects/top-speed" element={<TopSpeedPage />} />
          <Route path="/projects/alter" element={<AlterPage />} />
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
