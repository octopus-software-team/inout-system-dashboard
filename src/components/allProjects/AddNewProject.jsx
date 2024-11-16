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
    <div className="container ml-0  p-10 dark:bg-black">
      <h1 className="text-4xl font-bold mb-4 ">Add New Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-1">
          <label className="block text-sm font-medium  text-gray-00 ml-6 ">
            BRANCH
          </label>
          <select className="mt-1 dark:bg-slate-950 block w-full border border-gray-300 rounded-md p-2">
            <option>Select branch</option>
          </select>
        </div>
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-6">
            SERVICES
          </label>
          <div className="flex items-center gap-2">
            <Select
              isMulti
              options={options}
              value={selectedOptions}
              onChange={(options) => setSelectedOptions(options)}
              placeholder="Select Services"
              className="flex-1"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "slate-950" : "slate-950",
                  color: "white",
                  border: state.isFocused
                    ? "1px solid #6B7280"
                    : "1px solid #D1D5DB",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "slate-950",
                  color: "white",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#374151" : "slate-950",
                  color: "white",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9CA3AF",
                }),
              }}
            />
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
              >
                +
              </button>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white w-96 h-96 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">Add Service</h2>
                    <p className="mt-4"></p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-56 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            PROJECT OWNER
          </label>
          <div className="flex items-center mt-1">
            <select className="block w-full dark:bg-slate-950 border border-gray-300 rounded-md p-2">
              <option>Select or add new owner</option>
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white w-96 h-96 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold">Add Owner</h2>
                <p className="mt-4"></p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-56 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CUSTOMER / CONTRACTOR
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950">
            <option>Select or add new customer</option>
          </select>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CONSULTIVE/S
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950">
            <option>Select or add new consultative</option>
          </select>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION DATE
          </label>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950"
          />
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            ENGINEER
          </label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950">
            <option>Select Engineer to assign for inspection</option>
          </select>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION TIME
          </label>
          <input
            type="text"
            placeholder="--:-- --"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950"
          />
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            NOTES
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950"
            rows="4"
          ></textarea>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION LOCATION
          </label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md h-48 relative">
            {/* استخدمي relative لتثبيت الحاوية */}
            <div className="map-responsive">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12689.830105309824!2d-122.030189!3d37.3316756!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5b6c4951d0f%3A0xb651414deb31e9fb!2sApple%20Infinite%20Loop!5e0!3m2!1sen!2seg!4v1730722326603!5m2!1sen!2seg"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Responsive Google Map"
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <button
        className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center text-sm"
        onClick={(e) => buttonLoading(e.currentTarget)}
      >
        <span className="button-text font-bold">Add Project</span>
        <span className="loading-spinner hidden ml-4 border-2 border-white border-t-blue-500 rounded-full w-4 h-4"></span>
      </button>
    </div>
  );
};

export default AddNewProject;
