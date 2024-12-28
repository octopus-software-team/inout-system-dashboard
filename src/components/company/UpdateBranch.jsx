import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from 'js-cookie';

const UpdateBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    country_id: "",
    city_id: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCountries = async () => {
    try {
      const token = Cookies.get('token');
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
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = Cookies.get('token');
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
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchCities();

    if (location.state) {
      setFormData({
        name: location.state.name || "",
        latitude: location.state.latitude || "",
        longitude: location.state.longitude || "",
        country_id: location.state.country_id || "",
        city_id: location.state.city_id || "",
      });
      setLoading(false);
    } else {
      const fetchBranchData = async () => {
        try {
          const token = Cookies.get('token');
          if (!token) {
            toast.error("Authentication token not found. Please log in.");
            navigate("/login");
            return;
          }

          const response = await fetch(
            `https://inout-api.octopusteam.net/api/front/getBranch/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.msg || "Failed to fetch branch data");
          }

          setFormData({
            name: result.data.name || "",
            latitude: result.data.latitude || "",
            longitude: result.data.longitude || "",
            country_id: result.data.country_id || "",
            city_id: result.data.city_id || "",
          });
        } catch (error) {
          toast.error("Error: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBranchData();
    }
  }, [id, location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        navigate("/login");
        return;
      }

      const form = new FormData();
      form.append("name", formData.name);
      form.append("longitude", formData.longitude);
      form.append("latitude", formData.latitude);
      form.append("country_id", formData.country_id);
      form.append("city_id", formData.city_id);

      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateBranch/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || "Failed to update branch");
      }

      toast.success(result.msg || "Branch updated successfully!");

      setTimeout(() => {
        navigate("/company/branchs");
      }, 2000);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h2 className="text-center font-bold text-3xl text-black">Update Branch</h2>
        <p className="text-center mt-4">Loading branch data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Update Branch</h2>
      <form
        onSubmit={handleSubmit}
        className="service mt-5 p-5 border border-gray-200 shadow-lg rounded-lg max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Branch Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="country_id">
            Country
          </label>
          <select
            id="country_id"
            name="country_id"
            value={formData.country_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select a Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="city_id">
            City
          </label>
          <select
            id="city_id"
            name="city_id"
            value={formData.city_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select a City</option>
            {cities
              .filter((city) => city.country_id === parseInt(formData.country_id))
              .map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>

        <MapContainer
          center={[formData.latitude || 23.8859, formData.longitude || 45.0792]}
          zoom={6}
          style={{ height: "200px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[formData.latitude || 23.8859, formData.longitude || 45.0792]}
          />
        </MapContainer>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 mt-3 w-full text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Update Branch
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UpdateBranch;
