import React, { useEffect, useState } from "react";
import Select from "react-select";

const AddNewProject = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedConsultative, setSelectedConsultative] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [engineers, setEngineers] = useState([]);

  

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
  const openModal = (title) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await res.json();
        setBranches(data.data);
      } catch (err) {
        console.error("Error fetching branches:", err.message);
      }
    };
    const fetchServices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getServices",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          const options = data.data.map((service) => ({
            value: service.id,
            label: service.name,
          }));
          setServices(options);
        } else {
          console.error("Error fetching services:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCustomers(data.data); // تخزين العملاء في الـ state
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
    fetchBranches();
    fetchServices();
  }, []);

  useEffect(() => {
    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const formattedOwners = data.data.map((item) => {
            let typeName = "";
            switch (item.type) {
              case 0:
                typeName = "Client";
                break;
              case 1:
                typeName = "Owner";
                break;
              case 2:
                typeName = "Consultant";
                break;
              default:
                typeName = "Unknown";
            }
            return {
              id: item.id,
              name: item.name,
              type: typeName,
            };
          });
          setOwners(formattedOwners);
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  useEffect(() => {
    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const formattedCustomers = data.data
            .filter((item) => item.type === 2)
            .map((item) => ({
              id: item.id,
              name: item.name,
              type: item.type === 2 ? "Consultant" : "Client",
            }));
          setCustomers(formattedCustomers);
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  useEffect(() => {
    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const formattedCustomers = data.data
            .filter((item) => item.type === 0)
            .map((item) => ({
              id: item.id,
              name: item.name,
            }));
          setCustomers(formattedCustomers);
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getOwners"
        );
        const data = await response.json();
        if (data.status === 200) {
          setOwners(data.data);
        }
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    fetch("https://inout-api.octopusteam.net/api/front/getEngineers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setEngineers(data.data); // Store engineers data in state
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container ml-0  p-10 dark:bg-slate-950">
      <h1 className="text-4xl font-bold mb-4 ">Add New Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-1">
          {" "}
          <label className="block text-sm font-medium text-gray ml-6">
            BRANCH
          </label>{" "}
          <select className="mt-1 dark:bg-slate-950 block w-full border border-gray-300 rounded-md p-2">
            {" "}
            <option>Select branch</option>{" "}
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {" "}
                {branch.name}{" "}
              </option>
            ))}{" "}
          </select>{" "}
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            SERVICES
          </label>
          <div className="flex items-center text-white gap-2">
            <Select
              isMulti
              options={services}
              value={selectedOptions}
              onChange={(options) => setSelectedOptions(options)}
              placeholder="Select Services"
              className="select1 flex-1 dark:bg-slate-900"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "",
                  color: "",
                  border: state.isFocused
                    ? "1px solid #6B7280"
                    : "1px solid #D1D5DB",
                  boxShadow: state.isFocused ? "0 0 0 2px #2563EB" : "none",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "white",
                  color: "black",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "" : "",
                  color: "black",
                }),
                placeholder: (base) => ({ ...base, color: "#9CA3AF" }),
              }}
            />
            <div>
              <button
                onClick={() => openModal("Add New Service")}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
              >
                +
              </button>
              {/* {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="">
                    <h2 className="text-xl font-bold">Add New Service</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Fill in the details below.
                    </p>
                    <input
                      type="text"
                      placeholder="Service Name"
                      className="mt-4 w-full p-2 rounded-md"
                    />
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            PROJECT OWNER
          </label>
          <div className="flex items-center mt-1">
            <select
              className="PROJECT block w-full dark:bg-slate-950 border border-gray-300 rounded-md p-2"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
            >
              <option>Select or add new owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} {owner.type === 1 ? "(Owner)" : ""}
                </option>
              ))}
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
              <div className="w-96 h-96 p-6 rounded-lg shadow-lg">
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
          {/* Label */}
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CUSTOMER / CONTRACTOR
          </label>

          <div className="flex items-center gap-2 mt-1">
            <select
              className="block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option>Select or add new customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-900 dark:text-white w-96 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Add New Customer
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Fill in the details below to add a new customer.
                </p>

                {/* Input Fields */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CONSULTIVE/S
          </label>

          <div className="flex items-center gap-2 mt-1">
            <select
              className="block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950"
              value={selectedConsultative}
              onChange={(e) => setSelectedConsultative(e.target.value)}
            >
              <option>Select or add new consultative</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-900 dark:text-white w-96 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Add New Consultative
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Fill in the details below to add a new consultative.
                  </p>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter consultative name"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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

          <div className="flex items-center gap-2 mt-1">
            <select className="block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-950">
              <option>Select Engineer to assign for inspection</option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-900 dark:text-white w-96 rounded-lg shadow-lg p-6">
                {/* Modal Buttons */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
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
