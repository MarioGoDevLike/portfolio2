import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "./components/layout/Preloader";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";

const App = () => {
  const [loading, setLoading] = useState(true);

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
