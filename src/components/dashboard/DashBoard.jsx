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
          <div className="p-2 rounded-full">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <rect
                x="4"
                y="25"
                width="30"
                height="30"
                rx="9"
                fill="#10B981"
                transform="rotate(-1 60 80)"
              />

              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="#FDE68A" />
                <path
                  d="M18 25L22 29L32 19"
                  stroke="#10B981"
                  stroke-width="3"
                  fill="none"
                />
              </svg>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">completed</h3>
            <p className="text-sm text-gray-500">Out of stock</p>
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
                fill="#EF4444"
                transform="rotate(-1 60 80)"
              />

              <svg width="40" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="#FEB2B2" />
              

                <line
                  x1="20"
                  y1="20"
                  x2="30"
                  y2="30"
                  stroke="#EF4444"
                  stroke-width="3"
                />
                <line
                  x1="30"
                  y1="20"
                  x2="20"
                  y2="30"
                  stroke="#EF4444"
                  stroke-width="3"
                />

              </svg>
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
