import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  // Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
import UpdateProjects from "./components/allProjects/UpdateProjects";
import CreateProject from "./components/allProjects/CreateProject";
import UpdateTask from "./components/todo/UpdateTask";
import UpdateAssets from "./components/company/assets/UpdateAssets";
import CreateAssets from "./components/company/assets/CreateAssets";
import CreateMaterials from "./components/company/CreateMaterials";
import UpdateMaterials from "./components/company/UpdateMaterials";
import Moderator from "./components/moderation/Moderator";
import CreateAdmin from "./components/moderation/CreateAdmin";
import EditAdmin from "./components/moderation/EditAdmin";
import CreateServices from "./components/company/CreateServices";
import EditService from "./components/company/EditService";
import AssetsType from "./components/company/assets/AssetsType";
import CreateAssetType from "./components/company/assets/CreateAssetType";
import UpdateAssetType from "./components/company/assets/UpdateAssetType";
import EmployeeSpecialise from "./components/company/EmployeeSpecialise";
import CreateSpecialise from "./components/company/CreateSpecialise";
import UpdateSpecialise from "./components/company/UpdateSpecialise";
import EmployeeFiles from "./components/company/EmployeeFiles";
import Project_Services from "./components/project_services/Project_Services";
import AddService from "./components/project_services/AddService";
import EditEmp from "./components/company/EditEmp";
import CreateEmpFiles from "./components/company/CreateEmpFiles";
import CreateConsultive from "./components/customers/CreateConsultive";
import AddRepo from "./components/allProjects/AddRepo";
import CreateOwner from "./components/customers/CreateOwner";
import EditOwner from "./components/customers/EditOwner";
import EditConsultive from "./components/customers/EditConsultive";
import { IsAuthenticated, PrivateRoute } from "./utilies/ProtectedRoutes";
import NotFoundPage from "./components/layout/NotFound";
import MaterialCategory from "./components/company/assets/MaterialCategory";
import CreateMaterialCategory from "./components/company/assets/CreateMaterialCategory";
import EditMaterialCategory from "./components/company/assets/EditMaterialCategory";
import View from "./components/company/View";
import ProjectSecRepo from "./components/company/ProjectSecRepo";
import CreateSecRepo from "./components/company/CreateSecRepo";
import EditSecRepo from "./components/company/EditSecRepo";
import { Toaster, toast } from 'sonner'

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
            <Route
              path="/"
              element={<IsAuthenticated element={<Loginn />} />}
            />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
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
              path="/allprojects/updateprojects/:id"
              element={<PrivateRoute element={<UpdateProjects />} />}
            />
            <Route
              path="/allprojects/createproject"
              element={<PrivateRoute element={<CreateProject />} />}
            />

            <Route
              path="/allprojects/addreport/:id"
              element={<PrivateRoute element={<AddReport />} />}
            />
            <Route
              path="/allprojects/addrepo/:id"
              element={<PrivateRoute element={<AddRepo />} />}
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
              path="/company/createservices"
              element={<PrivateRoute element={<CreateServices />} />}
            />
            <Route
              path="/company/editservice"
              element={<PrivateRoute element={<EditService />} />}
            />
            <Route
              path="/project_services/project_services"
              element={<PrivateRoute element={<Project_Services />} />}
            />

            <Route
              path="/project_services/addservice"
              element={<PrivateRoute element={<AddService />} />}
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
              path="/company/projectsecrepo"
              element={<PrivateRoute element={<ProjectSecRepo />} />}
            />
            <Route
              path="/company/createsecrepo"
              element={<PrivateRoute element={<CreateSecRepo />} />}
            />
            <Route
              path="/company/editsecrepo/:id"
              element={<PrivateRoute element={<EditSecRepo />} />}
            />
            <Route
              path="/company/updatebranch/:id"
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
              path="/company/assets/creatematerials"
              element={<PrivateRoute element={<CreateMaterials />} />}
            />

            <Route
              path="/company/assets/materialcategory"
              element={<PrivateRoute element={<MaterialCategory />} />}
            />

            <Route
              path="/company/assets/creatematerialcategory"
              element={<PrivateRoute element={<CreateMaterialCategory />} />}
            />
            <Route
              path="/company/assets/editmaterialcategory"
              element={<PrivateRoute element={<EditMaterialCategory />} />}
            />
            <Route
              path="/company/assets/updatematerials"
              element={<PrivateRoute element={<UpdateMaterials />} />}
            />
            <Route
              path="/company/assets/updateassets"
              element={<PrivateRoute element={<UpdateAssets />} />}
            />
            <Route
              path="/company/view/:id"
              element={<PrivateRoute element={<View />} />}
            />
            <Route
              path="/company/assets/createassets"
              element={<PrivateRoute element={<CreateAssets />} />}
            />
            <Route
              path="/company/assets/assetstype"
              element={<PrivateRoute element={<AssetsType />} />}
            />

            <Route
              path="/company/assets/createassettype"
              element={<PrivateRoute element={<CreateAssetType />} />}
            />
            <Route
              path="/company/assets/updateassettype"
              element={<PrivateRoute element={<UpdateAssetType />} />}
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
              path="/company/editemp/:id"
              element={<PrivateRoute element={<EditEmp />} />}
            />
            <Route
              path="/company/createempfiles"
              element={<PrivateRoute element={<CreateEmpFiles />} />}
            />
            <Route
              path="/company/employeespecialise"
              element={<PrivateRoute element={<EmployeeSpecialise />} />}
            />

            <Route
              path="/company/createSpecialise"
              element={<PrivateRoute element={<CreateSpecialise />} />}
            />
            <Route
              path="/company/updatespecialise"
              element={<PrivateRoute element={<UpdateSpecialise />} />}
            />
            <Route
              path="/company/employeefiles"
              element={<PrivateRoute element={<EmployeeFiles />} />}
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
              path="/customers/editowner/:id"
              element={<PrivateRoute element={<EditOwner />} />}
            />
            <Route
              path="/customers/consaltative"
              element={<PrivateRoute element={<Consaltative />} />}
            />
            <Route
              path="/customers/editconsultive/:id"
              element={<PrivateRoute element={<EditConsultive />} />}
            />
            <Route
              path="/customers/createconsultive"
              element={<PrivateRoute element={<CreateConsultive />} />}
            />
            <Route
              path="/customers/createowner"
              element={<PrivateRoute element={<CreateOwner />} />}
            />
            <Route
              path="/todo/addnewtask"
              element={<PrivateRoute element={<AddNewTask />} />}
            />
            <Route
              path="/todo/updatetask/:id"
              element={<PrivateRoute element={<UpdateTask />} />}
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
            <Route
              path="/moderation/moderator"
              element={<PrivateRoute element={<Moderator />} />}
            />

            <Route
              path="/moderation/createadmin"
              element={<PrivateRoute element={<CreateAdmin />} />}
            />
            <Route
              path="/moderation/editadmin"
              element={<PrivateRoute element={<EditAdmin />} />}
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
