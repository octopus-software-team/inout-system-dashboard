import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa"; // Importing Spinner icon for loading state

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
  { label: "Piece", value: "piece" },
];

const UpdateMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const material = location.state; // The material passed via navigation

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    stock: "",
    type: "",
    branch_id: "",
    material_category_id: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [branches, setBranches] = useState([]); // حالة لتخزين بيانات الفروع
  const [materialCategories, setMaterialCategories] = useState([]); // حالة لتخزين فئات المواد

  useEffect(() => {
    if (material) {
      setFormData({
        id: material.id || "",
        // name: material.name || "",
        stock: material.stock || "",
        type: material.type || "",
        branch_id: material.branch_id || "",
        material_category_id: material.material_category_id || "",
        description: material.description || "",
      });
    }

    // جلب بيانات الفروع
    const token = Cookies.get("token");
    if (token) {
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

      // جلب بيانات فئات المواد
      fetch("https://inout-api.octopusteam.net/api/front/getMaterialCategory", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch material categories");
          }
          return res.json();
        })
        .then((resData) => {
          if (resData && resData.data) {
            setMaterialCategories(resData.data);
          } else {
            toast.error("No material categories found");
          }
        })
        .catch((err) => {
          console.error("Error fetching material categories:", err);
          toast.error("Failed to fetch material categories");
        });
    } else {
      toast.error("No token found. Please log in.");
    }
  }, [material]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    console.log("Token:", token);

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const { id, name, stock, type, branch_id, material_category_id, description } = formData;

    // if (!name || !stock || !type || !branch_id || !material_category_id || !description) {
    //   toast.error("All fields are required.");
    //   return;
    // }

    if (stock < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    const updatedMaterial = {
      name,
      stock: parseInt(stock),
      type: type,
      branch_id: parseInt(branch_id),
      material_category_id: parseInt(material_category_id),
      description,
    };

    console.log("Updated Material:", updatedMaterial);

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateMaterial/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMaterial),
        }
      );

      const resData = await response.json();

      if (response.ok) {
        toast.success(resData.msg || "Material updated successfully!");
        setTimeout(() => {
          navigate("/company/assets/addmaterials");
        }, 2000);
      } else if (response.status === 422) {
        // Handle validation errors
        const validationErrors = resData.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" ");
        });
        setErrors(formattedErrors);
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(resData.msg || "Failed to update material.");
      }
    } catch (error) {
      toast.error("Failed to update material. Please try again.");
      console.error("Error updating material:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100 dark:bg-slate-800 py-10 px-4">
      {/* Toaster for react-hot-toast */}
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Update Material
        </h2>

        {/* Stock Field */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.stock
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Enter stock quantity"
            required
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Material Category Field */}
        <div className="mb-4">
          <label
            htmlFor="material_category_id"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Material Category
          </label>
          <select
            id="material_category_id"
            name="material_category_id"
            value={formData.material_category_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.material_category_id
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            required
          >
            <option value="">Select Material Category</option>
            {materialCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.material_category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.material_category_id}</p>
          )}
        </div>

        {/* Type Field */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.type
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            required
          >
            <option value="">Select type</option>
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        {/* Branch Field */}
        <div className="mb-4">
          <label
            htmlFor="branch_id"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Branch
          </label>
          <select
            id="branch_id"
            name="branch_id"
            value={formData.branch_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.branch_id
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            required
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch_id && (
            <p className="text-red-500 text-sm mt-1">{errors.branch_id}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Enter description"
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ${
            isLoading
              ? "opacity-50 cursor-not-allowed flex items-center justify-center"
              : ""
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Material"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateMaterials;