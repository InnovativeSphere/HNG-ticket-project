import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import TicketPage from "./pages/TicketPage"; // ✅ New import

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("❌ Global error:", event.error);
      alert("An unexpected error occurred. Please try again.");
    };
    window.addEventListener("error", handleGlobalError);
    return () => window.removeEventListener("error", handleGlobalError);
  }, []);

  // ✅ Redirect unauthenticated users away from private pages
  useEffect(() => {
    const session = localStorage.getItem("ticketapp_session");
    if (
      !session &&
      (window.location.pathname.startsWith("/dashboard") ||
        window.location.pathname.startsWith("/tickets"))
    ) {
      alert("Please log in to access this page.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <TicketPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
