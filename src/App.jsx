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
import Home from "./components/HomePage/Home";
import Clients from "./components/customers/Clients";
import Owner from "./components/customers/Owner";
import Consaltative from "./components/customers/Consaltative";
import Create from "./components/Create/Create";
import Update from "./components/Create/Update";
import AddNewTask from "./components/todo/AddNewTask";
import ShowAllTask from "./components/todo/ShowAllTask";
import AddNewRule from "./components/admin/AddNewRole";
import EditRoles from "./components/admin/EditRoles";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Navbar
        toggleSidebar={toggleSidebar}
        className="fixed top-0 w-full z-10"
      />

      <div className="flex">
        <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <SideNavbar className="mt-16" />
        </div>

        <div className="flex-grow bg-gray-100 min-h-screen pt-16 md:ml-80">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route
              path="/allprojects/addnewproject"
              element={<AddNewProject />}
            />
            <Route
              path="/allprojects/showallprojects"
              element={<ShowAllProjects />}
            />
            <Route path="/company/addbranch" element={<AddBranch />} />
            <Route path="/company/addservices" element={<AddServices />} />
            <Route path="/company/addengineer" element={<AddEngineer />} />
          </Routes>

          <Routes>
            <Route path="/clients/customers" element={<Clients />} />
            <Route path="/owner/customers" element={<Owner />} />
            <Route path="/consaltative/customers" element={<Consaltative />} />
          </Routes>

          <Routes>
            <Route path="/create" element={<Create />} />
            <Route path="/update/:id" element={<Update />} />
          </Routes>

          <Routes>
            <Route path="/todo/addnewtask" element={<AddNewTask />} />
            <Route path="/todo/showalltask" element={<ShowAllTask />} />
          </Routes>

          <Routes>
          <Route path="/admin/addnewrole" element={<AddNewRule />} />
          <Route path="/admin/editrole" element={<EditRoles />} />
          </Routes>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </Router>
  );
}

export default App;
