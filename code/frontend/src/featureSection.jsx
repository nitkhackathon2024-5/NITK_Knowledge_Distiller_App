import React from "react";

const FeaturesSection = () => {
  return (
    <div className="bg-black">
      <section
        id="features"
        className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-900 bg-neutral-900/30"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-400 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
            Transform Your Study Experience
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            Our app intelligently organizes your study materials, making learning seamless and personalized.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow-lg transform transition-transform duration-500 hover:scale-105 hover:bg-neutral-800"
            >
              <div
                className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
                style={{
                  backgroundImage: "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                  borderColor: "rgb(93, 79, 240)",
                }}
              >
                {feature.icon}
              </div>
              <h3 className="mt-6 text-gray-400 font-semibold text-xl">{feature.title}</h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Dynamic Knowledge Graph Generation",
    description:
      "Analyzes and parses various study materials to extract key concepts, visually representing their relationships in a dynamic knowledge graph that evolves as new materials are added.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-sitemap"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 3v3m0 4v3m0 4v3m-7 -7h3m4 0h3m-3 -4h3m-4 0h-3m-1 -4h-3m1 4v3m1 -3v3m7 -3v3"></path>
      </svg>
    ),
  },
  {
    title: "Intuitive User Interface",
    description:
      "Simplifies the process of uploading study materials and navigating the knowledge graph, allowing users to easily search for specific concepts and retrieve related content.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-layout-sidebar-left"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"></path>
        <path d="M4 8h16"></path>
        <path d="M4 12h16"></path>
        <path d="M4 16h16"></path>
      </svg>
    ),
  },
  {
    title: "Collaboration and Sharing Features",
    description:
      "Allows users to share their knowledge graphs with peers, fostering a community of knowledge sharing and collaborative learning.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-users"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 14c3.5 0 6 1.5 6 3v1h-12v-1c0 -1.5 2.5 -3 6 -3z"></path>
        <path d="M15 10a3 3 0 1 0 -6 0a3 3 0 1 0 6 0z"></path>
        <path d="M18 12a5 5 0 1 0 -12 0a5 5 0 1 0 12 0z"></path>
        <path d="M9 10v-2"></path>
        <path d="M12 10v-2"></path>
        <path d="M15 10v-2"></path>
      </svg>
    ),
  },
];

export default FeaturesSection;
