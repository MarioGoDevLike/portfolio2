import React from "react";
import { BrowserRouter} from "react-router-dom";
import {Routes, Route} from 'react-router';
import Banner from "./components/Banner";
import Header from "./components/Header";
import Nav from "./components/Nav";
import About from "./components/About";
import Services from "./components/Services";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Projects from "./components/Projects.js";

const HomeScreen = () => {
  return <div className="bg-site bg-no-repeat bg-cover overflow-hidden">
    <Header />
    <Banner />
    <Nav />
    <About />
    <Services />
    <Work />
    <Contact />
  </div>

}
const App = () => {
  return (
    <BrowserRouter>
     <Routes>
          <Route path="/" element={<HomeScreen />}/>
          <Route path="/projects" Component={() => <Projects />} />
      </Routes> 
    </BrowserRouter>
  );
};

export default App;
