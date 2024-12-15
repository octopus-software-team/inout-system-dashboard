import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const CreateSpecialise = () => {
  const [name, setName] = useState(""); // اسم التخصص
  const [type, setType] = useState(0); // نوع التخصص
  const [message, setMessage] = useState(""); // رسالة النجاح أو الخطأ
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // منع التحديث الافتراضي للنموذج
    const token = Cookies.get('token'); // جلب التوكن المخزن

    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    // إرسال الطلب إلى API
    fetch("https://inout-api.octopusteam.net/api/front/addEmployeesSpecials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
      },
      body: JSON.stringify({
        name,
        type,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create specialise.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          setMessage("Specialise added successfully.");
          setTimeout(() => {
            navigate("/employees/specials"); // العودة إلى صفحة التخصصات بعد الإضافة
          }, 1500);
        } else {
          setMessage("Failed to add specialise.");
        }
      })
      .catch((err) => {
        console.error("Error creating specialise:", err);
        setMessage("Error creating specialise. Please try again.");
      });
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-center font-bold text-2xl mb-5">Create Specialise</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        {/* اسم التخصص */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Specialise Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter specialise name"
            required
          />
        </div>

        {/* نوع التخصص */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={0}>General</option>
            <option value={1}>Special</option>
          </select>
        </div>

        {/* زر الإرسال */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>

      {/* رسالة النجاح أو الخطأ */}
      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default CreateSpecialise;
