import React, { useState } from "react";
import Select from "react-select";

const AddNewProject = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState(""); 


  
  const options = [
    { value: "service1", label: "Service 1" },
    { value: "service2", label: "Service 2" },
    { value: "service3", label: "Service 3" },
    { value: "service4", label: "Service 4" },
  ];
  const buttonLoading = (button) => {
    const text = button.querySelector(".button-text");
    const spinner = button.querySelector(".loading-spinner");

    text.classList.add("hidden");
    spinner.classList.remove("hidden");

    setTimeout(() => {
      text.classList.remove("hidden");
      spinner.classList.add("hidden");
    }, 2000);
  };




  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold mb-4">Add New Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Select branch</option>
          </select>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Services
          </label>
          <div className="flex items-center gap-2">
            <Select
              isMulti
              options={options}
              value={selectedOptions}
              onChange={(options) => setSelectedOptions(options)}
              placeholder="Select Services"
              className="flex-1"
            />
            <button
              onClick={() => setIsModalOpen(true)} // سنضيف التحكم في `isModalOpen` لاحقاً
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Project Owner
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Select or add new owner</option>
          </select>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Customer / Contractor
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Select or add new customer</option>
          </select>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Consultive/s
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Select or add new consultative</option>
          </select>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Inspection Date
          </label>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Engineer
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Select Engineer to assign for inspection</option>
          </select>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Inspection Time
          </label>
          <input
            type="text"
            placeholder="--:-- --"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="4"
          ></textarea>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">
            Inspection Location
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md h-48">
            <div className="map-responsive">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12689.830105309824!2d-122.030189!3d37.3316756!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5b6c4951d0f%3A0xb651414deb31e9fb!2sApple%20Infinite%20Loop!5e0!3m2!1sen!2seg!4v1730722326603!5m2!1sen!2seg"
                width="100%"
                height="250"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Responsive Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center text-sm"
        onClick={(e) => buttonLoading(e.currentTarget)}
      >
        <span className="button-text font-bold">Add Project</span>
        <span className="loading-spinner hidden ml-4  border-white border-t-blue-500  w-4"></span>
      </button>
    </div>
  );
};

export default AddNewProject;
