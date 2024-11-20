import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SideNavbar from "./components/NavBar/SideNavbar";
import Navbar from "./components/NavBar/Navbars";
import Branchs from "./components/company/Branchs";
import Services from "./components/company/Services";
import Engineers from "./components/company/Engineers";
import AddNewProject from "./components/allProjects/AddNewProject";
import ShowAllProjects from "./components/allProjects/ShowAllProjects";
import DashBoard from "./components/dashboard/DashBoard";
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
import Employees from "./components/company/Employees";
import AddReport from "./components/allProjects/AddReport";
import Loginn from "./components/Login/Loginn";
import AddNewAssets from "./components/company/assets/AddNewAssets";
import AddMaterials from "./components/company/assets/AddMaterials";
import SettingsIcon from "./components/settingicon/SettingIcon";
import CreateClients from "./components/customers/CreateClients";
import UpdateClients from "./components/customers/UpdateClients";
import AddBranch from "./components/company/AddBranch";
import UpdateBranch from "./components/company/UpdateBranch";
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isLoginPage = location.pathname === "/loginn";

  return (
    <div className="bg-gray-100 dark:text-white dark:bg-slate-950 min-h-screen">
      {!isLoginPage && (
        <Navbar
          toggleSidebar={toggleSidebar}
          className="fixed top-0 w-full z-10"
        />
      )}

      {!isLoginPage && (
        <div className="fixed bottom-5 right-5 z-50">
          {/* إضافة أيقونة الإعدادات */}
          <SettingsIcon />
        </div>
      )}

      <div className="flex">
        {!isLoginPage && (
          <div className={`${isSidebarOpen ? "block" : ""} md:block`}>
            <SideNavbar className="mt-5" />
          </div>
        )}

        <div className="flex-grow min-h-screen pt-16 md:ml-80">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/settingicon/settingicon" element={<SettingsIcon />} />
            <Route
              path="/allprojects/addnewproject"
              element={<AddNewProject />}
            />
            <Route
              path="/allprojects/showallprojects"
              element={<ShowAllProjects />}
            />
            <Route path="/allprojects/addreport" element={<AddReport />} />
            <Route path="/company/branchs" element={<Branchs />} />
            <Route path="/company/services" element={<Services />} />
            <Route path="/company/engineers" element={<Engineers />} />
            <Route path="/company/addbranch" element={<AddBranch />} />
            <Route path="/company/updatebranch" element={<UpdateBranch />} />
            <Route
              path="/company/assets/addnewassets"
              element={<AddNewAssets />}
            />
            <Route
              path="/company/assets/addmaterials"
              element={<AddMaterials />}
            />

            <Route path="/customers/createclients" element={<CreateClients />} />
            <Route path="/customers/updateclients" element={<UpdateClients />} />
            <Route path="/company/employees" element={<Employees />} />
            <Route path="/customers/clients" element={<Clients />} />
            <Route path="/customers/owner" element={<Owner />} />
            <Route path="/customers/consaltative" element={<Consaltative />} />
            <Route path="/create" element={<Create />} />

            <Route path="/update/:id" element={<Update />} />
            <Route path="/todo/addnewtask" element={<AddNewTask />} />
            <Route path="/todo/showalltask" element={<ShowAllTask />} />
            <Route path="/admin/addnewrole" element={<AddNewRule />} />
            <Route path="/admin/editrole" element={<EditRoles />} />
            <Route path="/loginn" element={<Loginn />} />
          </Routes>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
