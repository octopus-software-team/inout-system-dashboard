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
    // إعداد مخطط الأعمدة (Bar Chart)
    const barCtx = barChartRef.current.getContext("2d");
    const barChartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: "#85a9ff",
            borderWidth: 7,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { display: false }, grid: { display: false } },
          x: { ticks: { display: false }, grid: { display: false } },
        },
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    // إعداد مخطط الخط (Line Chart)
    const lineCtx = lineChartRef.current.getContext("2d");
    const lineChartInstance = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: ["01 May", "02 May", "03 May", "04 May", "05 May", "06 May", "07 May"],
        datasets: [
          {
            label: "",
            data: [150, 120, 140, 180, 170, 190, 250],
            backgroundColor: "#222834",
            borderWidth: 2,
            borderColor: "#85a9ff", // يمكنك ضبط لون الخط هنا
            fill: false,
          },
          {
            label: "",
            data: [100, 130, 120, 160, 150, 140, 180],
            borderColor: "#3d4962",
            backgroundColor: "rgba(128, 128, 128, 0.1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }, // إزالة الليجند
        },
        scales: {
          y: { display: false, grid: { display: false } }, // إخفاء محور y
          x: { display: false, grid: { display: false } }, // إخفاء محور x
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
      {/* القسم الأول: Total Projects */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div>
              <h3 className="project1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Projects
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Last 7 days</p>
            </div>
            <div>
              <span className="text-sm ml-8 text-yellow-300 border border-yellow-400 bg-gray-900 px-2 py-1 rounded-full">
                -6.8%
              </span>
            </div>
          </div>
          <div>
            <p className="project1 text-2xl font-bold text-gray-800 dark:text-white">16,247</p>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={barChartRef} width="200" height="200"></canvas>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">52%</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Pending payment</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">48%</span>
        </div>
      </div>

      {/* القسم الثاني: New Customer */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div>
              <h3 className="project1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                New Customer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Last 7 days</p>
            </div>
            <div>
              <span className="text-sm ml-8 text-yellow-300 border border-yellow-400 bg-gray-900 px-2 py-1 rounded-full">
                +26.65%
              </span>
            </div>
          </div>
          <div>
            <p className="project1 text-2xl font-bold text-gray-800 dark:text-white">356</p>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={lineChartRef} width="200" height="100"></canvas>
        </div>
        {/* إزالة أي تسميات إضافية أسفل المخطط إذا كانت موجودة */}
      </div>

      {/* القسم الثالث: دائرة التقدم */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12 h-96 flex flex-col">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Projects
          </h3>
          <p className="text-sm text-gray-500 dark:text-white">Last 7 days</p>
        </div>

        <div className="mt-4 flex justify-center w-full">
          <div style={{ width: "150px" }}>
            <CircularProgressbar
              value={72}
              text={`${72}%`}
              styles={buildStyles({
                textColor: "#fff",
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
            <span className="text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">52%</span>
        </div>

        <div className="mt-2 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Pending payment</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">48%</span>
        </div>
      </div>

      {/* القسم الرابع: Paying vs non paying */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Paying vs non paying
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">Last 7 days</p>
          </div>
        </div>

        <div
          className="mt-4 flex justify-center items-center"
          style={{ height: "100px" }}
        >
          <ReviewsProvider valueStart={0} valueEnd={score}>
            {({ value }) => (
              <div style={{ width: "100px", height: "50px", overflow: "hidden" }}>
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

        {/* إعادة ترتيب علامات العملاء */}
        <div className="mt-10 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 mt-10 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600 mt-10 dark:text-gray-300">Non-paying customer</span>
          </div>
          <span className="text-gray-600 mt-10 dark:text-gray-300">70%</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Paying customer</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">30%</span>
        </div>
      </div>
    </div>
  );
};

export default Chartjs;
