import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import "dropify/dist/css/dropify.css";
import "dropify/dist/js/dropify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import QRCodeDisplay from "./QRCodeDisplay";

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
    notes: "",
    grade: "", // إضافة grade
    code: "", // إضافة code
    nationality_id: "", // إضافة nationality
  });

  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  const [errors, setErrors] = useState({});

  const [type, setType] = useState(0);

  const token = Cookies.get("token");

  const imageInputRef = useRef(null);

  const [qrCode, setQrCode] = useState(null);

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
        } else {
          toast.error(result.msg || "Failed to load branches.");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches. Please try again.");
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
          toast.error(result.msg || "Failed to load specialties.");
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Failed to load specialties. Please try again.");
      }
    };

    fetchBranches();
    fetchSpecialties();
  }, [token]);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [id]: files[0] });
    } else if (id === "contract_start_date" || id === "contract_end_date") {
      const formattedDate = value ? value : "";
      setFormData({ ...formData, [id]: formattedDate });
    } else {
      setFormData({ ...formData, [id]: value });
    }

    // مسح رسالة الخطأ للحقل الذي تم تغييره
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    // التحقق من الحقول المطلوبة
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
      "notes",
      "grade", // إضافة grade
      "code", // إضافة code
      "nationality", // إضافة nationality
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    // التحقق من صحة البريد الإلكتروني
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // التحقق من صحة رقم الهاتف
    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (numbers only).";
    }

    // التحقق من تطابق كلمة المرور
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password !== formData.password_confirmation
    ) {
      newErrors.password_confirmation = "Passwords do not match.";
    }

    // التحقق من أن مدة العقد رقم موجب
    if (formData.contract_duration && formData.contract_duration <= 0) {
      newErrors.contract_duration = "Duration must be a positive number.";
    }

    // تحديث حالة الأخطاء
    setErrors(newErrors);

    // إرجاع `true` إذا لم يكن هناك أخطاء
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
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
      console.log("API Response:", result);

      if (result.status === 200) {
        toast.success("Engineer added successfully.");
        setQrCode(result.data.qrcode);
        setTimeout(() => {
          navigate("/company/employees");
        }, 2000);
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
          contract_end_date: "",
          type: 0,
          notes: "",
        });
      } else if (result.status === 422) {
        // تحديث حالة الأخطاء لعرضها تحت الحقول
        const validationErrors = result.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" "); // تحويل المصفوفة إلى سلسلة نصية
        });
        setErrors(formattedErrors);
      } else {
        toast.error(result.msg || "Failed to add engineer. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while saving. Please check your input.");
    }
  };
  const handleAddSpecialty = async () => {
    if (!newSpecialty) {
      toast.error("Please enter a specialty name.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addEmployeesSpecials",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newSpecialty, type }), // إرسال name و type
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        toast.success("Specialty added successfully.");
        setSpecialties([...specialties, result.data]); // تحديث قائمة الخصائص
        setIsModalOpen(false); // إغلاق المودال
        setNewSpecialty(""); // مسح حقل الإدخال
        setType(0); // إعادة تعيين type إلى القيمة الافتراضية
      } else {
        toast.error(result.msg || "Failed to add specialty.");
      }
    } catch (error) {
      console.error("Error adding specialty:", error);
      toast.error("Failed to add specialty. Please try again.");
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // if (!validateForm()) {
  //   toast.error("Please fix the errors in the form.");
  //   return;
  // }

  const [nationalities, setNationalities] = useState([]);

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
          toast.error(result.msg || "Failed to load nationalities.");
        }
      } catch (error) {
        console.error("Error fetching nationalities:", error);
        toast.error("Failed to load nationalities. Please try again.");
      }
    };

    fetchNationalities();
  }, [token]);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-6">Add Employee</h1>

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
            placeholder="Name"
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex items-center">
            <select
              id="employee_special_id"
              value={formData.employee_special_id}
              onChange={handleChange}
              className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)} // فتح المودال عند الضغط
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              +
            </button>
          </div>
          {errors.employee_special_id && (
            <span className="text-red-500 text-xs">
              {errors.employee_special_id}
            </span>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Specialty</h2>

                {/* Specialization Name */}
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)} // تحديث حالة الـ newSpecialty
                  placeholder="Enter specialty name"
                  className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  required
                />

                {/* Specialization Type */}
                <select
                  value={type} // قيمة type من الـ state
                  onChange={(e) => setType(parseInt(e.target.value))} // تحديث حالة الـ type
                  className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                  <option value={0}>Engineer</option>
                  <option value={1}>Employee</option>
                </select>

                {/* Buttons */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)} // إغلاق المودال
                    className="mr-2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSpecialty} // حفظ الخاصية الجديدة
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs">{errors.gender}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="notes" className="mb-2 font-medium text-gray-700">
            Notes
          </label>
          <input
            type="text"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="notes"
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.notes && (
            <span className="text-red-500 text-xs">{errors.notes}</span>
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="font-medium text-gray-700"
          >
            Contract End Date
          </label>
          <input
            type="date"
            id="contract_end_date"
            value={formData.contract_end_date}
            onChange={handleChange}
            onBlur={() => formatDate(formData.contract_end_date)}
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Engineer</option>
            <option value="1">Employee</option>
            <option value="2">Worker</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="grade" className="mb-2 font-medium text-gray-700">
            Grade
          </label>
          <select
            id="grade"
            value={formData.grade}
            onChange={handleChange}
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Grade</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          {errors.grade && (
            <span className="text-red-500 text-xs">{errors.grade}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="code" className="mb-2 font-medium text-gray-700">
            Code
          </label>
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="User Code"
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.code && (
            <span className="text-red-500 text-xs">{errors.code}</span>
          )}
        </div>

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
            className="p-2 dark:text-white w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Nationality</option>
            {nationalities.map((nationality) => (
              <option key={nationality.id} value={nationality.id}>
                {nationality.name}
              </option>
            ))}
          </select>
          {errors.nationality && (
            <span className="text-red-500 text-xs">{errors.nationality}</span>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="image" className="mb-2 font-medium text-gray-700">
            Upload Image (Optional)
            <input
              type="file"
              id="image"
              ref={imageInputRef}
              accept="image/*"
              onChange={handleChange}
              className="img"
            />
          </label>
        </div>

        <div className="mt-4 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={false}
          >
            Save
          </button>
        </div>
      </form>

      {/* {qrCode && <QRCodeDisplay svgData={qrCode} />} */}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddEngineer;
