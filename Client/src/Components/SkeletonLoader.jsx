const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-200">
        <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex items-center space-x-4">
          <div className="w-40 h-5 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-24 h-9 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-white border-r border-gray-200 p-4">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-blue-200 animate-pulse rounded"></div>
            <div className="w-28 h-6 bg-gray-200 animate-pulse rounded ml-2"></div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center p-3 rounded-lg">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-24 h-5 bg-gray-200 animate-pulse rounded ml-3"></div>
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-4 flex items-center">
            <div className="w-9 h-9 bg-gray-300 animate-pulse rounded-full"></div>
            <div className="ml-2">
              <div className="w-28 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-3 bg-gray-200 animate-pulse rounded mt-1"></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-28 h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-20 h-8 bg-gray-300 animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="w-40 h-6 bg-gray-300 animate-pulse rounded"></div>
              <div className="w-20 h-5 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 p-4 border-b border-gray-100">
              <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-4 bg-gray-200 animate-pulse rounded justify-self-end"></div>
              <div className="w-24 h-4 bg-gray-200 animate-pulse rounded justify-self-end"></div>
            </div>

            {/* Table Rows */}
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="grid grid-cols-3 p-4 border-b border-gray-100"
              >
                <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-16 h-5 bg-gray-200 animate-pulse rounded justify-self-end"></div>
                <div className="w-24 h-5 bg-gray-200 animate-pulse rounded justify-self-end"></div>
              </div>
            ))}
          </div>

          {/* Empty Space for Additional Content */}
          <div className="mt-8">
            <div className="w-full h-40 bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkeletonLoader;
