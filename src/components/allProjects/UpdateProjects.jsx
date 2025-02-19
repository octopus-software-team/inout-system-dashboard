import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import toast, { Toaster } from "react-hot-toast";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });

  return null;
};

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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

  const [services, setServices] = useState([]);
  const [consultives, setConsultives] = useState([]);
  const [branches, setBranches] = useState([]);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedConsultives, setSelectedConsultives] = useState([]);

  const [position, setPosition] = useState([23.8859, 45.0792]);

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

        const servicesRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getServices",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const servicesData = await servicesRes.json();
        if (servicesData.status !== 200) {
          throw new Error(servicesData.msg || "Failed to fetch services.");
        }
        const servicesOptions = servicesData.data.map((service) => ({
          value: service.id,
          label: service.name,
        }));
        setServices(servicesOptions);

        const consultiveRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const consultiveData = await consultiveRes.json();
        if (consultiveData.status !== 200) {
          throw new Error(consultiveData.msg || "Failed to fetch consultives.");
        }
        const consultivesOptions = consultiveData.data
          .filter((c) => c.type === 2)
          .map((c) => ({
            value: c.id,
            label: c.name,
          }));
        setConsultives(consultivesOptions);

        const branchesRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const branchesData = await branchesRes.json();
        if (branchesData.status !== 200) {
          throw new Error(branchesData.msg || "Failed to fetch branches.");
        }
        const branchesOptions = branchesData.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));
        setBranches(branchesOptions);

        const ownersRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ownersData = await ownersRes.json();
        if (ownersData.status !== 200) {
          throw new Error(ownersData.msg || "Failed to fetch owners.");
        }
        const ownersOptions = ownersData.data
          .filter((owner) => owner.type === 1)
          .map((owner) => ({
            value: owner.id,
            label: owner.name,
          }));
        setOwners(ownersOptions);

        const customersRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const customersData = await customersRes.json();
        if (customersData.status !== 200) {
          throw new Error(customersData.msg || "Failed to fetch customers.");
        }
        const customersOptions = customersData.data
          .filter((customer) => customer.type === 0)
          .map((customer) => ({
            value: customer.id,
            label: customer.name,
          }));
        setCustomers(customersOptions);

        const engineersRes = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEngineers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const engineersData = await engineersRes.json();
        if (engineersData.status !== 200) {
          throw new Error(engineersData.msg || "Failed to fetch engineers.");
        }
        const engineersOptions = engineersData.data.map((engineer) => ({
          value: engineer.id,
          label: engineer.full_name,
        }));
        setEngineers(engineersOptions);

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

        setFormData({
          id: project.id,
          name: project.name,
          branch_id: project.branch_id,
          project_owner_id: project.project_owner_id,
          customer_constructor_id: project.customer_constructor_id,
          inspection_date: project.inspection_date,
          inspection_time: project.inspection_time,
          notes: project.notes,
          status: project.status,
          inspection_engineer_id: project.inspection_engineer_id,
          latitude: project.latitude,
          longitude: project.longitude,
        });

        setPosition([project.latitude, project.longitude]);

        const initialSelectedServices = servicesOptions
          .filter((s) =>
            project.services.some((ps) => ps.service_id === s.value)
          )
          .map((s) => ({
            value: s.value,
            label: s.label,
          }));
        setSelectedServices(initialSelectedServices);

        const initialSelectedConsultives = consultivesOptions
          .filter((c) =>
            project.consultive.some((pc) => pc.consultive_id === c.value)
          )
          .map((c) => ({
            value: c.value,
            label: c.label,
          }));
        setSelectedConsultives(initialSelectedConsultives);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
        // toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (!formData.name) {
      alert("Please enter the project name");
      return;
    }

    const selectedServiceIds =
      selectedServices && selectedServices.length > 0
        ? selectedServices.map((s) => s.value)
        : [];
    const selectedConsultiveIds =
      selectedConsultives && selectedConsultives.length > 0
        ? selectedConsultives.map((c) => c.value)
        : [];

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
    selectedServiceIds.forEach((id, index) =>
      data.append(`service_ids[${index}]`, id)
    );
    selectedConsultiveIds.forEach((id, index) =>
      data.append(`project_consultive_ids[${index}]`, id)
    );
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

      const result = await response.json();

      if (response.ok) {
        setShowToast(true); // إظهار الـ Toast
        setTimeout(() => {
          setShowToast(false); // إخفاء الـ Toast بعد 3 ثواني
          navigate("/allprojects/showallprojects");
        }, 3000);
      } else {
        alert(result.msg || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 dark:text-red-300 rounded">
        {error}
      </div>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Please enter a location to search.");
      return;
    }

    setSearchLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lon,
        });
        alert(`Location found: ${data[0].display_name}`);
      } else {
        alert("Location not found. Please try a different query.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      {showToast && <div className="toast">Updated Successfully!</div>}
      {loading ? (
        <div className="flex items-center justify-center w-full h-full text-xl">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="container ml-0 p-10">
          <h2 className="total text-center  text-4xl font-bold mb-6">
            Update Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Name <span className="text-red-500"></span>
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
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <option value="">Select Status</option>
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
                <Select
                  options={branches}
                  name="branch_id"
                  placeholder="Select Branch"
                  className="dark:bg-slate-700 dark:text-white"
                  value={
                    branches.find((b) => b.value === formData.branch_id) || null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      branch_id: selected ? selected.value : "",
                    })
                  }
                />
              </div>

              {/* Services */}
              <div>
                <label
                  htmlFor="services"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Services
                </label>
                <Select
                  isMulti
                  options={services}
                  value={selectedServices}
                  onChange={setSelectedServices}
                  placeholder="Select Services"
                  name="services"
                  className="dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Project Owner */}
              <div>
                <label
                  htmlFor="project_owner_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Owner
                </label>
                <Select
                  options={owners}
                  name="project_owner_id"
                  placeholder="Select Project Owner"
                  className="dark:bg-slate-700 dark:text-white"
                  value={
                    owners.find((o) => o.value === formData.project_owner_id) ||
                    null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      project_owner_id: selected ? selected.value : "",
                    })
                  }
                />
              </div>

              {/* Customer */}
              <div>
                <label
                  htmlFor="customer_constructor_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Customer
                </label>
                <Select
                  options={customers}
                  name="customer_constructor_id"
                  placeholder="Select Customer"
                  className="dark:bg-slate-700 dark:text-white"
                  value={
                    customers.find(
                      (c) => c.value === formData.customer_constructor_id
                    ) || null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      customer_constructor_id: selected ? selected.value : "",
                    })
                  }
                />
              </div>

              {/* Consultives */}
              <div>
                <label
                  htmlFor="consultives"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Consultive(s)
                </label>
                <Select
                  isMulti
                  options={consultives}
                  value={selectedConsultives}
                  onChange={setSelectedConsultives}
                  placeholder="Select Consultive(s)"
                  name="consultives"
                  className="dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Inspection Date */}
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

              <div>
                <label
                  htmlFor="inspection_engineer_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Engineer
                </label>
                <Select
                  options={engineers}
                  name="inspection_engineer_id"
                  placeholder="Select Engineer"
                  className="dark:bg-slate-700 dark:text-white"
                  value={
                    engineers.find(
                      (e) => e.value === formData.inspection_engineer_id
                    ) || null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      inspection_engineer_id: selected ? selected.value : "",
                    })
                  }
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

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  notes <span className="text-red-500"></span>
                </label>
                <textarea
                  type="text"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="textarea1"
                />
              </div>

              {/* الخريطة */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Inspection Location
                </label>
                <MapContainer
                  center={position}
                  zoom={6}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker setPosition={setPosition} />
                  {position && <Marker position={position} />}
                </MapContainer>
                <form onSubmit={handleSearch} className="mt-4 flex justify-end">
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 w-10 border border-gray-300 rounded-l-md p-2 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
                    disabled={searchLoading}
                  >
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateProject;
