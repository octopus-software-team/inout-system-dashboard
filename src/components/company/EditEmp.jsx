import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import toast, { Toaster } from "react-hot-toast";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
// import { ToastContainer } from "react-toastify";
// import toast, { Toaster } from "react-hot-toast";

const EditEmp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");
  const [nationalities, setNationalities] = useState([]);

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
    notes: "",
    nationality_id: "", // إضافة nationality
    grade: "", // إضافة grade
    password: "", // إضافة password
    password_confirmation: "", // إضافة password_confirmation
  });

  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getNationalities",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setNationalities(result.data);
        } else {
          console.error("Error fetching nationalities:", result.msg);
          toast.error(result.msg || "Failed to fetch nationalities.");
        }
      } catch (error) {
        console.error("Error fetching nationalities:", error);
        toast.error("Error fetching nationalities.");
      }
    };

    fetchNationalities();
  }, [token]);
  // Reference to the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }

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
        } else {
          console.error("Error fetching branches:", result.msg);
          toast.error(result.msg || "Failed to fetch branches.");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Error fetching branches.");
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
        } else {
          console.error("Error fetching specialties:", result.msg);
          toast.error(result.msg || "Failed to fetch specialties.");
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Error fetching specialties.");
      }
    };

    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployees",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response from the server.");
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.status === 200) {
          // Find the employee with the matching ID
          const employee = result.data.find(
            (emp) => emp.id === parseInt(id, 10)
          );
          if (employee) {
            setFormData({
              full_name: employee.full_name || "",
              email: employee.email || "",
              phone: employee.phone || "",
              branch_id: employee.branch_id || "",
              employee_special_id: employee.employee_special_id || "",
              date_of_birth: employee.date_of_birth || "",
              gender: employee.gender === 1 ? "female" : "male",
              image: null, // Handle image separately
              experience: employee.experience || "",
              contract_start_date: employee.contract_start_date || "",
              contract_duration: employee.contract_duration || "",
              contract_end_date: employee.contract_end_date || "",
              type: employee.type || 0,
              notes: employee.notes || "",
              nationality: employee.nationality || "", // تعيين nationality
              grade: employee.grade || "", // تعيين grade
            });
            // Initialize Dropify with the existing image
            if (fileInputRef.current) {
              $(fileInputRef.current).dropify({
                defaultFile: employee.image || "",
                messages: {
                  default: "Drag and drop a file here or click",
                  replace: "Drag and drop or click to replace",
                  remove: "Remove",
                  error: "Ooops, something wrong appended.",
                },
                error: {
                  fileSize: "The file size is too big ({{ value }} max).",
                  minWidth: "The image width is too small ({{ value }}px min).",
                  maxWidth: "The image width is too big ({{ value }}px max).",
                  minHeight:
                    "The image height is too small ({{ value }}px min).",
                  maxHeight: "The image height is too big ({{ value }}px max).",
                  imageFormat:
                    "The image format is not allowed ({{ value }} only).",
                },
              });
            }
          } else {
            throw new Error("Requested employee not found.");
          }
        } else {
          console.error("Error fetching employee data:", result.msg);
          toast.error(result.msg || "Failed to fetch employee data.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error(error.message || "Error fetching employee data.");
      } finally {
        setLoading(false); // End loading state
      }
    };
    fetchBranches();
    fetchSpecialties();
    fetchEmployeeData();
  }, [token, id, navigate]);

  useEffect(() => {
    if (fileInputRef.current) {
      $(fileInputRef.current).dropify();
    }

    return () => {
      if (fileInputRef.current) {
        const drEvent = $(fileInputRef.current).data("dropify");
        if (drEvent) {
          drEvent.destroy();
        }
      }
    };
  }, []);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [id]: files[0] });
    } else {
      if (id === "contract_start_date" || id === "contract_end_date") {
        const formattedDate = value ? value : "";
        setFormData({ ...formData, [id]: formattedDate });
      } else {
        setFormData({ ...formData, [id]: value });
      }
    }
  };
  const validate = () => {
    const newErrors = {};

    // التحقق من الحقول الحالية
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Employee name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.phone.toString().trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.branch_id) {
      newErrors.branch_id = "Please select a branch.";
    }

    if (!formData.employee_special_id) {
      newErrors.employee_special_id = "Please select a specialty.";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required.";
    }

    if (!formData.contract_start_date) {
      newErrors.contract_start_date = "Contract start date is required.";
    }

    if (!formData.contract_duration) {
      newErrors.contract_duration = "Contract duration is required.";
    }

    if (!formData.contract_end_date) {
      newErrors.contract_end_date = "Contract end date is required.";
    }

    // التحقق من الحقول الجديدة
    if (!formData.nationality.trim()) {
      newErrors.nationality = "Nationality is required.";
    }

    if (!formData.grade) {
      newErrors.grade = "Please select a grade.";
    }

    // التحقق من كلمة المرور
    if (formData.password && !formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password.";
    }

    if (formData.password && formData.password_confirmation) {
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "gender") {
          // Convert gender from text to number
          const genderValue = value === "female" ? 1 : 0;
          formDataToSend.append(key, genderValue);
        } else if (key === "image" && value) {
          formDataToSend.append(key, value);
        } else if (value) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateEmployee/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Employee updated successfully.");
        setTimeout(() => {
          navigate("/company/employees");
        }, 2000);
      } else {
        toast.error(result.msg || "Error updating employee.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("An error occurred while saving. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto p-6">
  //       <h1 className="text-2xl font-bold mb-6 text-center mt-8">
  //         Edit Employee
  //       </h1>
  //       <p className="text-center mt-56">Loading</p>
  //     </div>
  //   );
  // }

  return (
    <div className="mx-auto p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            width: "350px",
            height: "80px",
            fontSize: "1.2rem",
          },
        }}
      />
      <h1 className="text-2xl font-bold mb-6 text-center ">Edit Employee</h1>

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
            placeholder="Employee Name"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Password Confirmation */}
        <div className="flex flex-col">
          <label
            htmlFor="password_confirmation"
            className="mb-2 font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password_confirmation
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Branch */}
        <div className="flex flex-col">
          <label htmlFor="branch_id" className="mb-2 font-medium text-gray-700">
            Branch
          </label>
          <select
            id="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.branch_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch_id && (
            <p className="text-red-500 text-sm">{errors.branch_id}</p>
          )}
        </div>

        {/* Specialty */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employee_special_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
          {errors.employee_special_id && (
            <p className="text-red-500 text-sm">{errors.employee_special_id}</p>
          )}
        </div>

        {/* Date of Birth */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date_of_birth ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Experience */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm">{errors.experience}</p>
          )}
        </div>

        {/* Contract Start Date */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contract_start_date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contract_start_date && (
            <p className="text-red-500 text-sm">{errors.contract_start_date}</p>
          )}
        </div>

        {/* notes */}
        <div className="flex flex-col">
          <label htmlFor="notes" className="mb-2 font-medium text-gray-700">
            notes
          </label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="notes"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.notes ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes}</p>
          )}
        </div>

        {/* Contract Duration */}
        <div className="flex flex-col">
          <label
            htmlFor="contract_duration"
            className="mb-2 font-medium text-gray-700"
          >
            Contract Duration (months)
          </label>
          <input
            type="number"
            id="contract_duration"
            value={formData.contract_duration}
            onChange={handleChange}
            placeholder="Contract Duration"
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contract_duration ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contract_duration && (
            <p className="text-red-500 text-sm">{errors.contract_duration}</p>
          )}
        </div>

        {/* Contract End Date */}
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
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contract_end_date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contract_end_date && (
            <p className="text-red-500 text-sm">{errors.contract_end_date}</p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label htmlFor="type" className="font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full dark:bg-slate-900 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="0">Engineer</option>
            <option value="1">Employee</option>
            <option value="2">Worker</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        {/* Nationality */}
        {/* Nationality */}
        <div className="flex flex-col">
          <label
            htmlFor="nationality"
            className="mb-2 font-medium text-gray-700"
          >
            Nationality
          </label>
          <select
            id="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nationality ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Nationality</option>
            {nationalities.map((nationality) => (
              <option key={nationality.id} value={nationality.name}>
                {nationality.name}
              </option>
            ))}
          </select>
          {errors.nationality && (
            <p className="text-red-500 text-sm">{errors.nationality}</p>
          )}
        </div>

        {/* Grade */}
        <div className="flex flex-col">
          <label htmlFor="grade" className="mb-2 font-medium text-gray-700">
            Grade
          </label>
          <select
            id="grade"
            value={formData.grade}
            onChange={handleChange}
            className={`p-2 dark:bg-slate-900 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.grade ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Grade</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          {errors.grade && (
            <p className="text-red-500 text-sm">{errors.grade}</p>
          )}
        </div>

        {/* Image */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="image" className="mb-2 font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            onChange={handleChange}
            className="dropify"
            data-default-file={formData.image || ""}
            data-show-remove="true"
            data-allowed-file-extensions="jpg jpeg png webp"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>

        <div className="flex col-span-2">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmp;
