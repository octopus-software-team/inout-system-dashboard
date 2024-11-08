import React, { useRef, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Chart } from "chart.js/auto";
import ReviewsProvider from "./ReviewsProvider";

const Chartjs = () => {
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const score = 72; 


  const calcColor = (percent, start, end) => {
    let a = percent / 100,
      b = (end - start) * a,
      c = b + start;

    return "hsl(" + c + ", 100%, 50%)";
  };

  useEffect(() => {
    const barCtx = barChartRef.current.getContext("2d");
    const barChartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: "#0000FF",
            borderWidth: 7,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { display: false } },
          x: { ticks: { display: false } },
        },
        responsive: true,
      },
    });

    const lineCtx = lineChartRef.current.getContext("2d");
    const lineChartInstance = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: [
          "01 May",
          "02 May",
          "03 May",
          "04 May",
          "05 May",
          "06 May",
          "07 May",
        ],
        datasets: [
          {
            label: "May",
            data: [150, 120, 140, 180, 170, 190, 250],
            borderColor: "#0000FF",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            borderWidth: 2,
          },
          {
            label: "April",
            data: [100, 130, 120, 160, 150, 140, 180],
            borderColor: "#808080",
            backgroundColor: "rgba(128, 128, 128, 0.1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "bottom" },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: true, color: "#e0e0e0" },
            ticks: { display: false },
          },
          x: {
            grid: { display: true, color: "#e0e0e0" },
            ticks: { display: false },
          },
        },
      },
    });

    return () => {
      barChartInstance.destroy();
      lineChartInstance.destroy();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* القسم الأول: الشارت الشريطي */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Total Projects
            </h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
          <span className="text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full">
            -6.8%
          </span>
          <div className="mt-4">
            <p className="text-1xl font-bold text-gray-800">16,247</p>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={barChartRef} width="200" height="200"></canvas>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <span className="text-gray-600">52%</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600">Pending payment</span>
          </div>
          <span className="text-gray-600">48%</span>
        </div>
      </div>

      {/* القسم الثاني: الشارت الخطي */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Last 7 days</h3>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={lineChartRef} width="200" height="100"></canvas>
        </div>
      </div>

      {/* القسم الثالث: دائرة التقدم */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12 h-96 flex flex-col items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Total Projects
          </h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>

        <div className="mt-4 flex justify-center w-full">
          <div style={{ width: "150px" }}>
            <CircularProgressbar
              value={72}
              text={`${72}%`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#3b82f6",
                trailColor: "#d1d5db",
                textSize: "24px",
                strokeLinecap: "round",
              })}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <span className="text-gray-600">52%</span>
        </div>

        <div className="mt-2 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600">Pending payment</span>
          </div>
          <span className="text-gray-600">48%</span>
        </div>
      </div>

      {/* القسم الرابع */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
            Paying vs non paying
            </h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
          
        </div>

        <div
          className="mt-4 flex justify-center items-center"
          style={{ height: "100px" }}
        >
          <ReviewsProvider valueStart={0} valueEnd={score}>
            {({ value }) => (
              <div
                style={{ width: "100px", height: "50px", overflow: "hidden" }}
              >
                <CircularProgressbar
                  value={value}
                  circleRatio={0.5}
                  styles={{
                    trail: {
                      strokeLinecap: "butt",
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                    },
                    path: {
                      strokeLinecap: "butt",
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                      stroke: calcColor(value, 0, 120),
                    },
                    text: {
                      fill: "#ddd",
                      fontSize: "16px",
                    },
                  }}
                  strokeWidth={10}
                />
              </div>
            )}
          </ReviewsProvider>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Paying customer</span>
          </div>
          <span className="text-gray-600">30%</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600">Non-paying customer</span>
          </div>
          <span className="text-gray-600">70%</span>
        </div>
      </div>
    </div>
  );
};

export default Chartjs;
