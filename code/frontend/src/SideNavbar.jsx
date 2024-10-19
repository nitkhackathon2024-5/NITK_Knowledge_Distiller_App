import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed ${
        isOpen ? "w-64" : "w-20"
      } h-full transition-all duration-300 ease-in-out shadow-lg`} 
      style={{
        background: "#1F2937", // Set background color to gray-800
        borderRight: "1px solid rgba(92, 79, 240, 0.2)",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Fixed header section */}
        <div className="p-4">
          {isOpen && (
            <h2 className="text-lg font-bold text-white"></h2> // Set text color to white
          )}
        </div>

        {/* List section (non-scrollable) */}
        <div className="flex-grow overflow-hidden">
          <ul className="mt-4 space-y-2">
            {[
              "Upload Study Material",
              "View Knowledge Graph",
              "Search Concepts",
              "Collaboration",
              "Learning Suggestions",
              "Settings",
              "Help & Support",
            ].map((item) => (
              <li
                key={item}
                className={`hover:text-[#FF7043] hover:shadow-md hover:bg-[#FFF3E0] transition-all duration-300 cursor-pointer p-2 rounded text-white ${ // Set text color to white
                  isOpen ? "" : "text-center"
                }`}
              >
                {isOpen ? item : ""}
              </li>
            ))}
          </ul>
        </div>

        {/* Fixed footer section with toggle button */}
        <div className="flex flex-col items-center p-4">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="text-white focus:outline-none hover:text-gray-400" // Set button text color to white
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12H5m7 7l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
            )}
          </button>
          {isOpen && (
            <p className="text-sm text-white mt-2"> {/* Set footer text color to white */}
              &copy; {new Date().getFullYear()} Knowledge Distiller
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
