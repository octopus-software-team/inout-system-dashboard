import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateConsultive = () => {
  const [projectId, setProjectId] = useState("");  // لحفظ project_id
  const [consultiveId, setConsultiveId] = useState("");  // لحفظ consultive_id
  const [message, setMessage] = useState("");  // لحفظ الرسالة
  const navigate = useNavigate();  // استخدام useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      project_id: projectId,
      consultive_id: consultiveId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://inout-api.octopusteam.net/api/front/addProjectConsultive", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,  // إضافة التوكن إلى الهيدر
          "Content-Type": "application/json",  // تحديد نوع المحتوى
        },
        body: JSON.stringify(data),  // إرسال البيانات كـ JSON
      });

      const result = await response.json();
      if (result.status === 200) {
        setMessage("Consultive added successfully!");
        // بعد إضافة الاستشارة بنجاح، نقوم بتوجيه المستخدم إلى صفحة customers/consultative
        navigate("/customers/consaltative");
      } else {
        setMessage("Failed to add consultive.");
      }
    } catch (error) {
      setMessage("Error submitting the form.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Create Project Consultive</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-5">
        {message && <div className="text-center mb-4 text-red-500">{message}</div>}

        {/* Project ID Input */}
        <div className="mb-4">
          <label htmlFor="project_id" className="block text-lg font-semibold">Project ID</label>
          <input
            type="number"
            id="project_id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter project ID"
          />
        </div>

        {/* Consultive ID Input */}
        <div className="mb-4">
          <label htmlFor="consultive_id" className="block text-lg font-semibold">Consultive ID</label>
          <input
            type="number"
            id="consultive_id"
            value={consultiveId}
            onChange={(e) => setConsultiveId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter consultive ID"
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4 text-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConsultive;
