import React from "react";

const About: React.FC = () => {
  return (
    <section className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-20">
      <article className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-blue-100">
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-6"
          aria-label="About TicketApp"
        >
          About <span className="text-blue-500">TicketApp</span>
        </h1>

        <p className="text-gray-700 text-center leading-relaxed max-w-2xl mx-auto mb-10">
          <span className="font-semibold text-blue-600">TicketApp</span> is a
          modern demo ticket management interface built according to the{" "}
          <strong>HNG Stage 2</strong> requirements — ensuring accessibility,
          responsiveness, and consistent UI across frameworks. Every interaction
          and layout is designed for clarity, performance, and user comfort.
        </p>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-linear-to-tr from-blue-100 to-blue-50 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="font-bold text-blue-800 text-lg mb-2">
              🎨 Design Philosophy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We emphasize predictable, accessible, and performant UI — focusing
              on a frictionless experience through thoughtful layouts and modern
              aesthetics.
            </p>
          </div>

          <div className="p-6 bg-linear-to-tr from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="font-bold text-blue-800 text-lg mb-2">⚙️ Stack</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Built with <strong>React</strong>, <strong>TypeScript</strong>,
              and <strong>TailwindCSS</strong> — using semantic HTML and
              component-based styling for scalability and clarity.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default About;
