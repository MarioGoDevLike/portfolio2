import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Other imports
import Banner from "./components/Banner";
import Header from "./components/Header";
import Nav from "./components/Nav";
import About from "./components/About";
import Services from "./components/Services";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Projects from "./components/Projects.js";
const App = () => {
  return (
    <Router>
      <div className="bg-site bg-no-repeat bg-cover overflow-hidden">
        <Header />
        <Banner />
        <Nav />
        <About />
        <Services />
        <Routes>
          <Route path="/" exact component={Header} />
          <Route path="/projects" component={Projects} /> {/* Add this line */}
        </Routes>
        <Work />
        <Contact />
      </div>
    </Router>
  );
};

export default App;
