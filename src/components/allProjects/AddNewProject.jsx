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
  // إدارة الحالات
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

  // إدارة القيم المختارة
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedConsultives, setSelectedConsultives] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [notes, setNotes] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState("");

  // إدارة القيم الجديدة
  const [newService, setNewService] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newConsultiveName, setNewConsultiveName] = useState("");

  // تعريف نمط الـ Select بناءً على الوضع الليلي أو النهاري
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

  // دالة لإضافة مشروع جديد
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
        owner_id: selectedOwner ? selectedOwner.value : null,
        customer_id: selectedCustomer ? selectedCustomer.value : null,
        engineer_id: selectedEngineer ? selectedEngineer.value : null,
        inspection_date: inspectionDate,
        inspection_time: inspectionTime,
        notes: notes,
        inspection_location: inspectionLocation,
      };

      const result = await addProjectData(projectData);

      if (result.status === 200) {
        alert("Project added successfully!");
        // إعادة تعيين الحقول إذا رغبت
        resetForm();
      } else {
        alert("Failed to add project: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add project.");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لإرسال بيانات المشروع
  const addProjectData = (projectData) => {
    const token = localStorage.getItem("token");
    return fetch("https://inout-api.octopusteam.net/api/front/addProject", {
      method: "POST", // استخدم POST بدلاً من GET
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // استخدم القوالب النصية
      },
      body: JSON.stringify(projectData),
    }).then((res) => res.json());
  };

  // دوال فتح وإغلاق النوافذ المنبثقة (modals)
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

  // دوال حفظ القيم الجديدة
  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim()) {
      alert("Please enter a customer name");
      return;
    }

    const customerData = {
      name: newCustomerName,
      type: 2, // تأكد من أن النوع صحيح حسب الـ API
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
        const newOption = { value: result.data.id, label: result.data.name };
        setCustomers((prevCustomers) => [...prevCustomers, newOption]);
        setIsCustomerModalOpen(false);
        setNewCustomerName("");
        setSelectedCustomer(newOption); // تعيين العميل الجديد كـ selected
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
      type: 2, // تأكد من أن النوع صحيح حسب الـ API
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
        const newOption = { value: result.data.id, label: result.data.name };
        setConsultives((prevConsultives) => [...prevConsultives, newOption]);
        setIsConsultiveModalOpen(false);
        setNewConsultiveName("");
        setSelectedConsultives((prev) => [...prev, newOption]); // تعيين الاستشاري الجديد كمختار
      } else {
        console.error("Error adding consultive", result.message);
        alert("Failed to add consultive: " + result.message);
      }
    } catch (error) {
      console.error("Error saving consultive:", error);
      alert("Error saving consultive: " + error.message);
    }
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
        const newOption = { value: result.data.id, label: newService };
        setServices([...services, newOption]);

        setIsServiceModalOpen(false);
        setNewService("");
        setSelectedServices((prev) => [...prev, newOption]); // تعيين الخدمة الجديدة كمختارة
      } else {
        console.error("Error adding service", result.message);
        alert("Failed to add service: " + result.message);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service: " + error.message);
    }
  };

  const handleSaveOwner = async () => {
    if (!newOwner.trim()) {
      alert("Please enter an owner name");
      return;
    }

    const ownerData = {
      name: newOwner,
      type: 1, // تأكد من أن النوع صحيح حسب الـ API
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addOwner", // تأكد من صحة الـ endpoint
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
        const newOption = { value: result.data.id, label: `${result.data.name} (Owner)` };
        setOwners([...owners, newOption]);
        setIsOwnerModalOpen(false);
        setNewOwner("");
        setSelectedOwner(newOption); // تعيين المالك الجديد كـ selected
      } else {
        console.error("Error adding owner", result.message);
        alert("Failed to add owner: " + result.message);
      }
    } catch (error) {
      console.error("Error saving owner:", error);
      alert("Error saving owner: " + error.message);
    }
  };

  // دالة لإعادة تعيين الحقول بعد إضافة المشروع بنجاح
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
  };

  // جلب البيانات عند التحميل
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
        setBranches(data.data.map(branch => ({ value: branch.id, label: branch.name })));
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
          setServices(result.data.map(service => ({ value: service.id, label: service.name })));
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
          // تحويل البيانات إلى صيغة react-select
          const formattedCustomers = data.data.map(customer => ({
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
          const formattedOwners = data.data.map(owner => ({
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
          setEngineers(data.data.map(engineer => ({ value: engineer.id, label: engineer.full_name })));
        }
      } catch (error) {
        console.error("Error fetching engineers:", error);
      }
    };

    // استدعاء جميع الدوال لجلب البيانات
    fetchBranches();
    fetchServices();
    fetchCustomers();
    fetchConsultive();
    fetchOwners();
    fetchEngineers();
  }, []);

  return (
    <div className="container ml-0 p-10 dark:bg-slate-950">
      <h1 className="text-4xl font-bold mb-4">Add New Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray ml-6">
            BRANCH
          </label>
          <Select
            options={branches}
            placeholder="Select branch"
            className="custom-select select1"
            styles={customSelectStyles}
            onChange={(selected) => {
              // يمكنك إدارة حالة الفرع المختار هنا إذا لزم الأمر
            }}
          />
        </div>

        {/* Services */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            SERVICES
          </label>
          <div className="flex items-center gap-2">
            <Select
              isMulti
              options={services}
              value={selectedServices}
              onChange={(options) => setSelectedServices(options)}
              placeholder="Select Services"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal لإضافة خدمة جديدة */}
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
            PROJECT OWNER
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
              styles={customSelectStyles}
            />

            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Modal لإضافة مالك مشروع جديد */}
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
                              className="select1 mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
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

        {/* Customer / Contractor */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            CUSTOMER / CONTRACTOR
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
            />

            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Modal لإضافة عميل جديد */}
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
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="service px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                            onChange={(e) => setNewCustomerName(e.target.value)}
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
                      onClick={handleSaveCustomer}
                      className="inline-flex mr-40 mt-3 w-full h-10 justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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

        {/* Consultive/s */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            CONSULTIVE/S
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
            />

            <button
              onClick={() => setIsConsultiveModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Modal لإضافة Consultive جديد */}
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
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="service px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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

        {/* Inspection Date */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION DATE
          </label>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Engineer */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            ENGINEER
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={[
                { value: null, label: "Select Engineer to assign for inspection" },
                ...engineers,
              ]}
              value={selectedEngineer}
              onChange={(selected) => setSelectedEngineer(selected)}
              placeholder="Select Engineer to assign for inspection"
              className="select1 custom-select flex-1"
              styles={customSelectStyles}
            />
          </div>
        </div>

        {/* Inspection Time */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            INSPECTION TIME
          </label>
          <input
            type="time"
            placeholder="--:-- --"
            value={inspectionTime}
            onChange={(e) => setInspectionTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Notes */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            NOTES
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Inspection Location */}
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

      {/* زر إضافة المشروع */}
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
