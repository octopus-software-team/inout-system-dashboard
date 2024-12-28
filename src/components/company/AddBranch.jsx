import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast"; // Updated import
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";

const AddBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [position, setPosition] = useState([23.8859, 45.0792]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  const fetchCountries = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCountries",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCountries(data.data || []);
      console.log("Fetched Countries:", data.data); // Debugging
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries.");
    }
  };

  const fetchCities = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCities",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCities(data.data || []);
      console.log("Fetched Cities:", data.data); // Debugging
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to fetch cities.");
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchCities();
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branchName || !selectedCountry || !selectedCity) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", branchName);
    formData.append("latitude", position[0]);
    formData.append("longitude", position[1]);
    formData.append("country_id", Number(selectedCountry)); // Convert to number
    formData.append("city_id", Number(selectedCity)); // Convert to number

    console.log("Submitting Branch:", {
      name: branchName,
      latitude: position[0],
      longitude: position[1],
      country_id: Number(selectedCountry),
      city_id: Number(selectedCity),
    }); // Debugging

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addBranch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.status==200) {
        toast.success("Branch added successfully!");
        setTimeout(() => {
          navigate("/company/Branchs");
        }, 2000);
      } else if (response.status === 422) {
        // Handle validation errors if your API returns them
        const validationErrors = result.data;
        if (validationErrors) {
          Object.keys(validationErrors).forEach((field) => {
            toast.error(`${field}: ${validationErrors[field].join(" ")}`);
          });
        } else {
          toast.error(result.msg || "Failed to add branch.");
        }
      } else {
        toast.error(result.msg || "Failed to add branch.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="service max-w-lg mt-24 mx-auto p-6 rounded-lg shadow-sm">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            width: "350px",
            // Adjust height if necessary or remove
            // height: "80px",
            fontSize: "1.2rem",
          },
        }}
      />
      <h2 className="text-2xl font-semibold text-center mb-4">Add Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Branch Name
          </label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Select a Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
            {/* Removed the empty option as it's unnecessary */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Select a City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
            {/* Removed the "غير محدد" option or you can keep it if necessary */}
          </select>
        </div>

        <MapContainer
          center={[23.8859, 45.0792]}
          zoom={6}
          style={{ height: "200px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>

        <button
          type="submit"
          className="w-full mt-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
        >
          Add Branch
        </button>
      </form>
    </div>
  );
};

export default AddBranch;
