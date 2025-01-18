import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// import L from "leaflet";

const AddNewProject = () => {
  // Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isConsultiveModalOpen, setIsConsultiveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const imageInputRef = useRef(null);

  // New Entry States
  // Customer
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [newService, setNewService] = useState("");

  // Consultive
  const [newConsultiveName, setNewConsultiveName] = useState("");
  const [newConsultiveEmail, setNewConsultiveEmail] = useState("");
  const [newConsultivePhone, setNewConsultivePhone] = useState("");

  // Owner
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerPhone, setNewOwnerPhone] = useState("");

  const navigate = useNavigate();

  // Data States
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [consultives, setConsultives] = useState([]);
  const [engineers, setEngineers] = useState([]);

  // Selected States
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedConsultives, setSelectedConsultives] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Project Details
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [notes, setNotes] = useState("");
  const divRef = useRef(null);

  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchLatitude, setNewBranchLatitude] = useState("");
  const [newBranchLongitude, setNewBranchLongitude] = useState("");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [position, setPosition] = useState([23.8859, 45.0792]);

  const dropifyRef = useRef(null);

  const [errors, setErrors] = useState({});

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleInput = () => {
    setNotes(divRef.current.innerText);
  };

  const openInGoogleMaps = () => {
    if (position) {
      const [lat, lng] = position;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const ChangeMapView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  const isDarkMode = () =>
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (imageInputRef.current) {
      $(imageInputRef.current).dropify({
        messages: {
          default: "Drag and drop a file here or click",
          replace: "Drag and drop or click to replace",
          remove: "Remove",
          error: "Ooops, something wrong happened.",
        },
      });

      $(imageInputRef.current).on("change", function (event) {
        const files = event.target.files;
        if (files && files[0]) {
          setProjectImage(files[0]);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(files[0]);
        } else {
          setProjectImage(null);
          setImagePreview(null);
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = Cookies.get("token");
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
        const token = Cookies.get("token");

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
        const token = Cookies.get("token");
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
        const token = Cookies.get("token");
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
        const token = Cookies.get("token");
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
        const token = Cookies.get("token");
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
    // Reset errors
    setErrors({});

    // Validation
    const newErrors = {};

    if (!projectName.trim())
      newErrors.projectName = "Project Name is required.";
    if (!projectStatus) newErrors.projectStatus = "Project Status is required.";
    if (!selectedBranch) newErrors.selectedBranch = "Branch is required.";
    if (!selectedServices || selectedServices.length === 0)
      newErrors.selectedServices = "At least one Service is required.";
    if (!selectedOwner) newErrors.selectedOwner = "Project Owner is required.";
    if (!selectedCustomer) newErrors.selectedCustomer = "Customer is required.";
    if (!selectedConsultives || selectedConsultives.length === 0)
      newErrors.selectedConsultives = "At least one Consultive is required.";
    if (!inspectionDate)
      newErrors.inspectionDate = "Inspection Date is required.";
    if (!selectedEngineer) newErrors.selectedEngineer = "Engineer is required.";
    if (!inspectionTime)
      newErrors.inspectionTime = "Inspection Time is required.";
    if (!position || position.length !== 2)
      newErrors.inspectionLocation = "Inspection Location is required.";
    // if (!projectImage) newErrors.projectImage = "Project Image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

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

      const formData = new FormData();
      formData.append("name", projectName || "");
      formData.append("branch_id", selectedBranchId || "");
      formData.append(
        "customer_constructor_id",
        selectedCustomerConstructorId || ""
      );
      formData.append("inspection_date", inspectionDate || "");
      formData.append("inspection_engineer_id", selectedEngineerId || "");
      formData.append("project_owner_id", selectedOwnerId || "");
      formData.append("status", projectStatus || "");
      selectedServiceIds.forEach((id, index) =>
        formData.append(`service_ids[${index}]`, id)
      );
      selectedConsultiveIds.forEach((id) =>
        formData.append("project_consultive_ids[]", id)
      );
      formData.append("notes", notes || "");
      formData.append("inspection_time", inspectionTime || "");
      formData.append("latitude", position[0] || "");
      formData.append("longitude", position[1] || "");

      if (projectImage) {
        formData.append("project_image", projectImage);
      }

      console.log("Form Data:", {
        name: projectName,
        branch_id: selectedBranchId,
        customer_constructor_id: selectedCustomerConstructorId,
        inspection_date: inspectionDate,
        inspection_engineer_id: selectedEngineerId,
        project_owner_id: selectedOwnerId,
        status: projectStatus,
        service_ids: selectedServiceIds,
        project_consultive_ids: selectedConsultiveIds,
        notes: notes,
        inspection_time: inspectionTime,
        project_image: projectImage,
        latitude: position[0],
        longitude: position[1],
      });

      const data = await addProjectData(formData);

      if (data.status === 200) {
        toast.success("Project added successfully.");
        setTimeout(() => {
          navigate("/allprojects/showallprojects");
        }, 2000);
      } else {
        toast.error(data.msg || "Failed to add Project.");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addProjectData = (formData) => {
    const token = Cookies.get("token");
    return fetch("https://inout-api.octopusteam.net/api/front/addProject", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => res.json());
  };

  // Cancel Handlers
  const handleCancelCustomer = () => {
    setIsCustomerModalOpen(false);
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
  };

  const handleCancelConsultive = () => {
    setIsConsultiveModalOpen(false);
    setNewConsultiveName("");
    setNewConsultiveEmail("");
    setNewConsultivePhone("");
  };

  const handleCancelOwner = () => {
    setIsOwnerModalOpen(false);
    setNewOwnerName("");
    setNewOwnerEmail("");
    setNewOwnerPhone("");
  };

  const handleCancelService = () => {
    setIsServiceModalOpen(false);
    setNewService("");
  };

  // Save Handlers
  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error("Please enter a customer name");
      return;
    }
    if (!newCustomerEmail.trim()) {
      toast.error("Please enter a customer email");
      return;
    }
    if (!newCustomerPhone.trim()) {
      toast.error("Please enter a customer phone");
      return;
    }

    const customerData = {
      name: newCustomerName,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      type: 0,
    };

    try {
      const token = Cookies.get("token");
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
        setNewCustomerEmail("");
        setNewCustomerPhone("");
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
    if (!newConsultiveEmail.trim()) {
      toast.error("Please enter a consultive email");
      return;
    }
    if (!newConsultivePhone.trim()) {
      toast.error("Please enter a consultive phone");
      return;
    }

    const consultiveData = {
      name: newConsultiveName,
      email: newConsultiveEmail,
      phone: newConsultivePhone,
      type: 2,
    };

    try {
      const token = Cookies.get("token");
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
        setNewConsultiveEmail("");
        setNewConsultivePhone("");
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

  const handleSaveOwner = async () => {
    if (!newOwnerName.trim()) {
      toast.error("Please enter an owner name");
      return;
    }
    if (!newOwnerEmail.trim()) {
      toast.error("Please enter an owner email");
      return;
    }
    if (!newOwnerPhone.trim()) {
      toast.error("Please enter an owner phone");
      return;
    }

    const ownerData = {
      name: newOwnerName,
      email: newOwnerEmail,
      phone: newOwnerPhone,
      type: 1,
    };

    try {
      const token = Cookies.get("token");
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
          body: JSON.stringify(ownerData),
        }
      );
      const result = await response.json();
      if (response.ok && result.status === 200) {
        const newOption = {
          value: result.data.id,
          label: `${result.data.name} (Owner)`,
        };
        setOwners((prevOwners) => [...prevOwners, newOption]);
        setIsOwnerModalOpen(false);
        setNewOwnerName("");
        setNewOwnerEmail("");
        setNewOwnerPhone("");
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

  const handleSaveService = async () => {
    if (!newService.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    try {
      const token = Cookies.get("token");
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
        setServices((prevServices) => [...prevServices, newOption]);

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

  const resetForm = () => {
    setSelectedOwner(null);
    setSelectedCustomer(null);
    setSelectedConsultives([]);
    setSelectedServices([]);
    setSelectedEngineer(null);
    setInspectionDate("");
    setInspectionTime("");
    setNotes("");
    setProjectName("");
    setProjectStatus("");
    setPosition([23.8859, 45.0792]);
    setProjectImage(null);
    setImagePreview(null);
    setErrors({});

    if (dropifyRef.current) {
      $(dropifyRef.current).dropify().data("dropify").resetPreview();
      $(dropifyRef.current).dropify().val("");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search.");
      return;
    }

    setSearchLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        toast.success(`Location found: ${data[0].display_name}`);
      } else {
        toast.error("Location not found. Please try a different query.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Error searching location. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveBranch = async () => {
    if (!newBranchName.trim()) {
      toast.error("Please enter a branch name");
      return;
    }
    if (!newBranchLatitude.trim()) {
      toast.error("Please enter a latitude");
      return;
    }
    if (!newBranchLongitude.trim()) {
      toast.error("Please enter a longitude");
      return;
    }

    const branchData = {
      name: newBranchName,
      latitude: newBranchLatitude,
      longitude: newBranchLongitude,
    };

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addBranch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(branchData),
        }
      );

      const result = await response.json();
      if (response.ok && result.status === 200) {
        const newOption = { value: result.data.id, label: result.data.name };
        setBranches((prevBranches) => [...prevBranches, newOption]);
        setIsBranchModalOpen(false);
        setNewBranchName("");
        setNewBranchLatitude("");
        setNewBranchLongitude("");
        setSelectedBranch(newOption);
        toast.success("Branch added successfully");
      } else {
        console.error("Error adding branch", result.message);
        toast.error("Failed to add branch: " + result.message);
      }
    } catch (error) {
      console.error("Error saving branch:", error);
      toast.error("Error saving branch: " + error.message);
    }
  };

  return (
    <div className="container ml-0 p-10">
      <h1 className="total text-4xl font-bold mb-3">Add New Project</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Name */}
        <div>
          <label className="total dark:text-white block ml-6 text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="name border border-gray-300 rounded-md p-2 dark:bg-slate-900 w-full"
          />
          {errors.projectName && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.projectName}
            </p>
          )}
        </div>

        {/* Project Status */}
        <div>
          <label className="block ml-6 text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
            Project Status
          </label>
          <select
            name="status"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="add border border-gray-300 rounded-md p-2 text-gray-700 w-full"
          >
            <option disabled value="">
              Choose
            </option>

            <option value="0">Not Started</option>
            <option value="2">In Progress</option>
            <option value="4">Completed</option>
            <option value="6">Pending</option>
            <option value="8">Under Review</option>
            <option value="10">Cancelled</option>
          </select>
          {errors.projectStatus && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.projectStatus}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch */}
        <div className="p-1 mt-4">
          <label className="total block text-sm font-medium ml-6">Branch</label>
          <Select
            options={branches}
            name="branch_id"
            placeholder="Select branch"
            className="custom-select select1"
            onChange={(selected) => setSelectedBranch(selected)}
          />
          {errors.selectedBranch && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedBranch}
            </p>
          )}
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
            />

            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Add New Service Modal */}
            <Dialog
              open={isBranchModalOpen}
              onClose={() => setIsBranchModalOpen(false)}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-m sm:items-center sm:p-0">
                  <DialogPanel className="relative transform overflow-hidden dark:bg-slate-900 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="branch px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900"
                          >
                            Add New Branch
                          </DialogTitle>
                          <div className="mt-2 space-y-4">
                            <input
                              type="text"
                              placeholder="Enter branch name"
                              value={newBranchName}
                              onChange={(e) => setNewBranchName(e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="text"
                              placeholder="Enter latitude"
                              value={newBranchLatitude}
                              onChange={(e) =>
                                setNewBranchLatitude(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="text"
                              placeholder="Enter longitude"
                              value={newBranchLongitude}
                              onChange={(e) =>
                                setNewBranchLongitude(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="branch bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveBranch}
                        className="inline-flex mr-60 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Save Branch
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsBranchModalOpen(false)}
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
          {errors.selectedServices && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedServices}
            </p>
          )}
        </div>

        {/* Project Owner */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            Project Owner
          </label>
          <div className="flex items-center mt-1">
            <Select
              options={owners}
              value={selectedOwner}
              onChange={(selected) => setSelectedOwner(selected)}
              placeholder="Select owner"
              className="select1 custom-select flex-1"
              name="project_owner_id"
            />

            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Add New Owner Modal */}
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
                          <div className="mt-2 space-y-4">
                            <input
                              type="text"
                              placeholder="Enter owner name"
                              value={newOwnerName}
                              onChange={(e) => setNewOwnerName(e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="email"
                              placeholder="Enter owner email"
                              value={newOwnerEmail}
                              onChange={(e) => setNewOwnerEmail(e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="tel"
                              placeholder="Enter owner phone"
                              value={newOwnerPhone}
                              onChange={(e) => setNewOwnerPhone(e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <div className="mb-4">
                              <label
                                htmlFor="branch"
                                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
                              ></label>
                              <select
                                id="branch"
                                name="branch_id"
                                value={
                                  selectedBranch ? selectedBranch.value : ""
                                }
                                onChange={(e) => {
                                  const selected = branches.find(
                                    (branch) => branch.value === e.target.value
                                  );
                                  setSelectedBranch(selected);
                                }}
                                className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                                  errors.selectedBranch
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                }`}
                              >
                                <option value="" disabled>
                                  Select Branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.value}
                                    value={branch.value}
                                  >
                                    {branch.label}
                                  </option>
                                ))}
                              </select>
                              {errors.selectedBranch && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.selectedBranch}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owner bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveOwner}
                        className="inline-flex mr-60 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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
          {errors.selectedOwner && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedOwner}
            </p>
          )}
        </div>

        {/* Customer / Contractor */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 ml-6">
            Customer / Contractor
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={customers}
              value={selectedCustomer}
              onChange={(selected) => setSelectedCustomer(selected)}
              placeholder="Select customer"
              className="select1 custom-select flex-1"
              name="customer_constructor_id"
            />

            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Add New Customer Modal */}
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
                          <div className="mt-2 space-y-4">
                            <input
                              type="text"
                              placeholder="Enter customer name"
                              value={newCustomerName}
                              onChange={(e) =>
                                setNewCustomerName(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="email"
                              placeholder="Enter customer email"
                              value={newCustomerEmail}
                              onChange={(e) =>
                                setNewCustomerEmail(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="tel"
                              placeholder="Enter customer phone"
                              value={newCustomerPhone}
                              onChange={(e) =>
                                setNewCustomerPhone(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                             <div className="mb-4">
                              <label
                                htmlFor="branch"
                                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
                              >
                                
                              </label>
                              <select
                                id="branch"
                                name="branch_id"
                                value={
                                  selectedBranch ? selectedBranch.value : ""
                                }
                                onChange={(e) => {
                                  const selected = branches.find(
                                    (branch) => branch.value === e.target.value
                                  );
                                  setSelectedBranch(selected);
                                }}
                                className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                                  errors.selectedBranch
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                }`}
                              >
                                <option value="" disabled>
                                  Select Branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.value}
                                    value={branch.value}
                                  >
                                    {branch.label}
                                  </option>
                                ))}
                              </select>
                              {errors.selectedBranch && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.selectedBranch}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="customer bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveCustomer}
                        className="inline-flex mr-60  w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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
          {errors.selectedCustomer && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedCustomer}
            </p>
          )}
        </div>

        {/* Consultive(s) */}
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
              name="project_consultive_ids[]"
            />

            <button
              onClick={() => setIsConsultiveModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>

            {/* Add New Consultive Modal */}
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
                          <div className="mt-2 space-y-4">
                            <input
                              type="text"
                              placeholder="Enter consultive name"
                              value={newConsultiveName}
                              onChange={(e) =>
                                setNewConsultiveName(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="email"
                              placeholder="Enter consultive email"
                              value={newConsultiveEmail}
                              onChange={(e) =>
                                setNewConsultiveEmail(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                            <input
                              type="tel"
                              placeholder="Enter consultive phone"
                              value={newConsultivePhone}
                              onChange={(e) =>
                                setNewConsultivePhone(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md p-2 dark:bg-slate-900 dark:text-white"
                            />
                             <div className="mb-4">
                              <label
                                htmlFor="branch"
                                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
                              >
                                
                              </label>
                              <select
                                id="branch"
                                name="branch_id"
                                value={
                                  selectedBranch ? selectedBranch.value : ""
                                }
                                onChange={(e) => {
                                  const selected = branches.find(
                                    (branch) => branch.value === e.target.value
                                  );
                                  setSelectedBranch(selected);
                                }}
                                className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                                  errors.selectedBranch
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                }`}
                              >
                                <option value="" disabled>
                                  Select Branch
                                </option>
                                {branches.map((branch) => (
                                  <option
                                    key={branch.value}
                                    value={branch.value}
                                  >
                                    {branch.label}
                                  </option>
                                ))}
                              </select>
                              {errors.selectedBranch && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.selectedBranch}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="consultive bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={handleSaveConsultive}
                        className="inline-flex mr-60 w-full h-10 justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
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
          {errors.selectedConsultives && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedConsultives}
            </p>
          )}
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
          {errors.inspectionDate && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.inspectionDate}
            </p>
          )}
        </div>

        {/* Engineer */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Engineer
          </label>

          <div className="flex items-center gap-2 mt-1">
            <Select
              options={engineers}
              value={selectedEngineer}
              onChange={(selected) => setSelectedEngineer(selected)}
              placeholder="Select Engineer to assign for inspection"
              className="select1 custom-select flex-1"
              name="inspection_engineer_id"
            />
          </div>
          {errors.selectedEngineer && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.selectedEngineer}
            </p>
          )}
        </div>

        {/* Inspection Time */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Inspection Time
          </label>
          <input
            type="time"
            placeholder=""
            value={inspectionTime}
            onChange={(e) => setInspectionTime(e.target.value)}
            className="mt-1 block w-full text-gray-700 border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:bg-slate-950 dark:text-white"
          />
          {errors.inspectionTime && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.inspectionTime}
            </p>
          )}
        </div>

        <div>
          <label className="total dark:text-white  block ml-6 text-sm font-medium mb-1">
            notes
          </label>
          <textarea
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            
            className="textarea dark:bg-slate-900"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1 ml-6">{errors.notes}</p>
          )}
        </div>

        {/* Inspection Location */}
        <div className="p-1">
          <label className="block text-sm font-medium text-gray-700 ml-6">
            Inspection Location
          </label>
          <div className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 dark:text-white">
            {/* Hidden Inputs for Latitude and Longitude */}
            <input type="hidden" value={position[0]} name="latitude" />
            <input type="hidden" value={position[1]} name="longitude" />

            {/* Map */}
            <div>
              <MapContainer
                center={position}
                zoom={6}
                style={{ height: "300px", width: "100%" }}
                className="!resize"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
                <ChangeMapView center={position} />
              </MapContainer>
            </div>
          </div>
          {errors.inspectionLocation && (
            <p className="text-red-500 text-sm mt-1 ml-6">
              {errors.inspectionLocation}
            </p>
          )}

          {/* Search Location */}
          <form onSubmit={handleSearch} className="mt-4 flex">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md p-2 dark:bg-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:col-span-2">
        <label htmlFor="image" className="mb-2 font-medium text-gray-700">
          Upload Image
          <input
            hidden
            type="file"
            id="image"
            ref={imageInputRef}
            accept="image/*"
            className="img"
          />
        </label>
      </div>

      {/* Add Project Button */}
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

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddNewProject;
