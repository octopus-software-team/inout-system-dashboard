import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';


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

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    fetch(`https://inout-api.octopusteam.net/api/front/getCustomers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
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
            alert("Consultative not found.");
          }
          setLoading(false);
        } else {
          alert("No data found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching consultive data:", err);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const updatedFormData = { ...formData, type: 2 };

    fetch(`https://inout-api.octopusteam.net/api/front/updateCustomer/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          alert("Updated successfully");
          navigate("/consultatives");
        } else {
          alert("Failed to update.");
        }
      })
      .catch((err) => console.error("Error updating consultive:", err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-gray-800 mb-6">
        Edit Consultative
      </h2>

      <form onSubmit={handleSubmit} className="service max-w-lg mx-auto  p-6 rounded-lg shadow-md">
        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
            required
          />
        </div>

        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
            required
          />
        </div>

        <div className="my-4">
          <label className="block text-lg font-semibold text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
            required
          />
        </div>

        <div className="my-4">
          <input type="hidden" name="type" value={formData.type} />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-400 w-full mt-6"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditConsultive;
