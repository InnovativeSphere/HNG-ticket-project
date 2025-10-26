import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <main className="relative bg-linear-to-b from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Decorative Circles */}
      <div
        className="absolute -left-20 top-0 w-64 h-64 bg-blue-200/60 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute right-[-100px] bottom-40 w-72 h-72 bg-blue-300/40 rounded-full blur-2xl pointer-events-none"
        aria-hidden
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 text-center">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            TicketApp — Manage Tickets Effortlessly
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Create, track, and resolve tickets with a clean, accessible interface
            that scales beautifully from mobile to desktop.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-32"
            preserveAspectRatio="none"
          >
            <path
              fill="#2563eb"
              fillOpacity="1"
              d="M0,128L60,144C120,160,240,192,360,202.7C480,213,600,203,720,186.7C840,171,960,149,1080,138.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          Why Choose TicketApp?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-blue-700">Fast Workflow</h3>
            <p className="mt-2 text-gray-600">
              Quickly create and manage tickets with smooth form logic and clear status feedback.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-blue-700">Accessible</h3>
            <p className="mt-2 text-gray-600">
              Keyboard-friendly, semantic HTML, and visible focus states for everyone.
            </p>
          </article>

          <article className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-blue-700">Consistent Design</h3>
            <p className="mt-2 text-gray-600">
              A unified look and feel across React, Vue, and Twig — all following the same style guide.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;
