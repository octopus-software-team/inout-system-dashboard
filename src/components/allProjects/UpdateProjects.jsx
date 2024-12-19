import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { Toaster, toast } from "sonner";

// إعداد أيقونات Leaflet إذا لزم الأمر
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [branches, setBranches] = useState([]);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    branch_id: "",
    project_owner_id: "",
    customer_constructor_id: "",
    inspection_date: "",
    inspection_time: "",
    notes: "",
    status: "",
    inspection_engineer_id: "",
    latitude: "",
    longitude: "",
  });

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      },
    });

    const { latitude, longitude } = formData;
    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null;
  };

  // const notify = (msg) => toast(msg);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch project data
        const projectsRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getProjects",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const projectsData = await projectsRes.json();
        if (projectsData.status !== 200) {
          throw new Error(projectsData.msg || "Failed to fetch projects.");
        }
        const project = projectsData.data.find(
          (item) => item.id === parseInt(id)
        );
        if (!project) {
          throw new Error("Project not found");
        }

        // Fetch other necessary data (branches, owners, customers, engineers)
        const [branchesRes, ownersRes, customersRes, engineersRes] =
          await Promise.all([
            fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://inout-api.octopusteam.net/api/front/getEngineers", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const [branchesData, ownersData, customersData, engineersData] =
          await Promise.all([
            branchesRes.json(),
            ownersRes.json(),
            customersRes.json(),
            engineersRes.json(),
          ]);

        setBranches(branchesData.data);
        setOwners(ownersData.data);
        setCustomers(customersData.data);
        setEngineers(engineersData.data);

        setFormData((prev) => ({
          ...prev,
          ...project,
          latitude: project.latitude || "23.8859",
          longitude: project.longitude || "45.0792",
        }));
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    if (!formData.name) {
      toast.error("Please enter the project name");
      return;
    }

    // setLoading(true);

    const data = new FormData();
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("branch_id", formData.branch_id);
    data.append("project_owner_id", formData.project_owner_id);
    data.append("customer_constructor_id", formData.customer_constructor_id);
    data.append("inspection_date", formData.inspection_date);
    data.append("inspection_time", formData.inspection_time);
    data.append("notes", formData.notes);
    data.append("status", formData.status);
    data.append("inspection_engineer_id", formData.inspection_engineer_id);
    data.append("longitude", formData.longitude);
    data.append("latitude", formData.latitude);

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateProject/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const res = await response.json();

      if (res.ok) {
        toast.success("Event has been created");
        navigate("/allprojects/showallprojects");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 dark:text-red-300 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full text-xl">
          <p>loading...</p>
        </div>
      ) : (
        <div className="service container mx-auto p-6 dark:bg-slate-800 shadow-md rounded-lg max-w-2xl mt-10">
          <Toaster position="top-center" richColors />

          <h2 className="text-center font-bold text-3xl mb-6 text-gray-800 dark:text-white">
            Update Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="inspection_date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Inspection Date
              </label>
              <input
                type="date"
                id="inspection_date"
                name="inspection_date"
                value={formData.inspection_date}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Inspection Time */}
            <div>
              <label
                htmlFor="inspection_time"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Inspection Time
              </label>
              <input
                type="time"
                id="inspection_time"
                name="inspection_time"
                value={formData.inspection_time}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                rows={4}
              />
            </div>

            {/* Project Status */}
            <div className="">
              <label className="block ml-6 text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Project Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="add border border-gray-300 rounded-md p-2 text-gray-700 w-full dark:bg-slate-700 dark:text-white"
              >
                <option value="0">Not Started</option>
                <option value="2">In Progress</option>
                <option value="4">Completed</option>
                <option value="6">Pending</option>
                <option value="8">Under Review</option>
                <option value="10">Cancelled</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="branch_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Branch
              </label>
              <select
                id="branch_id"
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Owner */}
            <div>
              <label
                htmlFor="project_owner_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Owner
              </label>
              <select
                id="project_owner_id"
                name="project_owner_id"
                value={formData.project_owner_id}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Select Owner</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer */}
            <div>
              <label
                htmlFor="customer_constructor_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Customer
              </label>
              <select
                id="customer_constructor_id"
                name="customer_constructor_id"
                value={formData.customer_constructor_id}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Inspection Engineer */}
            <div>
              <label
                htmlFor="inspection_engineer_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Inspection Engineer
              </label>
              <select
                id="inspection_engineer_id"
                name="inspection_engineer_id"
                value={formData.inspection_engineer_id}
                onChange={handleChange}
                className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Select Engineer</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* الخريطة */}
            <div className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:text-white">
              <input
                type="hidden"
                hidden
                value={formData.latitude}
                onChange={handleChange}
                name="latitude"
              />

              <input
                type="hidden"
                hidden
                value={formData.longitude}
                onChange={handleChange}
                name="longitude"
              />

              <div>
                <MapContainer
                  center={[23.8859, 45.0792]}
                  zoom={6}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
            </div>

            {/* زر الإرسال */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateProject;
