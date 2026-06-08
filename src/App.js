import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "./components/layout/Preloader";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import MaintenancePage from "./pages/MaintenancePage";

// ─── Toggle maintenance mode here ───────────────
//   true  → every route shows the maintenance page
//   false → normal site
const MAINTENANCE_MODE = false;
// ────────────────────────────────────────────────

const App = () => {
  const [loading, setLoading] = useState(true);

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <BrowserRouter>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
