import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import Chartjs from "../charts/Chartjs";

const DashBoard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            label: "Sample Data",
            data: [10, 20, 15, 30, 25],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* العنوان والوصف */}
      <div className="text-center md:text-left">
        <h1 className="text-black text-2xl md:text-4xl font-bold">
          Project Manager
        </h1>
        <p className="text-gray-500 py-3">
          Here's what's going on at your business right now
        </p>
      </div>

      {/* قسم الحالة (Pending, Processing, etc.) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <rect
                x="4"
                y="25"
                width="30"
                height="30"
                rx="9"
                fill="#FFD89E"
                transform="rotate(-1 60 80)"
              />

              <circle cx="30" cy="30" r="15" fill="#FFEED6" />
              <rect x="26" y="20" width="4" height="20" rx="1" fill="#FFAE42" />
              <rect x="34" y="20" width="4" height="20" rx="1" fill="#FFAE42" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-sm text-gray-500">Awaiting process</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <rect
                x="4"
                y="25"
                width="30"
                height="30"
                rx="9"
                fill="#3B82F6"
                transform="rotate(-1 60 80)"
              />

              <circle cx="25" cy="25" r="15" fill="#9BDDFD" />
                <polygon points="22,18 32,25 22,32" fill="#3B82F6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Processing</h3>
            <p className="text-sm text-gray-500">3 Projects</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.28-10.28a1 1 0 00-1.41 0L9 11.59l-1.87-1.88a1 1 0 10-1.41 1.41l2.58 2.59a1 1 0 001.41 0l4.29-4.29a1 1 0 000-1.41z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            <p className="text-sm text-gray-500">Out of stock</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.46a1 1 0 00-1.41 0L10 9.59 7.87 7.46a1 1 0 00-1.41 1.41L8.59 11l-2.13 2.13a1 1 0 101.41 1.41L10 12.41l2.13 2.13a1 1 0 001.41-1.41L11.41 11l2.13-2.13a1 1 0 000-1.41z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Canceled</h3>
            <p className="text-sm text-gray-500">Out of stock</p>
          </div>
        </div>
      </div>

      {/* الرسم البياني وقسم المبيعات */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black">
              Total Sales
            </h2>
            <span className="block text-sm font-normal text-gray-500">
              Payment received across all channels
            </span>
          </div>

          <select className="border border-gray-300 mt-4 md:mt-0 w-full md:w-auto rounded-md p-2 text-gray-700 bg-white focus:outline-none">
            <option>Mar 1 - 31, 2022</option>
          </select>
        </div>

        {/* الرسم البياني */}
        <div className="w-full h-64">
          <canvas ref={chartRef} id="lineChart"></canvas>
        </div>
      </div>
      <Chartjs />
    </div>
  );
};

export default DashBoard;

