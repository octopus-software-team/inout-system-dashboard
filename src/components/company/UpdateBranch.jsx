// src/components/UpdateBranch.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Cookies from 'js-cookie';


const UpdateBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

    const openInGoogleMaps = () => {
      if (formData.longitude && formData.latitude) {
          const {latitude, longitude} = formData;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          window.open(googleMapsUrl, "_blank"); // Open in a new tab
      }
  };

  const LocationMarker = () => {
      useMapEvents({
          click(e) {
              const { latitude, longitude } = e.latlng;
              setFormData((prev) => ({...prev, longitude: longitude, latitude: latitude}));
          },
      });

      const {latitude, longitude} = formData;
      return formData.longitude && formData.latitude ? <Marker position={[latitude, longitude]} /> : null;
  };



  useEffect(() => {
    // استخدام البيانات المرسلة عبر الـ state إذا كانت موجودة
    if (location.state) {
      setFormData({
        name: location.state.name || "",
        latitude: location.state.latitude || "",
        longitude: location.state.longitude || "",
      });
      setLoading(false);
    } else {
      // إذا لم تكن البيانات موجودة في الـ state، قم بجلبها من الـ API
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();
          console.log("API Response:", result); // تحقق من الاستجابة

          if (!response.ok) {
            console.error("Error details:", result);
            throw new Error(result.msg || "Failed to fetch branch data");
          }

          setFormData({
            name: result.data.name || "",
            latitude: result.data.name || "",
            longitude: result.data.name || "",
          });
        } catch (error) {
          toast.error("Error: " + error.message);
          console.error("Error fetching branch data:", error);
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Branch name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    } else {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,5}))|" + // domain
          "localhost|" + // or localhost
          "\\d{1,3}(\\.\\d{1,3}){3})" + // or IP
          "(\\:\\d+)?(\\/[-a-zA-Z0-9%_\\+.~#?&//=]*)?$",
        "i"
      );
      if (!urlPattern.test(formData.location)) {
        newErrors.location = "Please enter a valid location URL.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validate()) {
    //   toast.error("Please correct the errors in the form.");
    //   return;
    // }

    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        navigate("/login");
        return;
      }

      const form = new FormData();

      form.append("name", formData.name)
      form.append("longitude", formData.longitude)
      form.append("latitude", formData.latitude)


      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateBranch/${id}`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({
          //   name: formData.name.trim(),
          //   location: formData.location.trim(),
          // }),
          body: form
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Error details:", result);
        throw new Error(result.msg || "Failed to update branch");
      }

      toast.success(result.msg || "Branch updated successfully!");

      setTimeout(() => {
        navigate("/company/branchs");
      }, 2000);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.error("Error updating branch:", error);
    }
  };


  useEffect(() => {
    console.log(formData);
  },[formData])
  

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
            className={`w-full dark:bg-slate-900 dark:text-white px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

          <input
              type="hidden"
              hidden
              value={formData.latitude}
              onChange={handleInputChange}
              name="latitude"
            />
            <input
              type="hidden"
              hidden
              value={formData.longitude}
              onChange={handleInputChange}
              name="longitude"
            />
              

          <div>
            <MapContainer
                center={[23.8859, 45.0792]}
                zoom={6}
                style={{ height: "100px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
            </MapContainer>
            {/* <button
                onClick={openInGoogleMaps}
                style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Open in Google Maps
            </button> */}
          </div>


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
