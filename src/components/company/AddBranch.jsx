import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Cookies from 'js-cookie';


const AddBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [branchData, setBranchData] = useState(null);
  const [position, setPosition] = useState([23.8859, 45.0792]);


  const openInGoogleMaps = () => {
    if (position) {
        const [lat, lng] = position;
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(googleMapsUrl, "_blank"); // Open in a new tab
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


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(e);

   
    const formData = new FormData();

    formData.append("name", branchName)
    formData.append("latitude", position[0])
    formData.append("longitude", position[1])

    console.log(formData)
    try {
      const token = Cookies.get('token');
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addBranch",
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        console.error("تفاصيل الخطأ:", result);
        throw new Error(result.msg || "فشل في إضافة الفرع");
      }
      
      setBranchData(result.data);
      console.log(branchData)
      toast.success(result.msg || "تم إضافة الفرع بنجاح!");

      setTimeout(() => {
        navigate("/company/Branchs");
      }, 2000);
    } catch (error) {
      toast.error("خطأ: " + error.message);
      console.error("خطأ:", error);
    }
  };

  useEffect(() => {
    console.log(branchName)
  },[branchName])


  return (
    <div className="service max-w-lg mt-24 mx-auto p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Branch Name 
          </label>
          <input
            type="text"
            value={branchName}
            name="name"
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
          <input
              type="hidden"
              hidden
              value={position[0]}
              name="latitude"
            />
            <input
              type="hidden"
              hidden
              value={position[1]}
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

        <button
          type="submit"
          className="w-full mt-5  py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
          Add Branch
        </button>
          </div>
      </form>

      {branchData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">تفاصيل الفرع:</h3>
          <p>
            <strong>ID:</strong> {branchData.id}
          </p>
          <p>
            <strong>Name:</strong> {branchData.name}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            <a
              href={branchData.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Show on map
            </a>
          </p>
        </div>
      )}

      {/* مكون التوست */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // لضبط اتجاه النصوص للعربية
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddBranch;
