// src/components/ViewEmployee.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

// استيراد Dropify أو الاستغناء عنه إذا لم نحتاج لرفع الملفات
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
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
          const employee = result.data.find(
            (emp) => emp.id === parseInt(id, 10)
          );

          if (employee) {
            setEmployeeData(employee);
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
        setLoading(false);
      }
    };

    fetchBranches();
    fetchSpecialties();
    fetchEmployeeData();
  }, [token, id, navigate]);

  // تهيئة Dropify إذا احتجت لعرض صورة الموظف (Avatar) بصيغة مرفوعة
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl text-center font-bold mb-6 mt-56">
          View Employee
        </h1>
        <p className="text-center">Loading employee data...</p>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">View Employee</h1>
        <p>No data found for this employee.</p>
      </div>
    );
  }

  // تفكيك خصائص الموظف
  const {
    full_name,
    email,
    phone,
    branch_id,
    employee_special_id,
    date_of_birth,
    gender,
    experience,
    contract_start_date,
    contract_duration,
    contract_end_date,
    type,
    notes,
    image,
  } = employeeData;

  const branchName = branches.find((b) => b.id === branch_id)?.name || "N/A";
  const specialtyName =
    specialties.find((s) => s.id === employee_special_id)?.name || "N/A";
  const typeDisplay = type === 0 ? "Engineer" : "Employee";
  const genderDisplay = gender === 1 ? "Female" : "Male";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <ToastContainer />

      <div className="w-full mx-4 rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r  p-6">
          <h1 className="text-3xl font-bold text-black text-center">
            Employee Details
          </h1>
        </div>

        {/* Employee Image and Name */}
        <div className="flex flex-col items-center py-8">
          {image ? (
            <img
              src={image}
              alt="Employee Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold text-gray-800">{full_name}</p>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Phone */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Phone</label>
            <p className="text-lg font-medium text-gray-800">
              {phone || "N/A"}
            </p>
          </div>

          {/* Branch */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Branch</label>
            <p className="text-lg font-medium text-gray-800">{branchName}</p>
          </div>

          {/* Specialty */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Specialty</label>
            <p className="text-lg font-medium text-gray-800">{specialtyName}</p>
          </div>

          {/* Date of Birth */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Date of Birth</label>
            <p className="text-lg font-medium text-gray-800">
              {date_of_birth || "N/A"}
            </p>
          </div>

          {/* Gender */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Gender</label>
            <p className="text-lg font-medium text-gray-800">{genderDisplay}</p>
          </div>

          {/* Experience */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Experience</label>
            <p className="text-lg font-medium text-gray-800">
              {experience || "N/A"}
            </p>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Notes</label>
            <p className="text-lg font-medium text-gray-800">
              {notes || "N/A"}
            </p>
          </div>

          {/* Contract Start Date */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Contract Start Date</label>
            <p className="text-lg font-medium text-gray-800">
              {contract_start_date || "N/A"}
            </p>
          </div>

          {/* Contract Duration */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">
              Contract Duration (months)
            </label>
            <p className="text-lg font-medium text-gray-800">
              {contract_duration || "N/A"}
            </p>
          </div>

          {/* Contract End Date */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Contract End Date</label>
            <p className="text-lg font-medium text-gray-800">
              {contract_end_date || "N/A"}
            </p>
          </div>

          {/* Type */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-500">Type</label>
            <p className="text-lg font-medium text-gray-800">{typeDisplay}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => navigate("/company/employees")}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Back to Employees List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
