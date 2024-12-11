import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";

const AddNewProject = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isConsultiveModalOpen, setIsConsultiveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [consultives, setConsultives] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedConsultives, setSelectedConsultives] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [notes, setNotes] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState("");

  // New Variables
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [latValue, setLatValue] = useState("");
  const [longValue, setLongValue] = useState("");

  const [newService, setNewService] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newConsultiveName, setNewConsultiveName] = useState("");

  const [projectImage, setProjectImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const dropifyRef = useRef(null);

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
      minHeight: "2.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode() ? "#020617" : "#fff",
      color: isDarkMode() ? "#fff" : "#000",
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
      color: isDarkMode() ? "#fff" : "#000",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isDarkMode() ? "#475569" : "#e0e0e0",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode() ? "#475569" : "#e0e0e0",
      color: isDarkMode() ? "#fff" : "#000",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#000",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#000",
      ":hover": {
        backgroundColor: isDarkMode() ? "#1E293B" : "#ccc",
        color: isDarkMode() ? "#fff" : "#000",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#cbd5e1" : "#6b7280",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode() ? "#fff" : "#000",
    }),
  };

  useEffect(() => {
    // Fetch data on load
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
        setBranches(
          data.data.map((branch) => ({ value: branch.id, label: branch.name }))
        );
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
          setServices(
            result.data.map((service) => ({
              value: service.id,
              label: service.name,
            }))
          );
        } else {
          console.error("Error fetching services data");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === 200) {
          const formattedCustomers = data.data.map((customer) => ({
            value: customer.id,
            label: customer.name,
            type: customer.type,
          }));
          setCustomers(formattedCustomers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchConsultive = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === 200) {
          const formattedConsultive = data.data
            .filter((item) => item.type === 2)
            .map((item) => ({
              value: item.id,
              label: item.name,
            }));
          setConsultives(formattedConsultive);
        }
      } catch (error) {
        console.error("Error loading consultive data:", error);
      }
    };

    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://inout-api.octopusteam.net/api/front/getOwners",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === 200) {
          const formattedOwners = data.data.map((owner) => ({
            value: owner.id,
            label: `${owner.name} ${owner.type === 1 ? "(Owner)" : ""}`,
          }));
          setOwners(formattedOwners);
        }
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    const fetchEngineers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEngineers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === 200) {
          setEngineers(
            data.data.map((engineer) => ({
              value: engineer.id,
              label: engineer.full_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching engineers:", error);
      }
    };

    fetchBranches();
    fetchServices();
    fetchCustomers();
    fetchConsultive();
    fetchOwners();
    fetchEngineers();

    // Initialize Dropify
    if (dropifyRef.current) {
      $(dropifyRef.current).dropify({
        messages: {
          default: "Drag and drop an image here or click",
          replace: "Drag and drop or click to replace",
          remove: "Remove",
          error: "Sorry, something wrong appended.",
        },
        error: {
          fileSize: "The file size is too big ({{ value }} max).",
          minWidth: "The image width is too small ({{ value }}px min).",
          maxWidth: "The image width is too big ({{ value }}px max).",
          minHeight: "The image height is too small ({{ value }}px min).",
          maxHeight: "The image height is too big ({{ value }}px max).",
          imageFormat: "The image format is not allowed ({{ value }} only).",
        },
      });

      // Handle Dropify change event
      $(dropifyRef.current).on("change", function (e, files) {
        const file = e.target.files[0];
        if (file) {
          setProjectImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setProjectImage(null);
          setImagePreview(null);
        }
      });
    }
  }, []);

  const handleAddProject = async () => {
    setIsLoading(true);

    try {
      const selectedBranchId = selectedBranch ? selectedBranch.value : null;
      const selectedOwnerId = selectedOwner ? selectedOwner.value : null;
      const selectedCustomerConstructorId = selectedCustomer
        ? selectedCustomer.value
        : null;
      const selectedEngineerId = selectedEngineer
        ? selectedEngineer.value
        : null;

      const selectedServiceIds =
        selectedServices && selectedServices.length > 0
          ? selectedServices.map((s) => s.value)
          : [];
      const selectedConsultiveIds =
        selectedConsultives && selectedConsultives.length > 0
          ? selectedConsultives.map((c) => c.value)
          : [];

      // Use FormData to send data with image
      const formData = new FormData();
      formData.append("name", projectName || "");
      formData.append("branch_id", selectedBranchId || "");
      formData.append(
        "customer_constructor_id",
        selectedCustomerConstructorId || ""
      );
      formData.append("inspection_date", inspectionDate || "");
      formData.append("inspection_engineer_id", selectedEngineerId || "");
      formData.append("inspection_location_lat", latValue || "");
      formData.append("inspection_location_long", longValue || "");
      formData.append("project_owner_id", selectedOwnerId || "");
      formData.append("status", projectStatus || "");
      selectedServiceIds.forEach((id) => formData.append("service_ids[]", id));
      selectedConsultiveIds.forEach((id) =>
        formData.append("project_consultive_ids[]", id)
      );
      formData.append("notes", notes || "");
      formData.append("inspection_time", inspectionTime || "");

      // **Add image if selected**
      if (projectImage) {
        formData.append("project_image", projectImage);
      }

      console.log("Form Data:", {
        name: projectName,
        branch_id: selectedBranchId,
        customer_constructor_id: selectedCustomerConstructorId,
        inspection_date: inspectionDate,
        inspection_engineer_id: selectedEngineerId,
        inspection_location_lat: latValue,
        inspection_location_long: longValue,
        project_owner_id: selectedOwnerId,
        status: projectStatus,
        service_ids: selectedServiceIds,
        project_consultive_ids: selectedConsultiveIds,
        notes: notes,
        inspection_time: inspectionTime,
        project_image: projectImage,
        inspection_location_location: inspectionLocation,
      });

      const result = await addProjectData(formData);

      if (result.status === 200) {
        toast.success("Project added successfully");
        resetForm();
      } else {
        toast.error("Failed to add project: " + result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add project.");
    } finally {
      setIsLoading(false);
    }
  };

  const addProjectData = (formData) => {
    const token = localStorage.getItem("token");
    return fetch("https://inout-api.octopusteam.net/api/front/addProject", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do not set 'Content-Type' when using FormData
      },
      body: formData,
    }).then((res) => res.json());
  };

  // Functions to open and close modals
  const handleCancelCustomer = () => {
    setIsCustomerModalOpen(false);
    setNewCustomerName("");
  };

  const handleCancelConsultive = () => {
    setIsConsultiveModalOpen(false);
    setNewConsultiveName("");
  };

  const handleCancelService = () => {
    setIsServiceModalOpen(false);
    setNewService("");
  };

  const handleCancelOwner = () => {
    setIsOwnerModalOpen(false);
    setNewOwner("");
  };

  // Functions to save new entries
  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error("Please enter a customer name");
      return;
    }

    const customerData = {
      name: newCustomerName,
      type: 2,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
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
        const newOption = { value: result.data.id, label: result.data.name };
        setCustomers((prevCustomers) => [...prevCustomers, newOption]);
        setIsCustomerModalOpen(false);
        setNewCustomerName("");
        setSelectedCustomer(newOption);
        toast.success("Customer added successfully");
      } else {
        console.error("Error adding customer", result.message);
        toast.error("Failed to add customer: " + result.message);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Error saving customer: " + error.message);
    }
  };

  const handleSaveConsultive = async () => {
    if (!newConsultiveName.trim()) {
      toast.error("Please enter a consultive name");
      return;
    }

    const consultiveData = {
      name: newConsultiveName,
      type: 2,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
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
        const newOption = { value: result.data.id, label: result.data.name };
        setConsultives((prevConsultives) => [...prevConsultives, newOption]);
        setIsConsultiveModalOpen(false);
        setNewConsultiveName("");
        setSelectedConsultives((prev) => [...prev, newOption]);
        toast.success("Consultive added successfully");
      } else {
        console.error("Error adding consultive", result.message);
        toast.error("Failed to add consultive: " + result.message);
      }
    } catch (error) {
      console.error("Error saving consultive:", error);
      toast.error("Error saving consultive: " + error.message);
    }
  };

  const handleSaveService = async () => {
    if (!newService.trim()) {
      toast.error("Please enter a service name");
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
        const newOption = { value: result.data.id, label: newService };
        setServices([...services, newOption]);

        setIsServiceModalOpen(false);
        setNewService("");
        setSelectedServices((prev) => [...prev, newOption]);
        toast.success("Service added successfully");
      } else {
        console.error("Error adding service", result.message);
        toast.error("Failed to add service: " + result.message);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Error saving service: " + error.message);
    }
  };

  const handleSaveOwner = async () => {
    if (!newOwner.trim()) {
      toast.error("Please enter an owner name");
      return;
    }

    const ownerData = {
      name: newOwner,
      type: 1,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addOwner",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ownerData),
        }
      );

      const result = await response.json();
      if (response.ok && result.status === 200) {
        const newOption = {
          value: result.data.id,
          label: `${result.data.name} (Owner)`,
        };
        setOwners([...owners, newOption]);
        setIsOwnerModalOpen(false);
        setNewOwner("");
        setSelectedOwner(newOption);
        toast.success("Owner added successfully");
      } else {
        console.error("Error adding owner", result.message);
        toast.error("Failed to add owner: " + result.message);
      }
    } catch (error) {
      console.error("Error saving owner:", error);
      toast.error("Error saving owner: " + error.message);
    }
  };

  // Function to reset form after successful project addition
  const resetForm = () => {
    setSelectedOwner(null);
    setSelectedCustomer(null);
    setSelectedConsultives([]);
    setSelectedServices([]);
    setSelectedEngineer(null);
    setInspectionDate("");
    setInspectionTime("");
    setNotes("");
    setInspectionLocation("");
    setProjectName("");
    setProjectStatus("");
    setLatValue("");
    setLongValue("");
    setSelectedBranch(null);
    setProjectImage(null);
    setImagePreview(null);

    // Reset Dropify
    if (dropifyRef.current) {
      $(dropifyRef.current).dropify().data("dropify").resetPreview();
      $(dropifyRef.current).dropify().val("");
    }
  };

  return (
    <div className="container ml-0 p-10">
      <h1 className="total text-4xl font-bold mb-3">Add New Project</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <label className="total dark:text-white block ml-6 text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="name border border-gray-300  rounded-md p-2 dark:bg-slate-900  w-full"
          />
        </div>

        <div className="">
          <label className=" block ml-6 text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
            Project Status
          </label>
          <select
            name="status"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="add  border border-gray-300 rounded-md p-2 text-gray-700 w-full"
          >
            <option value="">Select status</option>
            <option value="0">Not Started</option>
            <option value="2">In Progress</option>
            <option value="4">Completed</option>
            <option value="6">Pending</option>
            <option value="8">Under Review</option>
            <option value="10">Cancelled</option>
          </select>
        </div>

        {/* Latitude */}
        {/* <div className="">
          <label className="block ml-6 text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
            Latitude
          </label>
          <input
            type="text"
            value={latValue}
            onChange={(e) => setLatValue(e.target.value)}
            className="border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white w-full"
          />
        </div> */}

        {/* Longitude */}
        {/* <div className="">
          <label className="block ml-6 text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
            Longitude
          </label>
          <input
            type="text"
            value={longValue}
            onChange={(e) => setLongValue(e.target.value)}
            className="border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white w-full"
          />
        </div> */}

        {/* Image Upload Field using Dropify */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch */}
        <div className="p-1 mt-4">
          <label className="total block text-sm font-medium ml-6">
            Branch
          </label>
          <Select
            options={branches}
            name="branch_id"
            placeholder="Select branch"
            className="custom-select select1"
            styles={customSelectStyles}
            onChange={(selected) => setSelectedBranch(selected)}
          />
        </div>

        {/* Services */}
        <div className="p-1 mt-4">
          <label className="total block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            Services
          </label>
          <div className="flex items-center gap-2">
            <Select
              isMulti
              options={services}
              value={selectedServices}
              onChange={(options) => setSelectedServices(options)}
              placeholder="Select Services"
              name="service_ids[]"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal to add a new service */}
            <Dialog
              open={isServiceModalOpen}
              onClose={handleCancelService}
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
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900"
                          >
                            Add New Service
                          </DialogTitle>
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter service name"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
                              className="mt-1 w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
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

        {/* Project Owner */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            Project Owner
          </label>
          <div className="flex items-center mt-1">
            <Select
              options={[
                { value: null, label: "Select or add new owner" },
                ...owners,
              ]}
              value={selectedOwner}
              onChange={(selected) => setSelectedOwner(selected)}
              placeholder="Select or add new owner"
              className="select1 custom-select flex-1"
              name="project_owner_id"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal to add a new project owner */}
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
                <div className="flex min-h-full items-end justify-center p-4 text-m sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden dark:bg-slate-900 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="owner px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900"
                          >
                            Add New Owner
                          </DialogTitle>
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter owner name"
                              value={newOwner}
                              onChange={(e) => setNewOwner(e.target.value)}
                              className="mt-1 w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owner bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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

        {/* Customer / Contractor */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            Customer / Contractor
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={[
                { value: null, label: "Select or add new customer" },
                ...customers,
              ]}
              value={selectedCustomer}
              onChange={(selected) => setSelectedCustomer(selected)}
              placeholder="Select or add new customer"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
              name="customer_constructor_id"
            />

            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal to add a new customer */}
            <Dialog
              open={isCustomerModalOpen}
              onClose={handleCancelCustomer}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-m sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden dark:bg-slate-900 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="customer px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
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
                              onChange={(e) =>
                                setNewCustomerName(e.target.value)
                              }
                              className="mt-1 w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="customer bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveCustomer}
                        className="inline-flex mr-60 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Save Customer
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelCustomer}
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

        {/* Consultive/s */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Consultive(s)
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              isMulti
              options={consultives}
              value={selectedConsultives}
              onChange={(options) => setSelectedConsultives(options)}
              placeholder="Select Consultives"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
              name="project_consultive_ids[]"
            />

            <button
              onClick={() => setIsConsultiveModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal to add a new consultive */}
            <Dialog
              open={isConsultiveModalOpen}
              onClose={handleCancelConsultive}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-m sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden dark:bg-slate-900 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="consultive px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900"
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
                              className="mt-1 w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="consultive bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveConsultive}
                        className="inline-flex mr-60 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Save Consultive
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelConsultive}
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

        {/* Inspection Date */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Inspection Date
          </label>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={inspectionDate}
            name="inspection_date"
            onChange={(e) => setInspectionDate(e.target.value)}
            className="mt-1 block text-gray-600 w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Engineer */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Engineer
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={[
                {
                  value: null,
                  label: "Select Engineer to assign for inspection",
                },
                ...engineers,
              ]}
              value={selectedEngineer}
              onChange={(selected) => setSelectedEngineer(selected)}
              placeholder="Select Engineer to assign for inspection"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
              name="inspection_engineer_id"
            />
          </div>
        </div>

        {/* Inspection Time */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Inspection Time
          </label>
          <input
            type="number"
            placeholder=""
            value={inspectionTime}
            onChange={(e) => setInspectionTime(e.target.value)}
            className="mt-1 block w-full text-gray-700 border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Notes */}
        <div className="p-1">
          <label className=" block text-sm font-medium text-gray-700 ml-6">
            Notes
          </label>
          <textarea
            className="notes mt-1 block w-full text-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:text-white"
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            name="notes"
          ></textarea>
        </div>

        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Inspection Location
          </label>
          <div className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2  dark:text-white">
            <input
              type="text"
              name="  inspection_location_location"
              placeholder="Inspection Location Description"
              className="w-full p-2 text-gray-700 border border-gray-300 rounded-md dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:col-span-2 mt-4">
        <label
          htmlFor="project_image"
          className="mb-2 ml-6 font-medium text-gray-700"
        >
          Upload Project Image
        </label>
        <input
          type="file"
          id="project_image"
          ref={dropifyRef}
          className="dropify"
          data-allowed-file-extensions="jpg jpeg png gif"
          data-max-file-size="2M"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Project Preview"
            className="mt-4 h-40 w-40 object-cover rounded-md"
          />
        )}
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
      <ToastContainer />
    </div>
  );
};

export default AddNewProject;
