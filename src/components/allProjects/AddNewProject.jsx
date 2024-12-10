import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const AddNewProject = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newService, setNewService] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [selectedConsultative, setSelectedConsultative] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [open, setOpen] = useState(true);
  const [consultive, setConsultive] = useState([]);
  const [newConsultiveName, setNewConsultiveName] = useState("");
  const [isConsultiveModalOpen, setIsConsultiveModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedConsultives, setSelectedConsultives] = useState([]);

  const isDarkMode = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode() ? "#020617" : "",
      borderColor: state.isFocused
        ? "#2563EB"
        : isDarkMode()
        ? "#334155"
        : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #2563EB" : "none",
      "&:hover": {
        borderColor: state.isFocused
          ? "#2563EB"
          : isDarkMode()
          ? "#475569"
          : "#aaa",
      },
      color: isDarkMode() ? "#fff" : "#000",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode() ? "#020617" : "#fff",
      color: isDarkMode() ? "#fff" : "",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode()
          ? "#334155"
          : "#f0f0f0"
        : isDarkMode()
        ? "#1E293B"
        : "#fff",
      color: isDarkMode() ? "#fff" : "",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isDarkMode() ? "#475569" : "#e0e0e0",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode() ? "#475569" : "#e0e0e0",
      color: isDarkMode() ? "#fff" : "#",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#",
      ":hover": {
        backgroundColor: isDarkMode() ? "#1E293B" : "#ccc",
        color: isDarkMode() ? "#fff" : "#",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#cbd5e1" : "#6b7280",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#",
    }),
  };

  const handleAddProject = async () => {
    setIsLoading(true);

    try {
      const selectedServiceIds = selectedServices.map(
        (service) => service.value
      );
      const selectedConsultiveIds = selectedConsultives.map((c) => c.value);

      const projectData = {
        service_ids: selectedServiceIds,
        consultive_ids: selectedConsultiveIds,
      };

      const result = await addProjectData(projectData);

      alert("Project added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add project.");
    } finally {
      setIsLoading(false);
    }
  };

  const addProjectData = (projectData) => {
    const token = localStorage.getItem("token");
    return fetch("https://inout-api.octopusteam.net/api/front/getServices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    }).then((res) => res.json());
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancelCustomer = () => {
    setIsCustomerModalOpen(false);
    setNewCustomerName("");
  };

  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim()) {
      alert("Please enter a customer name");
      return;
    }

    const customerData = {
      name: newCustomerName,
      type: 2,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addCustomer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        }
      );

      const result = await response.json();
      if (response.ok && result.status === 200) {
        setCustomers((prevCustomers) => [...prevCustomers, result.data]);
        setIsCustomerModalOpen(false);
        setNewCustomerName("");
      } else {
        console.error("Error adding customer", result.message);
        alert("Failed to add customer: " + result.message);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error saving customer: " + error.message);
    }
  };

  const handleSaveConsultive = async () => {
    if (!newConsultiveName.trim()) {
      alert("Please enter a consultive name");
      return;
    }

    const consultiveData = {
      name: newConsultiveName,
      type: 2,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addCustomer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(consultiveData),
        }
      );

      const result = await response.json();
      if (response.ok && result.status === 200) {
        setConsultive((prevConsultive) => [...prevConsultive, result.data]);
        setIsConsultiveModalOpen(false);
        setNewConsultiveName("");
      } else {
        console.error("Error adding consultive", result.message);
        alert("Failed to add consultive: " + result.message);
      }
    } catch (error) {
      console.error("Error saving consultive:", error);
      alert("Error saving consultive: " + error.message);
    }
  };

  const handleCancelConsultive = () => {
    setIsConsultiveModalOpen(false);
    setNewConsultiveName("");
  };

  const handleSaveService = async () => {
    if (!newService.trim()) {
      alert("Please enter a service name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addService",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newService,
          }),
        }
      );
      const result = await response.json();

      if (result.status === 200) {
        setServices([...services, { id: result.data.id, name: newService }]);

        setIsServiceModalOpen(false);

        setNewService("");
      } else {
        console.error("Error adding service", result.message);
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleCancelService = () => {
    setIsServiceModalOpen(false);
    setNewService("");
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
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getServices",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setServices(result.data);
        } else {
          console.error("Error fetching services data");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const token = localStorage.getItem("token");

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCustomers(data.data);
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
    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const formattedConsultive = data.data
            .filter((item) => item.type === 2)
            .map((item) => ({
              id: item.id,
              name: item.name,
            }));
          setConsultive(formattedConsultive);
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchOwners = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getOwners",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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
          setEngineers(data.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSaveOwner = () => {
    if (!newOwner.trim()) {
      alert("Please enter an owner name");
      return;
    }

    setOwners([...owners, { id: owners.length + 1, name: newOwner, type: 1 }]);

    setIsOwnerModalOpen(false);
    setNewOwner("");
  };

  const handleSaveTask = () => {
    if (!newOwner.trim()) {
      alert("Please enter an owner name");
      return;
    }

    setOwners([...owners, { id: owners.length + 1, name: newOwner, type: 1 }]);

    setIsOwnerModalOpen(false);
    setNewOwner("");
  };

  const handleCancelOwner = () => {
    setIsOwnerModalOpen(false);
    setNewOwner("");
  };

  const handleCanceTask = () => {
    setIsOwnerModalOpen(false);
    setNewOwner("");
  };

  useEffect(() => {
    const fetchOwners = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getOwners",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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

  return (
    <div className="container ml-0 p-10 dark:bg-slate-950">
      <h1 className="text-4xl font-bold mb-4">Add New Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-1">
          <label className="block text-sm font-medium text-gray ml-6">
            BRANCH
          </label>
          <select className="mt-1 dark:bg-slate-950 dark:text-white block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2">
            <option>Select branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* service */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            SERVICES
          </label>
          <div className="flex items-center gap-2">
            <Select
              isMulti
              options={services.map((service) => ({
                value: service.id,
                label: service.name,
              }))}
              value={selectedServices}
              onChange={(options) => setSelectedServices(options)}
              placeholder="Select Services"
              className="select1 flex-1"
              styles={customSelectStyles}
            />

            <div>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
              >
                +
              </button>

              <Dialog
                open={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                className="relative z-10"
              >
                <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500/75 transition-opacity"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-m sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden dark:bg-slate-900 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="service px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="">
                          <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                            <DialogTitle
                              as="h3"
                              className="text-base text-start font-semibold text-gray-900"
                            >
                              Add New Service
                            </DialogTitle>
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="Enter service name"
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                                className="mt-1 w-10/12 border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="service bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          onClick={handleSaveService}
                          className="inline-flex mr-60 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                          Save Service
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelService}
                          className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>
            </div>
          </div>
        </div>

        {/* owner */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            PROJECT OWNER
          </label>
          <div className="flex items-center mt-1">
            <Select
              options={[
                { value: "", label: "Select or add new owner" },
                ...owners.map((owner) => ({
                  value: owner.id,
                  label: `${owner.name} ${owner.type === 1 ? "(Owner)" : ""}`,
                })),
              ]}
              value={owners.find((owner) => owner.id === selectedOwner) || null}
              onChange={(selected) =>
                setSelectedOwner(selected ? selected.value : "")
              }
              placeholder="Select or add new owner"
              className="select1 flex-1"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            <Dialog
              open={isOwnerModalOpen}
              onClose={handleCancelOwner}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="service px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base mr-20 font-semibold text-gray-900"
                          >
                            Add New Owner
                          </DialogTitle>
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter owner name"
                              value={newOwner}
                              onChange={(e) => setNewOwner(e.target.value)}
                              className="mt-1 block  w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="service px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveOwner}
                        className="inline-flex mr-60 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Save Owner
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelOwner}
                        className="mt-3  inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            CUSTOMER / CONTRACTOR
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={[
                { value: "", label: "Select or add new customer" },
                ...customers.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                })),
              ]}
              value={
                customers.find(
                  (customer) => customer.id === selectedCustomer
                ) || null
              }
              onChange={(selected) =>
                setSelectedCustomer(selected ? selected.value : "")
              }
              placeholder="Select or add new customer"
              className="select1 flex-1"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          <Dialog
            open={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            className="relative z-10"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="service px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="">
                      <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold text-gray-900"
                        >
                          Add New Customer
                        </DialogTitle>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Enter customer name"
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            className="mt-1 block w-10/12 border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                          />
                          <input
                            type="hidden"
                            id="type"
                            name="type"
                            value="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service px-4 py-3 mr-2 sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleSaveCustomer}
                      className="inline-flex mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    >
                      Save Customer
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCustomer}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>

        {/*CONSULTIVE/S*/}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CONSULTIVE/S
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              isMulti
              options={consultive.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={selectedConsultives}
              onChange={(options) => setSelectedConsultives(options)}
              placeholder="Select Consultives"
              className="select1 flex-1"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsConsultiveModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            <Dialog
              open={isConsultiveModalOpen}
              onClose={() => setIsConsultiveModalOpen(false)}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="service  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base mr-20 font-semibold text-gray-900"
                          >
                            Add New Consultive
                          </DialogTitle>
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter consultive name"
                              value={newConsultiveName}
                              onChange={(e) =>
                                setNewConsultiveName(e.target.value)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="hidden"
                              id="type"
                              name="type"
                              value="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="service px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveConsultive}
                        className="inline-flex mr-56 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Save Consultive
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelConsultive}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        </div>

        {/*INSPECTION DATE */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION DATE
          </label>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* ENGINEER */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            ENGINEER
          </label>

          <div className="flex items-center gap-2 mt-1">
            <select className="block w-full dark:bg-slate-950 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md p-2">
              <option>Select Engineer to assign for inspection</option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.full_name}
                </option>
              ))}
            </select>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"></div>
          )}
        </div>

        {/* {INSPECTION TIME} */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION TIME
          </label>
          <input
            type="time"
            placeholder="--:-- --"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* NOTES */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            NOTES
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
            rows="4"
          ></textarea>
        </div>

        {/* INSPECTION LOCATION  */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION LOCATION
          </label>
          <div className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md h-48 relative">
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
        type="button"
        className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center text-sm"
        onClick={handleAddProject}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner ml-4 border-2 border-white border-t-blue-500 rounded-full w-4 h-4 animate-spin"></span>
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          <span className="button-text font-bold">Add Project</span>
        )}
      </button>
    </div>
  );
};

export default AddNewProject;
