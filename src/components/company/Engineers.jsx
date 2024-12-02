import React, { useState, useEffect } from "react";

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

  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // الحصول على التوكن من localStorage
  const token = localStorage.getItem("token");

  const formatDate = (date) => {
    if (date) {
      const dateParts = date.split("-");
      return `${dateParts[1]}-${dateParts[2]}-${dateParts[0].slice(2)}`;
    }
    return date;
  };

  useEffect(() => {
    // Fetch branches data
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // أضف التوكن هنا
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setBranches(result.data);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    // Fetch specialties data
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployeesSpecials",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // أضف التوكن هنا
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setSpecialties(result.data);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchBranches();
    fetchSpecialties();
  }, [token]);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [id]: files[0] });
    } else {
      // إذا كان الحقل من نوع تاريخ تأكد من تنسيقه بشكل صحيح
      if (id === "contract_start_date" || id === "contract_end_date") {
        const formattedDate = value ? value : ""; // التأكد من أن القيمة لا تصبح فارغة
        setFormData({ ...formData, [id]: formattedDate });
      } else {
        setFormData({ ...formData, [id]: value });
      }
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
            Authorization: `Bearer ${token}`, // أضف التوكن هنا
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="branch_id" className="mb-2 font-medium text-gray-700">
            Branch
          </label>
          <select
            id="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="employee_special_id"
            className="mb-2 font-medium text-gray-700"
          >
            Specialty
          </label>
          <select
            id="employee_special_id"
            value={formData.employee_special_id}
            onChange={handleChange}
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="0">male</option>
            <option value="1">female</option>
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
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="mb-2 font-medium text-gray-700"
          >
            Experience
          </label>
          <input
            type="textArea"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            onBlur={() => formatDate(formData.contract_start_date)}
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onBlur={() => formatDate(formData.contract_end_date)}
            className="p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Engineer</option>
            <option value="1">Employee</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Engineer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEngineer;
