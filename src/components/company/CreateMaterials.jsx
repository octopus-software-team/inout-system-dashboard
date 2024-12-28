import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';

const units = [
    { label: "Millimeter", value: "mm" },
    { label: "Centimeter", value: "cm" },
    { label: "Meter", value: "m" },
    { label: "Kilometer", value: "km" },
    { label: "Inch", value: "in" },
    { label: "Foot", value: "ft" },
    { label: "Yard", value: "yd" },
    { label: "Mile", value: "mi" },
    { label: "Milligram", value: "mg" },
    { label: "Gram", value: "g" },
    { label: "Kilogram", value: "kg" },
    { label: "Tonne", value: "t" },
    { label: "Ounce", value: "oz" },
    { label: "Pound", value: "lb" },
    { label: "Stone", value: "st" },
    { label: "Milliliter", value: "ml" },
    { label: "Liter", value: "l" },
    { label: "Cubic meter", value: "m³" },
    { label: "Teaspoon", value: "tsp" },
    { label: "Tablespoon", value: "tbsp" },
    { label: "Cup", value: "cup" },
    { label: "Pint", value: "pt" },
    { label: "Quart", value: "qt" },
    { label: "Gallon", value: "gal" },
    { label: "Square meter", value: "m²" },
    { label: "Hectare", value: "ha" },
    { label: "Square kilometer", value: "km²" },
    { label: "Acre", value: "ac" },
    { label: "Square mile", value: "mi²" },
    { label: "Celsius", value: "°C" },
    { label: "Fahrenheit", value: "°F" },
    { label: "Kelvin", value: "K" },
    { label: "Joule", value: "J" },
    { label: "Kilojoule", value: "kJ" },
    { label: "Calorie", value: "cal" },
    { label: "Kilocalorie", value: "kcal" },
    { label: "Watt hour", value: "Wh" },
    { label: "Kilowatt hour", value: "kWh" },
    { label: "Pascal", value: "Pa" },
    { label: "Kilopascal", value: "kPa" },
    { label: "Bar", value: "bar" },
    { label: "Psi", value: "psi" },
    { label: "Piece", value: "piece" }
];

const CreateMaterials = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [type, setType] = useState("");
  const [branchId, setBranchId] = useState(""); // حالة لتخزين اختيار الفرع
  const [branches, setBranches] = useState([]); // حالة لتخزين بيانات الفروع
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch branches");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setBranches(resData.data);
        } else {
          toast.error("No branches found");
        }
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
        toast.error("Failed to fetch branches");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const token = Cookies.get('token');
  
    if (!type) {
      toast.error("Type is required!");
      return;
    }

    if (!branchId) {
      toast.error("Branch is required!");
      return;
    }
  
    const newMaterial = {
      name,
      stock: parseInt(stock),
      type: type, // إرسال النوع كنص كما هو في الـ API
      branch_id: parseInt(branchId),
    };
  
    fetch("https://inout-api.octopusteam.net/api/front/addMaterial", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaterial),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw data;
          });
        }
        return res.json();
      })
      .then((resData) => {
        toast.success(resData.msg || "Material added successfully!"); 
        setTimeout(() => {
          navigate("/company/assets/addmaterials"); 
        }, 2000);
      })
      .catch((err) => {
        console.error("Error creating material:", err);
        if (err.data && err.data.type) {
          toast.error(`Type Error: ${err.data.type.join(", ")}`);
        } else {
          toast.error("Failed to add material. Please try again.");
        }
      });
  };
  
  return (
    <div className="container mt-5">
       <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  width: "350px",
                  height: "80px",
                  fontSize: "1.2rem",
                },
              }}
            />
      <h2 className="text-center font-bold text-2xl text-black">
        Create Material
      </h2>

      <form
        onSubmit={handleSubmit}
        className="service max-w-lg mx-auto p-8 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="name"
          >
            Material Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full dark:bg-slate-900 dark:text-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="stock"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setErrorMessage(""); // إعادة تعيين رسالة الخطأ عند تغيير القيمة
            }}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Type</option> {/* إضافة خيار فارغ لاختيار نوع */}
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )} {/* عرض رسالة الخطأ */}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="branch"
          >
            Branch
          </label>
          <select
            id="branch"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Branch</option> {/* خيار فارغ */}
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className=" text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Create Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterials;
