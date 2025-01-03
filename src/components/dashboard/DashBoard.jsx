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
    <>
      <div className="p-4 md:p-16 rounded-lg">
        <h1 className="text-black text-4xl font-bold">Project Manager</h1>
        <p className="text-gray-500 py-3">
          Here's what's going on at your business right now
        </p>

        {/* قسم الحالة مع تصميم ريسبونسيف */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Pending */}
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-yellow-600">
                <rect
                  x="20%"
                  y="0"
                  width="20%"
                  height="100%"
                  fill="currentColor"
                />
                <rect
                  x="60%"
                  y="0"
                  width="20%"
                  height="100%"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
              <p className="text-sm text-gray-500">Awaiting process</p>
            </div>
          </div>

          {/* Processing */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.28-10.28a1 1 0 00-1.41 0L9 11.59l-1.87-1.88a1 1 0 10-1.41 1.41l2.58 2.59a1 1 0 001.41 0l4.29-4.29a1 1 0 000-1.41z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Processing
              </h3>
              <p className="text-sm text-gray-500">3 Projects</p>
            </div>
          </div>

          {/* Completed */}
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

          {/* Canceled */}
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.46a1 1 0 00-1.41 0L10 9.59 7.87-1.88a1 1 0 10-1.41 1.41L8.59 11l-2.13 2.13a1 1 0 101.41 1.41L10 12.41l2.13 2.13a1 1 0 001.41-1.41L11.41 11l2.13-2.13a1 1 0 000-1.41z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Canceled</h3>
              <p className="text-sm text-gray-500">Out of stock</p>
            </div>
          </div>
        </div>

        <hr className="mt-6 border-t-2" />
      </div>

      <div className="p-4 md:p-2 bg-gray-100 rounded-lg ml-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-black ">
            Total Sells
            <span className="block text-sm font-normal text-gray-500">
              Payment received across all channels
            </span>
          </h2>

          <div className="flex items-center mr-16 space-x-2 mt-4 md:mt-0">
            <select className="border border-gray-300 w-64 rounded-md p-2 text-gray-700 bg-white focus:outline-none">
              <option>Mar 1 - 31, 2022</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="w-full lg:w-7/12">
            <canvas ref={chartRef} id="lineChart"></canvas>
          </div>
        </div>
      </div>
      <Chartjs/>
    </>
  );
};

export default DashBoard;
