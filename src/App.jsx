import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNavbar from "./components/NavBar/SideNavbar";
import Navbar from "./components/NavBar/Navbars";
import AddBranch from "./components/company/AddBranch";
import AddServices from "./components/company/AddServices";
import AddEngineer from "./components/company/AddEngineer";
import AddNewProject from "./components/allProjects/AddNewProject";
import ShowAllProjects from "./components/allProjects/ShowAllProjects";
import DashBoard from "./components/dashboard/DashBoard";
import Chartjs from "./components/charts/Chartjs";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Navbar toggleSidebar={toggleSidebar} className="fixed top-0 w-full z-10" />

      <div className="flex">
        <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <SideNavbar className="mt-16" />
        </div>
  
        <div className="flex-grow bg-gray-100 min-h-screen pt-16 md:ml-80">
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/allprojects/addnewproject" element={<AddNewProject />} />
            <Route path="/allprojects/showallprojects" element={<ShowAllProjects />} />
            <Route path="/company/addbranch" element={<AddBranch />} />
            <Route path="/company/addservices" element={<AddServices />} />
            <Route path="/company/addengineer" element={<AddEngineer />} />
          </Routes>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >

        </div>
      )}
    </Router>
  );
}

export default App;
