// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSession, clearSession, isAuthenticated } from "../utlis/auth";

const Navbar: React.FC = () => {
  const [auth, setAuth] = useState<boolean>(isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const handle = () => setAuth(isAuthenticated());
    window.addEventListener("storage", handle); // update across tabs
    return () => window.removeEventListener("storage", handle);
  }, []);

  const handleLogout = () => {
    clearSession();
    setAuth(false);
    navigate("/", { replace: true });
  };

  const session = getSession();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link
            to="/"
            aria-label="TicketApp home"
            className="flex items-center gap-3 text-blue-600 font-bold text-lg"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect x="2" y="4" width="20" height="5" rx="1" fill="#0077FF" />
              <rect x="2" y="11" width="20" height="9" rx="2" fill="#E6F0FF" />
            </svg>
            <span>TicketApp</span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              About
            </NavLink>

            {auth && session ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-3 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="ml-3 inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
