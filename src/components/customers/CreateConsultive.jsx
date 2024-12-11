import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateConsultive = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 2, // Consultant by default
  });

  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    fetch('https://inout-api.octopusteam.net/api/front/addCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert('Consultative added successfully');
          navigate("/customers/consaltative");
          setFormData({
            name: '',
            email: '',
            phone: '',
            type: 2, 
          });
          setErrors({}); 
        } else {
          setErrors(data.data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Create Consultative</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-5">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-800 dark:text-white text-lg font-semibold">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-800 text-lg dark:text-white font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-800 text-lg dark:text-white font-semibold">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
        </div>

        <input
          type="hidden"
          id="type"
          name="type"
          value={formData.type}
        />

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Create Consultative
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConsultive;
