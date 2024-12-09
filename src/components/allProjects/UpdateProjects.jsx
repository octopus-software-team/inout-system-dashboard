import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [branches, setBranches] = useState([]);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch project data
        const projectsRes = await fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const projectsData = await projectsRes.json();
        if (projectsData.status !== 200) {
          throw new Error(projectsData.msg || "Failed to fetch projects.");
        }
        const project = projectsData.data.find((item) => item.id === parseInt(id));
        if (!project) {
          throw new Error("Project not found");
        }

        // Fetch branches
        const branchesRes = await fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const branchesData = await branchesRes.json();
        if (branchesData.status !== 200) {
          throw new Error(branchesData.msg || "Failed to fetch branches.");
        }

        // Fetch owners
        const ownersRes = await fetch("https://inout-api.octopusteam.net/api/front/getOwners", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const ownersData = await ownersRes.json();
        if (ownersData.status !== 200) {
          throw new Error(ownersData.msg || "Failed to fetch owners.");
        }

        // Fetch customers
        const customersRes = await fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const customersDataRes = await customersRes.json();
        if (customersDataRes.status !== 200) {
          throw new Error(customersDataRes.msg || "Failed to fetch customers.");
        }

        // Fetch engineers
        const engineersRes = await fetch("https://inout-api.octopusteam.net/api/front/getEngineers", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const engineersDataRes = await engineersRes.json();
        if (engineersDataRes.status !== 200) {
          throw new Error(engineersDataRes.msg || "Failed to fetch engineers.");
        }

        setBranches(branchesData.data);
        setOwners(ownersData.data);
        setCustomers(customersDataRes.data);
        setEngineers(engineersDataRes.data);

        const {
          id: projectId,
          name,
          branch_id,
          project_owner_id,
          customer_constructor_id,
          inspection_date,
          inspection_time,
          notes,
          status,
          inspection_engineer_id,
        } = project;

        setFormData({
          id: projectId || "",
          name: name || "",
          branch_id: branch_id || "",
          project_owner_id: project_owner_id || "",
          customer_constructor_id: customer_constructor_id || "",
          inspection_date: inspection_date || "",
          inspection_time: inspection_time || "",
          notes: notes || "",
          status: status !== undefined ? status : "",
          inspection_engineer_id: inspection_engineer_id || "",
        });

      } catch (err) {
        console.error(err);
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

  const handleSubmit = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    if (!formData.name) {
      alert("Please enter the project name");
      return;
    }

    setLoading(true);

    const {
      name,
      branch_id,
      project_owner_id,
      customer_constructor_id,
      inspection_date,
      inspection_time,
      notes,
      status,
      inspection_engineer_id
    } = formData;

    const updateBody = {
      name,
      branch_id,
      project_owner_id,
      customer_constructor_id,
      inspection_date,
      inspection_time,
      notes,
      status,
      inspection_engineer_id,
    };

    fetch(`https://inout-api.octopusteam.net/api/front/updateProject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateBody),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          alert("Project updated successfully!");
          navigate("/allprojects");
        } else {
          alert(`Failed to update project: ${res.msg}`);
        }
      })
      .catch((err) => setError(`Error updating project: ${err.message}`))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error text-red-500">{error}</div>;
  }

  return (
    <div className="container mt-5 max-w-xl mx-auto">
      <h2 className="text-center font-bold text-2xl mb-4">Update Project</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        {/* Project ID (read-only) */}
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-bold mb-2">
            Project ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2"
            disabled
          />
        </div>

        {/* Project Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Inspection Date */}
        <div className="mb-4">
          <label htmlFor="inspection_date" className="block text-sm font-bold mb-2">
            Inspection Date
          </label>
          <input
            type="date"
            id="inspection_date"
            name="inspection_date"
            value={formData.inspection_date}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Inspection Time */}
        <div className="mb-4">
          <label htmlFor="inspection_time" className="block text-sm font-bold mb-2">
            Inspection Time
          </label>
          <input
            type="time"
            id="inspection_time"
            name="inspection_time"
            value={formData.inspection_time}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-bold mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-bold mb-2">
            Status (0-10)
          </label>
          <input
            type="number"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Branch ID -> Branch Name */}
        <div className="mb-4">
          <label htmlFor="branch_id" className="block text-sm font-bold mb-2">
            Branch
          </label>
          <select
            id="branch_id"
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Project Owner ID -> Owner Name */}
        <div className="mb-4">
          <label htmlFor="project_owner_id" className="block text-sm font-bold mb-2">
            Project Owner
          </label>
          <select
            id="project_owner_id"
            name="project_owner_id"
            value={formData.project_owner_id}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Constructor ID -> Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer_constructor_id" className="block text-sm font-bold mb-2">
            Customer
          </label>
          <select
            id="customer_constructor_id"
            name="customer_constructor_id"
            value={formData.customer_constructor_id}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inspection Engineer ID -> Engineer Name */}
        <div className="mb-4">
          <label htmlFor="inspection_engineer_id" className="block text-sm font-bold mb-2">
            Inspection Engineer
          </label>
          <select
            id="inspection_engineer_id"
            name="inspection_engineer_id"
            value={formData.inspection_engineer_id}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Engineer</option>
            {engineers.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.full_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;
