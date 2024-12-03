import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateConsultive = () => {
  const [projectId, setProjectId] = useState("");  
  const [consultiveId, setConsultiveId] = useState("");  
  const [projects, setProjects] = useState([]);  
  const [consultives, setConsultives] = useState([]);  
  const [message, setMessage] = useState("");  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.status === 200) {
          setProjects(result.data);
        } else {
          setMessage("Failed to fetch projects.");
        }
      } catch (error) {
        setMessage("Error fetching projects.");
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchConsultives = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getProjectConsultives", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.status === 200) {
          setConsultives(result.data);
        } else {
          setMessage("Failed to fetch consultives.");
        }
      } catch (error) {
        setMessage("Error fetching consultives.");
      }
    };

    fetchConsultives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      project_id: projectId,
      consultive_id: consultiveId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://inout-api.octopusteam.net/api/front/addProjectConsultive", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === 200) {
        setMessage("Consultive added successfully!");
        navigate("/customers/consaltative");
      } else {
        setMessage("Failed to add consultive.");
      }
    } catch (error) {
      setMessage("Error submitting the form.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Create Project Consultive</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-5">
        {message && <div className="text-center mb-4 text-red-500">{message}</div>}

        <div className="mb-4">
          <label htmlFor="project_id" className="block text-lg font-semibold">Select Project</label>
          <select
            id="project_id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="consultive_id" className="block text-lg font-semibold">Select Consultive</label>
          <select
            id="consultive_id"
            value={consultiveId}
            onChange={(e) => setConsultiveId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a consultive</option>
            {consultives.map((consultive) => (
              <option key={consultive.id} value="m02">
                Consultive ID: m02
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 text-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConsultive;
