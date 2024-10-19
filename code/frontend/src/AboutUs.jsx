import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-black">
      <section
        id="about-us"
        className="relative block min-h-screen px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-900 bg-neutral-900/30 flex flex-col items-center justify-center"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-400 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
            About Us
          </span>
          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl animate-pulse">
            Empowering Your Learning Journey
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            At Knowledge Distiller, we believe that learning should be an enriching experience. Our app is designed to help students organize their study materials seamlessly, making knowledge more accessible and enjoyable.
          </p>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            With our innovative knowledge graph, students can visualize connections between concepts, fostering a deeper understanding of the subjects they study.
          </p>
        </div>

        <div className="relative mx-auto max-w-md z-10 pt-14 text-center">
          <button
            onClick={() => alert("Join us in revolutionizing learning!")}
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Learn More
          </button>
        </div>

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

export default AboutUs;
