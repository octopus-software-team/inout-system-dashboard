import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { FaSpinner } from "react-icons/fa"; 
import toast, { Toaster } from "react-hot-toast";

const EditConsultive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: 2,
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل
  const [errors, setErrors] = useState({}); // حالة الأخطاء

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://inout-api.octopusteam.net/api/front/getCustomers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await response.json();

        if (res.data) {
          const consultiveData = res.data.find(
            (item) => item.id === parseInt(id)
          );
          if (consultiveData) {
            if (consultiveData.type !== 2) {
              consultiveData.type = 2;
            }
            setFormData(consultiveData);
          } else {
            toast.error("Consultative not found.");
            navigate("/consultatives"); // إعادة التوجيه إلى قائمة الاستشاريين
          }
        } else {
          toast.error("No data found.");
        }
      } catch (err) {
        console.error("Error fetching consultive data:", err);
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // بدء حالة التحميل
    setErrors({}); // إعادة تعيين الأخطاء

    const token = Cookies.get('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      setIsLoading(false);
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
      return;
    }

    // التحقق من الحقول المطلوبة
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("All fields are required.");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    const updatedFormData = { ...formData, type: 2 };

    try {
      const response = await fetch(`https://inout-api.octopusteam.net/api/front/updateCustomer/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const res = await response.json();

      if (res.status === 200) {
        toast.success("Updated successfully");
        setTimeout(() => {
          navigate("/customers/consaltative");
        }, 2000);
      } else if (response.status === 422) {
        const validationErrors = res.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" ");
        });
        setErrors(formattedErrors);
        toast.error("Please fix the highlighted errors.");
      } else {
        toast.error("Failed to update.");
      }
    } catch (err) {
      console.error("Error updating consultive:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // إنهاء حالة التحميل
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
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
      <h2 className="text-center font-bold text-2xl text-gray-800 mb-6">
        Edit Consultative
      </h2>

      <form onSubmit={handleSubmit} className="service max-w-lg mx-auto p-6 rounded-lg shadow-md">
        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`border border-gray-300 rounded-lg px-4 py-2 w-full mt-2 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.name ? "border-red-500" : ""
            }`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`border border-gray-300 rounded-lg px-4 py-2 w-full mt-2 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.email ? "border-red-500" : ""
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`border border-gray-300 rounded-lg px-4 py-2 w-full mt-2 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.phone ? "border-red-500" : ""
            }`}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="my-4">
          <input type="hidden" name="type" value={formData.type} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-400 w-full mt-6 transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed flex items-center justify-center" : ""
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditConsultive;
