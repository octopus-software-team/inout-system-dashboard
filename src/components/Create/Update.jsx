import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
  const { id } = useParams();
  const [inputData, setInputData] = useState({
    id: "",
    name: "",
    phoneNumber: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3030/users/${id}`)
      .then((res) => setInputData(res.data))
      .catch((err) => console.error("Error fetching user data:", err));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3030/users/${id}`, inputData)
      .then((res) => {
        alert("Data updated successfully");
        navigate("/company/addservices");
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        alert("Failed to update data. Please try again.");
      });
  };

  return (
    <div className="container bg-gray-100  mt-20 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Updated Page
        </h2>

        <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-gray-700 font-semibold mb-2"
          >
            Id
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Your Id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={inputData.id}
            onChange={(e) =>
              setInputData({ ...inputData, id: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={inputData.name}
            onChange={(e) =>
              setInputData({ ...inputData, name: e.target.value })
            }
          />
        </div>


        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 font-semibold mb-2"
          >
            Phone Number
          </label>
          <input
            type="phoneNumber"
            id="phoneNumber"
            name="v"
            placeholder="Your phone Number"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={inputData.phoneNumber}
            onChange={(e) =>
              setInputData({ ...inputData, phoneNumber: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default Update;
