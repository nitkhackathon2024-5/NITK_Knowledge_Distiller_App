import React from 'react'
// import Navbar from './shared/Navbar'
import Sidebar from './SideNavbar'
import UploadButton from './UploadButton'

const Upload = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <hr className="border-t-2 border-gray-200" />
      {/* Main content container */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <UploadButton />
      </div>
      
    </div>
  );
}

export default Upload