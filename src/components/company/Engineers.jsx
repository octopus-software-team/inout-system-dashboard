import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import "dropify/dist/css/dropify.css";
import "dropify/dist/js/dropify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const AddEngineer = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    contract_duration: "",
    phone: "",
    branch_id: "",
    employee_special_id: "",
    date_of_birth: "",
    gender: "",
    image: null,
    experience: "",
    contract_start_date: "",
    contract_end_date: "",
    type: 0,
  });

  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const token = Cookies.get('token');

  const imageInputRef = useRef(null);

  const formatDate = (date) => {
    if (date) {
      const dateParts = date.split("-");
      return `${dateParts[1]}-${dateParts[2]}-${dateParts[0].slice(2)}`;
    }
    return date;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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

    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployeesSpecials",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    if (imageInputRef.current) {
      $(imageInputRef.current).dropify({
        messages: {
          default: "Drag and drop a file here or click",
          replace: "Drag and drop or click to replace",
          remove: "Remove",
          error: "Ooops, something wrong happened.",
        },
      });

      $(imageInputRef.current).on("change", function (event) {
        const files = event.target.files;
        if (files && files[0]) {
          setFormData({ ...formData, image: files[0] });
        } else {
          setFormData({ ...formData, image: null });
        }
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    if (id === "contract_start_date" || id === "contract_end_date") {
      const formattedDate = value ? value : "";
      setFormData({ ...formData, [id]: formattedDate });
    } else if (type !== "file") {
      setFormData({ ...formData, [id]: value });
    }

    // Clear error for this field when user modifies it
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Required fields check
    const requiredFields = [
      "full_name",
      "email",
      "password",
      "password_confirmation",
      "contract_duration",
      "phone",
      "branch_id",
      "employee_special_id",
      "date_of_birth",
      "gender",
      "experience",
      "contract_start_date",
      "contract_end_date",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    // Email validation
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password confirmation validation
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password !== formData.password_confirmation
    ) {
      newErrors.password_confirmation = "Passwords do not match.";
    }

    // Contract duration validation
    if (formData.contract_duration && formData.contract_duration <= 0) {
      newErrors.contract_duration = "Duration must be a positive number.";
    }

    // Return true if no errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // if (!validateForm()) {
    //   setLoading(false);
    //   return;
    // }

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
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        toast.success("Employee added successfully");
        navigate("company/employees");

        setFormData({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          password_confirmation: "",
          contract_duration: "",
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
      }

      setErrors(result.data);
    } catch (error) {
      console.error(error);
      setMessage("Error occurred while saving. Please check your input.");
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-6">Add Employee</h1>

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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.full_name && (
            <span className="text-red-500 text-xs">{errors.full_name}</span>
          )}
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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password_confirmation"
            className="mb-2 font-medium text-gray-700"
          >
            Password Confirmation
          </label>
          <input
            type="password"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="password_confirmation"
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password_confirmation && (
            <span className="text-red-500 text-xs">
              {errors.password_confirmation}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contract_duration"
            className="mb-2 font-medium text-gray-700"
          >
            Duration (months)
          </label>
          <input
            type="number"
            id="contract_duration"
            value={formData.contract_duration}
            onChange={handleChange}
            placeholder="duration"
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contract_duration && (
            <span className="text-red-500 text-xs">
              {errors.contract_duration}
            </span>
          )}
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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <span className="text-red-500 text-xs">{errors.phone}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="branch_id" className="mb-2 font-medium text-gray-700">
            Branch
          </label>
          <select
            id="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch_id && (
            <span className="text-red-500 text-xs">{errors.branch_id}</span>
          )}
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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
          {errors.employee_special_id && (
            <span className="text-red-500 text-xs">
              {errors.employee_special_id}
            </span>
          )}
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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date_of_birth && (
            <span className="text-red-500 text-xs">{errors.date_of_birth}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="0">male</option>
            <option value="1">female</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs">{errors.gender}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="mb-2 font-medium text-gray-700"
          >
            Experience
          </label>
          <input
            type="text"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.experience && (
            <span className="text-red-500 text-xs">{errors.experience}</span>
          )}
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
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contract_start_date && (
            <span className="text-red-500 text-xs">
              {errors.contract_start_date}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="contract_end_date"
            className=" font-medium text-gray-700"
          >
            Contract End Date
          </label>
          <input
            type="date"
            id="contract_end_date"
            value={formData.contract_end_date}
            onChange={handleChange}
            onBlur={() => formatDate(formData.contract_end_date)}
            className="p-2  dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contract_end_date && (
            <span className="text-red-500 text-xs">
              {errors.contract_end_date}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full  dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Engineer</option>
            <option value="1">Employee</option>
          </select>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="image" className="mb-2 font-medium text-gray-700">
            Upload Image
            <input
              hidden
              type="file"
              id="image"
              ref={imageInputRef}
              accept="image/*"
              className="img"
            />
          </label>
        </div>

        <div className="mt-4 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Engineer"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddEngineer;
