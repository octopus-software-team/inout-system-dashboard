import React, { useState } from "react";

const AddEngineer = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    branch_id: "",
    employee_special_id: "",
    date_of_birth: "",
    gender: "",
    image: null,
    experience: "",
    contract_start_date: "",
    contract_duration: "",
    contract_end_date: "",
    type: 0,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [id]: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const formatDate = (id) => {
    if (formData[id]) {
      const dateParts = formData[id].split("-");
      const formattedDate = `${dateParts[1]}-${dateParts[2]}-${dateParts[0].slice(2)}`;
      setFormData({ ...formData, [id]: formattedDate });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addEmployee",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN", // استبدل بـ التوكين الصحيح
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok && result.status === 200) {
        setMessage("Engineer added successfully!");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          branch_id: "",
          employee_special_id: "",
          date_of_birth: "",
          gender: "",
          image: null,
          experience: "",
          contract_start_date: "",
          contract_duration: "",
          contract_end_date: "",
          type: 0,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage("Error adding engineer, please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error occurred while saving. Please check your input.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

      {message && (
        <div className="mb-4 p-3 text-white bg-blue-500 rounded-lg">
          {message}
        </div>
      )}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="full_name" className="mb-2 font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Engineer Name"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-2 font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="branch_id" className="mb-2 font-medium text-gray-700">
            Branch ID
          </label>
          <input
            type="number"
            id="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            placeholder="Branch ID"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="employee_special_id"
            className="mb-2 font-medium text-gray-700"
          >
            Specialty
          </label>
          <input
            type="number"
            id="employee_special_id"
            value={formData.employee_special_id}
            onChange={handleChange}
            placeholder="Specialty ID"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="date_of_birth"
            className="mb-2 font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="image" className="mb-2 font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleChange}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="mb-2 font-medium text-gray-700"
          >
            Experience
          </label>
          <textarea
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Engineer Experience"
            rows="5"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contract_start_date"
            className="mb-2 font-medium text-gray-700"
          >
            Contract Start Date
          </label>
          <input
            type="date"
            id="contract_start_date"
            value={formData.contract_start_date}
            onChange={handleChange}
            onBlur={() => formatDate("contract_start_date")}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contract_duration"
            className="mb-2 font-medium text-gray-700"
          >
            Contract Duration (in months)
          </label>
          <input
            type="number"
            id="contract_duration"
            value={formData.contract_duration}
            onChange={handleChange}
            placeholder="Contract Duration in Months"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contract_end_date"
            className="mb-2 font-medium text-gray-700"
          >
            Contract End Date
          </label>
          <input
            type="date"
            id="contract_end_date"
            value={formData.contract_end_date}
            onChange={handleChange}
            onBlur={() => formatDate("contract_end_date")}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="p-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Saving..." : "Add "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEngineer;
