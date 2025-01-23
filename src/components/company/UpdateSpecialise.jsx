import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { Toaster, toast } from 'react-hot-toast'; // استيراد Toaster و toast من react-hot-toast

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
      toast.error("No token found. Please log in."); // استخدام toast من react-hot-toast
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
        toast.success("Employee updated successfully!", { duration: 4000 }); // زيادة مدة ظهور التوست
        setTimeout(() => {
          navigate("/company/employeespecialise");
        }, 2000); // تأخير إعادة التوجيه
      } else {
        setError(result.msg || "Failed to update employee.");
        toast.error(result.msg || "Failed to update employee.", { duration: 4000 }); // زيادة مدة ظهور التوست
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setError("Error updating employee.");
      toast.error("Error updating employee.", { duration: 4000 }); // زيادة مدة ظهور التوست
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg max-w-2xl">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999, // التأكد من ظهور التوست فوق كل العناصر
          },
        }}
      />
      <h2 className="text-center font-bold text-3xl mb-8 text-gray-800">Update Employee Specialisation</h2>

      {isLoading && (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={employeeData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter employee name"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Employee Type</label>
          <select
            id="type"
            name="type"
            value={employeeData.type}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            <option value={0}>Engineer</option>
            <option value={1}>Employee</option>
            <option value={2}>Worker</option> {/* Added Worker Option */}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 hover:shadow-md transform hover:scale-105 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSpecialise;