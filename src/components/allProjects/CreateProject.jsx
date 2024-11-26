import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    branch_id: "",
    project_owner_id: "",
    customer_constructor_id: "",
    inspection_date: "",
    inspection_time: "",
    notes: "",
    inspection_location_lat: "",
    inspection_location_long: "",
    status: "",
    inspection_engineer_id: "",
  });

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    fetch("https://inout-api.octopusteam.net/api/front/addProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          alert("Project added successfully!");
          navigate("/allprojects/showallprojects");
          alert("Failed to add project");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Create New Project</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block font-semibold">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Branch ID</label>
          <input
            type="number"
            name="branch_id"
            value={formData.branch_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Project Owner ID</label>
          <input
            type="number"
            name="project_owner_id"
            value={formData.project_owner_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Customer Constructor ID</label>
          <input
            type="number"
            name="customer_constructor_id"
            value={formData.customer_constructor_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Inspection Date</label>
          <input
            type="date"
            name="inspection_date"
            value={formData.inspection_date}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-semibold">Inspection Time</label>
          <input
            type="time"
            name="inspection_time"
            value={formData.inspection_time}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Latitude</label>
          <input
            type="text"
            name="inspection_location_lat"
            value={formData.inspection_location_lat}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Longitude</label>
          <input
            type="text"
            name="inspection_location_long"
            value={formData.inspection_location_long}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Status</label>
          <input
            type="number"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Inspection Engineer ID</label>
          <input
            type="number"
            name="inspection_engineer_id"
            value={formData.inspection_engineer_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
