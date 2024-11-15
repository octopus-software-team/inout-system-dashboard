import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Create = () => {
  const [inputData, setInoutData] = useState({
    id: "",
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Input Data:", inputData);

    axios
      .post("http://localhost:3030/users", inputData)
      .then((res) => {
        console.log("Response:", res); 

        toast.success("Data Posted Successfully!");

        setTimeout(() => {
          navigate("/company/services");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Failed to post data!"); 
        console.error("Error posting data:", error);
      });
  };

  return (
    <div className="flex items-center justify-center mt-40 relative">
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded  w-10/12"
      >
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Add Branch
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
            placeholder="Your id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={(e) => setInoutData({ ...inputData, id: e.target.value })}
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
            onChange={(e) =>
              setInoutData({ ...inputData, name: e.target.value })
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
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Your Phone Number"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={(e) =>
              setInoutData({ ...inputData, phoneNumber: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Create;
