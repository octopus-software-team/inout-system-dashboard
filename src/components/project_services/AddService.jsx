import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";  // استيراد useNavigate
import Cookies from 'js-cookie';

const AddService = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  const navigate = useNavigate();  // استخدام useNavigate للتنقل بعد الإضافة

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // Fetching project data
    fetch("https://inout-api.octopusteam.net/api/front/getProjectServices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setProjects(data.data);
        } else {
          alert("No project data found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        alert("Failed to fetch project data.");
      });
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // Fetching service data
    fetch("https://inout-api.octopusteam.net/api/front/getServices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setServices(data.data);
        } else {
          alert("No service data found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching service data:", error);
        alert("Failed to fetch service data.");
      });
  }, []);

  const handleSubmit = () => {
    const token = Cookies.get('token');

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/addProjectService", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project_id: selectedProject,
        service_id: selectedService,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Service added successfully.");
        // بعد إضافة الخدمة بنجاح، نقوم بالتنقل
        navigate("/project_services/project_services");
      })
      .catch((error) => {
        console.error("Error adding service:", error);
        alert("Failed to add service.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center font-bold text-2xl mb-6 text-gray-800">Add Service</h2>
        
        {/* Select for Project */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
          <Select
            options={projects.map((project) => ({
              value: project.project_id,
              label: `Project ${project.project_id}`,
            }))}
            onChange={(option) => setSelectedProject(option.value)}
            placeholder="Select Project"
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.375rem",  // لتحديد الحواف الدائرية
                borderColor: "#D1D5DB",
                padding: "0.375rem 0.75rem",
              }),
            }}
          />
        </div>

        {/* Select for Service */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
          <Select
            options={services.map((service) => ({
              value: service.id,
              label: `Service ${service.id}`,
            }))}
            onChange={(option) => setSelectedService(option.value)}
            placeholder="Select Service"
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.375rem",  // لتحديد الحواف الدائرية
                borderColor: "#D1D5DB",
                padding: "0.375rem 0.75rem",
              }),
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddService;
