import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    branch_id: "",
    project_owner_id: "",
    project_owner_type: "",  // إضافة حقل نوع الـ Owner
    customer_constructor_id: "",
    inspection_date: "",
    inspection_time: "",
    notes: "",
    inspection_location_lat: "",
    inspection_location_long: "",
    status: "",
    inspection_engineer_id: "",
  });

  const [branches, setBranches] = useState([]); // State to hold the branches data
  const [owners, setOwners] = useState([]); // State to hold the owners data

  useEffect(() => {
    // Fetch branches data on component mount
    const fetchBranches = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          setBranches(data.data); // Set the branches data in the state
        } else {
          console.error("Failed to fetch branches");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    // Fetch owners data on component mount
    const fetchOwners = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/addCustomer", {
          method: "GET", // Or use an appropriate GET or POST if needed to fetch owner data
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          setOwners(data.data); // Set the owners data in the state
        } else {
          console.error("Failed to fetch owners");
        }
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchBranches();
    fetchOwners();
  }, []);

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
        } else {
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
          <label className="block font-semibold">Branch</label>
          <select
            name="branch_id"
            value={formData.branch_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Project Owner</label>
          <select
            name="project_owner_type"
            value={formData.project_owner_type}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          >
            <option value="">Select Project Owner Type</option>
            <option value="1">Owner</option>
            <option value="0">Client</option>
            <option value="2">Consultant</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Project Owner ID</label>
          <select
            name="project_owner_id"
            value={formData.project_owner_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            required
          >
            <option value="">Select Project Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
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

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2">Create Project</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
