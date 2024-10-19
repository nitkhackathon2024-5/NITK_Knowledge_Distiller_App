// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import { File, FileText, Send, Trash } from "lucide-react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// Importing your actual Graph component
import Graph from "./Graph";
const Sidebar = ({
  isOpen,
  toggleSidebar,
  files,
  handleDeleteFile,
  selectedFiles,
  setSelectedFiles,
}) => {
  const processedFiles =
    files?.length > 0 ? files.map((file) => file.split("/").pop()) : [];

  const handleCheckboxChange = (name) => {
    if (selectedFiles.includes(name)) {
      setSelectedFiles(selectedFiles.filter((fileName) => fileName !== name));
    } else {
      setSelectedFiles([...selectedFiles, name]);
    }
  };

  return (
    <aside
      className={`fixed ${
        isOpen ? "w-64" : "w-20"
      } h-full transition-all duration-300 ease-in-out shadow-lg`}
      style={{
        background: "#1F2937",
        borderRight: "1px solid rgba(92, 79, 240, 0.2)",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          {isOpen && <h2 className="text-lg font-bold text-white">Menu</h2>}
        </div>
        <div className="flex-grow overflow-hidden">
          <ul className="mt-4 space-y-2">
            {processedFiles.length === 0 ? (
              <li className="text-gray-400 text-center">
                No files uploaded yet.
              </li>
            ) : (
              processedFiles.map((item) => (
                <li
                  key={item}
                  className={`flex justify-between items-center hover:text-[#FF7043] hover:shadow-md hover:bg-[#FFF3E0] transition-all duration-300 cursor-pointer p-2 rounded text-white ${
                    isOpen ? "" : "text-center"
                  }`}
                >
                  {isOpen && (
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedFiles.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  )}
                  <span>{isOpen ? item : ""}</span>
                  {isOpen && (
                    <button
                      onClick={() => handleDeleteFile([item])} // Allow individual deletion
                      className="hover:text-red-500"
                      aria-label="Delete File"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-col items-center p-4">
          <button
            onClick={() => handleDeleteFile(selectedFiles)}
            className="bg-red-500 text-white rounded px-2 py-1 mt-2"
            disabled={selectedFiles.length === 0}
          >
            Delete Selected
          </button>
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="text-white focus:outline-none hover:text-gray-400 mt-2"
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
            <p className="text-sm text-white mt-2">
              &copy; {new Date().getFullYear()} Knowledge Distiller
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
  selectedFiles: PropTypes.array.isRequired,
  setSelectedFiles: PropTypes.func.isRequired,
};

const UploadButton = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Graph state management
  const [graphData, setGraphData] = useState(null);
  const [, setIsFirstLoad] = useState(true);
  const [graphKey, setGraphKey] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Initialize graph data from location state
  useEffect(() => {
    if (location.state?.data) {
      setGraphData(location.state);
      setIsFirstLoad(false);
    }
  }, [location.state]);

  const handleFileUpload = (type) => {
    const acceptMap = {
      text: ".txt,.doc,.docx",
      pdf: ".pdf",
      audio: "audio/*",
    };
    fileInputRef.current.setAttribute("accept", acceptMap[type]);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFileNames = selectedFiles.map((file) => file.name);
    setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    fileInputRef.current.value = "";
  };

  const handleDeleteFile = async (namesToDelete) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${namesToDelete.length} file(s)?`
    );
    if (confirmDelete) {
      const formData = new FormData();
      namesToDelete.forEach((name) => {
        formData.append("files", name); // Use 'files[]' to handle multiple files
      });
      console.log(formData);
      formData.append("graph_id", graphData.graphId);
      formData.append("action", "remove");

      try {
        const response = await fetch("http://localhost:5000/updateGraph", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Delete failed");
        }

        await response.json();
        // Handle success (e.g., show a success message)
        alert("Files deleted successfully!");
        // setGraphData(data.data);

        // Update state to remove deleted files
        setFiles((prevFiles) =>
          prevFiles.filter((file) => !namesToDelete.includes(file.name))
        );
        setSelectedFiles((prevSelected) =>
          prevSelected.filter((name) => !namesToDelete.includes(name))
        );
      } catch (error) {
        alert(`Error deleting files: ${error.message}`);
        console.error("Delete error:", error);
      }
    }
  };

  const uploadFilesToBackend = async (formData) => {
    try {
      let url = "http://localhost:5000/createGraph";
      if (graphData) {
        url = "http://localhost:5000/updateGraph";
        formData.append("graph_id", graphData.graphId);
        formData.append("action", "add");
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setGraphData(data.data);
      return { success: true, data };
    } catch (error) {
      console.error("Error uploading files:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      const { success, data, error } = await uploadFilesToBackend(formData);

      if (success) {
        // Update graph data and force re-render
        setGraphData(data);
        setGraphKey((prevKey) => prevKey + 1);
        setIsFirstLoad(false);

        // Clear form
        setFileNames([]);
        setFiles([]);
        fileInputRef.current.value = "";

        alert("Files uploaded successfully!");
      } else {
        alert(`Error uploading files: ${error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-800">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        files={location.state?.graph?.files || graphData?.files}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        handleDeleteFile={handleDeleteFile}
      />

      <div
        className={`flex-grow flex flex-col ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300 overflow-y-auto`}
      >
        <div className="flex-grow flex items-center justify-center">
          <div
            className="w-[1200px] h-[550px] bg-gray-800 border-gray-300 shadow-lg rounded-md p-4 overflow-hidden"
            style={{ position: "relative" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#1F2937",
              }}
            >
              {/* Use location.state.data for initial render and graphData for updates */}
              <Graph key={graphKey} graph={graphData || location.state} />

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                  <div className="text-white">Generating graph...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 w-full p-4 transition-all duration-300">
          <div className="w-full max-w-4xl mx-auto flex justify-center">
            <div className="w-full bg-gray-800 p-4 rounded-full shadow-lg flex flex-col justify-center items-center transform transition-transform duration-300 hover:scale-105">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
              />

              <form
                onSubmit={handleSubmit}
                className="flex items-center w-full"
              >
                <div className="flex gap-2">
                  <button
                    className="hover:bg-gray-700 p-2 rounded-full"
                    onClick={() => handleFileUpload("text")}
                    type="button"
                    disabled={isUploading}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="hover:bg-gray-700 p-2 rounded-full"
                    onClick={() => handleFileUpload("pdf")}
                    type="button"
                    disabled={isUploading}
                  >
                    <File className="w-6 h-6 text-white" />
                  </button>
                  {/* <button
                    className="hover:bg-gray-700 p-2 rounded-full"
                    onClick={() => handleFileUpload("audio")}
                    type="button"
                    disabled={isUploading}
                  >
                    <Music className="w-6 h-6 text-white" />
                  </button> */}
                </div>

                <div className="flex-grow border rounded-md px-3 py-2 text-gray-200 bg-gray-700 overflow-x-auto">
                  {fileNames.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>{fileNames[0]}</span>
                      {fileNames.length > 1 && (
                        <button
                          type="button"
                          className="text-blue-400"
                          onClick={() => setShowAllFiles(!showAllFiles)}
                        >
                          {showAllFiles
                            ? "Show Less"
                            : `+ ${fileNames.length - 1} More`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span>No files selected</span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded-full transition ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
                  disabled={isUploading}
                >
                  <Send className="w-5 h-6" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadButton;
