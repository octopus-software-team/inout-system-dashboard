import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
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

const PrivateRoute = ({ element: Component }) => {
  const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in
  return isLoggedIn ? Component : <Navigate to="/" />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isLoginPage = location.pathname === "/";

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
            {/* Public Routes */}
            <Route path="/" element={<Loginn />} />

            {/* Private Routes */}
            <Route
              path="/home"
              element={<PrivateRoute element={<Home />} />}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<DashBoard />} />}
            />
            <Route
              path="/settingicon/settingicon"
              element={<PrivateRoute element={<SettingsIcon />} />}
            />
            <Route
              path="/allprojects/addnewproject"
              element={<PrivateRoute element={<AddNewProject />} />}
            />
            <Route
              path="/allprojects/showallprojects"
              element={<PrivateRoute element={<ShowAllProjects />} />}
            />
            <Route
              path="/allprojects/addreport"
              element={<PrivateRoute element={<AddReport />} />}
            />
            <Route
              path="/company/branchs"
              element={<PrivateRoute element={<Branchs />} />}
            />
            <Route
              path="/company/services"
              element={<PrivateRoute element={<Services />} />}
            />
            <Route
              path="/company/engineers"
              element={<PrivateRoute element={<Engineers />} />}
            />
            <Route
              path="/company/addbranch"
              element={<PrivateRoute element={<AddBranch />} />}
            />
            <Route
              path="/company/updatebranch"
              element={<PrivateRoute element={<UpdateBranch />} />}
            />
            <Route
              path="/company/assets/addnewassets"
              element={<PrivateRoute element={<AddNewAssets />} />}
            />
            <Route
              path="/company/assets/addmaterials"
              element={<PrivateRoute element={<AddMaterials />} />}
            />
            <Route
              path="/customers/createclients"
              element={<PrivateRoute element={<CreateClients />} />}
            />
            <Route
              path="/customers/updateclients"
              element={<PrivateRoute element={<UpdateClients />} />}
            />
            <Route
              path="/company/employees"
              element={<PrivateRoute element={<Employees />} />}
            />
            <Route
              path="/customers/clients"
              element={<PrivateRoute element={<Clients />} />}
            />
            <Route
              path="/customers/owner"
              element={<PrivateRoute element={<Owner />} />}
            />
            <Route
              path="/customers/consaltative"
              element={<PrivateRoute element={<Consaltative />} />}
            />
            <Route
              path="/todo/addnewtask"
              element={<PrivateRoute element={<AddNewTask />} />}
            />
            <Route
              path="/todo/showalltask"
              element={<PrivateRoute element={<ShowAllTask />} />}
            />
            <Route
              path="/admin/addnewrole"
              element={<PrivateRoute element={<AddNewRule />} />}
            />
            <Route
              path="/admin/editrole"
              element={<PrivateRoute element={<EditRoles />} />}
            />
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

export default function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
