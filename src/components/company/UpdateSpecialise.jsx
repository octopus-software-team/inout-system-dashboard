import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

const UpdateSpecialise = () => {
  const [employeeData, setEmployeeData] = useState({
    id: "",
    name: "",
    type: 0, // Default to Engineer (0)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the employee data passed through navigation state
  useEffect(() => {
    if (location.state) {
      setEmployeeData(location.state); // This sets the state with the passed employee data
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateEmployeesSpecials/${employeeData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: employeeData.name,
            type: parseInt(employeeData.type), // Ensure type is an integer
          }),
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        alert("Employee updated successfully!");
        navigate("/company/employeespecialise");
      } else {
        setError(result.msg || "Failed to update employee.");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setError("Error updating employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-5 p-4">
      <h2 className="text-center font-bold text-2xl mb-5">Update Employee Specialisation</h2>

      {isLoading && (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label htmlFor="name" className="block font-semibold">Employee Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={employeeData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter employee name"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block font-semibold">Employee Type</label>
          <select
            id="type"
            name="type"
            value={employeeData.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value={0}>Engineer</option>
            <option value={1}>Employee</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSpecialise;
