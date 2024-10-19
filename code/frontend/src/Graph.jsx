// // src/Graph.js
// import React, { useEffect, useState } from "react";
// import Cytoscape from "cytoscape";
// import cytoscapeQtip from "cytoscape-qtip";
// import $ from "jquery"; // qTip requires jQuery

// cytoscapeQtip(Cytoscape, $);

// const Graph = ({ key, graph }) => {
//   console.log(graph);

//   const [activeNode, setActiveNode] = useState(null); // For storing currently clicked node

//   let elements = [];
//   if (graph) {
//     // console.log("Graph : " + graph);

//     elements = graph.data;
//   }

//   useEffect(() => {
//     if (graph) {
//       // Logic to render or update the graph
//     }
//   }, [graph]);

//   useEffect(() => {
//     const cy = Cytoscape({
//       container: document.getElementById("cy"),
//       elements: elements,
//       style: [
//         {
//           selector: "node",
//           style: {
//             shape: "ellipse",
//             width: "70px",
//             height: "70px",
//             backgroundColor: (node) => {
//               switch (node.data("category")) {
//                 case "Concept":
//                   return "#007BFF";
//                 case "Application":
//                   return "#28A745";
//                 case "Library":
//                   return "#FFC107";
//                 case "Operating system":
//                   return "#FF5733";
//                 case "Architecture":
//                   return "#6F42C1";
//                 default:
//                   return "#6C757D";
//               }
//             },
//             label: "data(id)",
//             color: "bg-black-800",
//             "font-size": "12px",
//             "text-valign": "center",
//             "text-halign": "center",
//             "text-wrap": "wrap",
//             "text-max-width": "70px",
//           },
//         },
//         {
//           selector: "edge",
//           style: {
//             width: 3,
//             lineColor: "#888",
//             "target-arrow-color": "#888",
//             "target-arrow-shape": "triangle",
//             "curve-style": "bezier",
//             label: "data(Type)",
//             "font-size": "10px",
//             "text-rotation": "autorotate",
//             "text-margin-y": 10,
//             "text-background-color": "#fff",
//             "text-background-opacity": 0.8,
//             "text-margin-x": 5,
//           },
//         },
//       ],
//       layout: {
//         name: "cose",
//         idealEdgeLength: 150,
//         nodeRepulsion: 1200,
//         edgeElasticity: 100,
//         gravity: 0.1,
//         numIter: 1500,
//         animate: true,
//         animationDuration: 1500,
//         padding: 30,
//       },
//     });

//     // Click event listener to toggle content
//     cy.nodes().forEach((node) => {
//       node.on("click", function () {
//         const nodeId = this.id();
//         if (activeNode === nodeId) {
//           setActiveNode(null); // Hide content if clicked again
//         } else {
//           setActiveNode(nodeId); // Show content on click
//         }
//       });
//     });

//     return () => {
//       cy.destroy();
//     };
//   }, [elements, activeNode]);

//   return (
//     <div>
//       <div id="cy" style={{ width: "100%", height: "600px" }} />
//       {activeNode && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "10px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <strong>{activeNode}</strong>:{" "}
//           {elements.find((el) => el.data.id === activeNode).data.content}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Graph;

import React, { useEffect, useState } from "react";
import Cytoscape from "cytoscape";
import cytoscapeQtip from "cytoscape-qtip";
import $ from "jquery"; // qTip requires jQuery

cytoscapeQtip(Cytoscape, $);

const Graph = ({ key, graph }) => {
  console.log(graph);

  const [activeNode, setActiveNode] = useState(null);

  // Function to validate and filter elements
  const validateAndFilterElements = (rawElements) => {
    if (!rawElements) return [];

    // First, collect all valid nodes
    const nodes = rawElements.filter(
      (el) => el.data.id && !el.data.source && !el.data.target
    );
    const nodeIds = new Set(nodes.map((node) => node.data.id));

    // Then, filter edges to only include those with existing source and target nodes
    const edges = rawElements.filter((el) => {
      if (!el.data.source || !el.data.target) return false;
      return nodeIds.has(el.data.source) && nodeIds.has(el.data.target);
    });

    // Log any skipped edges for debugging
    rawElements.forEach((el) => {
      if (el.data.source && el.data.target) {
        if (!nodeIds.has(el.data.source)) {
          console.warn(
            `Skipping edge: source node "${el.data.source}" not found`
          );
        }
        if (!nodeIds.has(el.data.target)) {
          console.warn(
            `Skipping edge: target node "${el.data.target}" not found`
          );
        }
      }
    });

    return [...nodes, ...edges];
  };

  let elements = [];
  if (graph) {
    elements = validateAndFilterElements(graph.data);
  }

  useEffect(() => {
    if (graph) {
      // Logic to render or update the graph
    }
  }, [graph]);

  useEffect(() => {
    const cy = Cytoscape({
      container: document.getElementById("cy"),
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            shape: "ellipse",
            width: "70px",
            height: "70px",
            backgroundColor: (node) => {
              switch (node.data("category")) {
                case "Concept":
                  return "#007BFF";
                case "Application":
                  return "#28A745";
                case "Library":
                  return "#FFC107";
                case "Operating system":
                  return "#FF5733";
                case "Architecture":
                  return "#6F42C1";
                default:
                  return "#6C757D";
              }
            },
            label: "data(id)",
            color: "bg-black-800",
            "font-size": "12px",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "70px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            lineColor: "#888",
            "target-arrow-color": "#888",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(Type)",
            "font-size": "10px",
            "text-rotation": "autorotate",
            "text-margin-y": 10,
            "text-background-color": "#fff",
            "text-background-opacity": 0.8,
            "text-margin-x": 5,
          },
        },
      ],
      layout: {
        name: "cose",
        idealEdgeLength: 150,
        nodeRepulsion: 1200,
        edgeElasticity: 100,
        gravity: 0.1,
        numIter: 1500,
        animate: true,
        animationDuration: 1500,
        padding: 30,
      },
    });

    // Click event listener to toggle content
    cy.nodes().forEach((node) => {
      node.on("click", function () {
        const nodeId = this.id();
        if (activeNode === nodeId) {
          setActiveNode(null);
        } else {
          setActiveNode(nodeId);
        }
      });
    });

    return () => {
      cy.destroy();
    };
  }, [elements, activeNode]);

  return (
    <div>
      <div id="cy" style={{ width: "100%", height: "600px" }} />
      {activeNode && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <strong>{activeNode}</strong>:{" "}
          {elements.find((el) => el.data.id === activeNode)?.data.content ||
            "No content available"}
        </div>
      )}
    </div>
  );
};

export default Graph;
