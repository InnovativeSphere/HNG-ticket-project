import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  password: string;
}

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState<User>({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const session = localStorage.getItem("ticketapp_session");
    if (session) navigate("/dashboard");
  }, [navigate]);

  // ✅ Simple toast feedback
  const showMessage = (msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(""), 2500);
  };

  // ✅ Validation
  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      showMessage("All fields are required.", true);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      showMessage("Invalid email address.", true);
      return false;
    }
    if (form.password.length < 5) {
      showMessage("Password must be at least 5 characters.", true);
      return false;
    }
    return true;
  };

  // ✅ Submit logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    if (mode === "signup") {
      const exists = users.some((u) => u.email === form.email);
      if (exists) return showMessage("User already exists.", true);

      users.push(form);
      localStorage.setItem("users", JSON.stringify(users));
      showMessage("Account created! Please login.");
      setMode("login");
      setForm({ email: "", password: "" });
    } else {
      const valid = users.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (!valid) return showMessage("Invalid credentials.", true);

      localStorage.setItem("ticketapp_session", JSON.stringify(valid));
      showMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>

      {/* Hero wave background */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          <path
            fill="#2563eb"
            fillOpacity="1"
            d="M0,256L48,234.7C96,213,192,171,288,165.3C384,160,480,192,576,202.7C672,213,768,203,864,181.3C960,160,1056,128,1152,122.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Auth container */}
      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-8 z-10">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              isError ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
