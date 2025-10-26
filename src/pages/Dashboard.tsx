import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "closed";
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // ✅ Load tickets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tickets");
      if (stored) setTickets(JSON.parse(stored));
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  }, []);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in progress").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  return (
    <section className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Dashboard Overview
      </h1>

      {/* ✅ Ticket Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
          <p className="text-gray-500 font-medium mb-2">Total Tickets</p>
          <h2 className="text-3xl font-bold text-blue-600">{totalTickets}</h2>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
          <p className="text-gray-500 font-medium mb-2">Open</p>
          <h2 className="text-3xl font-bold text-green-600">{openTickets}</h2>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center">
          <p className="text-gray-500 font-medium mb-2">In Progress</p>
          <h2 className="text-3xl font-bold text-yellow-600">{inProgress}</h2>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-center sm:col-span-3">
          <p className="text-gray-500 font-medium mb-2">Closed</p>
          <h2 className="text-3xl font-bold text-gray-700">{closedTickets}</h2>
        </div>
      </div>

      {/* ✅ Navigate to Ticket Page */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/tickets")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          Manage Tickets
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
