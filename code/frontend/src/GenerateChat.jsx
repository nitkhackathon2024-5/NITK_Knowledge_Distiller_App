import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllGraphs, getAGraph } from "./api";

const GenerateChat = () => {
  const user = useSelector((state) => state.user);

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate authentication state
  const [previousGraphs, setPreviousGraphs] = useState([]); // Simulate previously accessed graphs
  const navigate = useNavigate();

  useEffect(() => {
    const call = async () => {
      try {
        // Check if user is defined
        if (user) {
          // console.log("User is defined:", user);

          const data = await getAllGraphs(user);

          // Map data to the required format and set state
          const graphs = data.graphs.map((item, index) => ({
            id: item.graph_id,
            title: `Graph ${index + 1}`,
            description: `Knowledge graph ${index + 1}`,
          }));

          // Set the state once with all graphs
          setPreviousGraphs(graphs);
        }
      } catch (error) {
        console.error("Error fetching graphs:", error);
      }
    };

    call();
  }, [user]);
  const handleGenerateGraph = () => {
    if (!user) {
      // Redirect to signup page if not logged in
      navigate("/signup");
    } else {
      // Redirect to the UploadButton page if logged in
      navigate("/upload", { state: null });
    }
  };

  const handleGraphClick = async (graphId) => {
    console.log("Graph ID:", graphId);

    // Redirect to the specific chat/graph page (replace with actual path)
    const graph = await getAGraph(user, graphId);
    console.log("Graph data:", graph);

    const graphWithId = { ...graph, graphId };

    navigate("/upload", { state: graphWithId });
  };

  return (
    <div className="bg-black overflow-hidden">
      <section
        id="generate-graph"
        className="relative block h-screen px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-900 bg-neutral-900/30 flex flex-col items-center justify-center"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-400 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
            Generate Your Knowledge Graph
          </span>
          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl animate-pulse">
            Visualize Your Study Materials Effortlessly
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            Use our knowledge graph generator to automatically organize and
            visualize your study materials. Click the button below to get
            started.
          </p>
        </div>

        {/* If user is logged in and has previous graphs, show them as links */}
        {user && previousGraphs.length > 0 ? (
          <div className="relative mx-auto max-w-md z-10 pt-14 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {previousGraphs.map((graph) => (
                <div
                  key={graph.id}
                  onClick={() => handleGraphClick(graph.id)}
                  className="mb-4 p-4 bg-neutral-800 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-700 transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {graph.title}
                  </h3>
                  <p className="text-gray-400">{graph.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerateGraph}
              className="w-full mt-8 py-3 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Generate a New Knowledge Graph
            </button>
          </div>
        ) : (
          // Show default view if user is not logged in or no previous graphs
          <div className="relative mx-auto max-w-md z-10 pt-14 text-center">
            <button
              onClick={handleGenerateGraph}
              className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Generate My Knowledge Graph
            </button>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 z-0 h-full w-full border-b"
          style={{
            backgroundImage:
              "linear-gradient(to right top, rgba(79, 70, 229, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(92, 79, 240, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 z-0 h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to left top, rgba(220, 38, 38, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(92, 79, 240, 0.2)",
          }}
        ></div>
      </section>
    </div>
  );
};

export default GenerateChat;
