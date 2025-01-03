import React from 'react'

const Chartjs = () => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
   
   <div className="bg-white shadow-md rounded-lg p-6 w-80">
      {/* القسم العلوي: العنوان والنسبة */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Total Projects</h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <span className="text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full">
          -6.8%
        </span>
        <div className="mt-4">
        <p className="text-1xl font-bold text-gray-800">16,247</p>
      </div>

      </div>
      <div className="mt-4">
        <div className="h-24 flex justify-center items-center bg-gray-50 rounded-lg">
          <div className="w-full flex justify-around">
            <div className="h-20 w-2 bg-blue-600"></div>
            <div className="h-16 w-2 bg-blue-300"></div>
            <div className="h-18 w-2 bg-blue-600"></div>
            <div className="h-10 w-2 bg-blue-300"></div>
            <div className="h-16 w-2 bg-blue-300"></div>
            <div className="h-18 w-2 bg-blue-600"></div>
            <div className="h-20 w-2 bg-blue-300"></div>
          </div>
        </div>
      </div>

      {/* وصف الحالات */}
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

   {/* القسم الثاني  */}
  <div class="bg-green-500 p-6 rounded-lg text-white">
    Section 2
  </div>

   {/* القسم الثالث  */}
  <div class="bg-red-500 p-6 rounded-lg text-white">
    Section 3
  </div>

   {/* القسم الرابع  */}
  <div class="bg-yellow-500 p-6 rounded-lg text-white">
    Section 4
  </div>
</div>

  )
}

export default Chartjs
