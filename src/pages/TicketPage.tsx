import React, { useState, useEffect } from "react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "closed";
  createdAt: string;
}

const TicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(
    null
  );

  // ✅ Simple message helper
  const showMessage = (
    text: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2500);
  };

  // ✅ Load tickets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tickets");
      if (stored) setTickets(JSON.parse(stored));
    } catch {
      showMessage("Failed to load tickets.", "error");
    }
  }, []);

  // ✅ Save tickets whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("tickets", JSON.stringify(tickets));
    } catch {
      showMessage("Failed to save tickets.", "error");
    }
  }, [tickets]);

  // ✅ Create new ticket
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      showMessage("Please fill in all fields.", "warning");
      return;
    }

    try {
      setLoading(true);
      const ticket: Ticket = {
        id: crypto.randomUUID(),
        title: newTicket.title.trim(),
        description: newTicket.description.trim(),
        status: "open",
        createdAt: new Date().toISOString(),
      };
      setTickets((prev) => [...prev, ticket]);
      setNewTicket({ title: "", description: "" });
      showMessage("Ticket created successfully!", "success");
    } catch {
      showMessage("Error creating ticket.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Start editing
  const startEdit = (id: string) => {
    const t = tickets.find((t) => t.id === id);
    if (t) {
      setEditingId(id);
      setNewTicket({ title: t.title, description: t.description });
    }
  };

  // ✅ Save edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      showMessage("Please fill in all fields.", "warning");
      return;
    }

    try {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: newTicket.title, description: newTicket.description }
            : t
        )
      );
      showMessage("Ticket updated successfully!", "success");
      setEditingId(null);
      setNewTicket({ title: "", description: "" });
    } catch {
      showMessage("Error updating ticket.", "error");
    }
  };

  // ✅ Delete ticket
  const handleDelete = (id: string) => {
    try {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      showMessage("Ticket deleted.", "info");
    } catch {
      showMessage("Error deleting ticket.", "error");
    }
  };

  // ✅ Update status
  const updateStatus = (id: string, status: Ticket["status"]) => {
    try {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      showMessage(`Ticket marked as ${status}.`, "info");
    } catch {
      showMessage("Error updating status.", "error");
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🎫 Ticket Manager
      </h1>

      {/* ✅ Notification */}
      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-md text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : message.type === "error"
              ? "bg-red-100 text-red-700"
              : message.type === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ✅ Ticket Form */}
      <form
        onSubmit={editingId ? handleSave : handleCreate}
        className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-10"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editingId ? "Edit Ticket" : "Create New Ticket"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ticket Title"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket({ ...newTicket, title: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewTicket({ title: "", description: "" });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Save Changes"
              : "Create Ticket"}
          </button>
        </div>
      </form>

      {/* ✅ Ticket List */}
      <div className="grid gap-6">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center">No tickets yet.</p>
        ) : (
          tickets.map((t) => (
            <article
              key={t.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
            >
              <header className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    t.status === "open"
                      ? "bg-green-100 text-green-700"
                      : t.status === "in progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {t.status}
                </span>
              </header>

              <p className="text-gray-600 mt-2 mb-4">{t.description}</p>

              <div className="flex flex-wrap gap-3 justify-end">
                {t.status !== "closed" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        t.id,
                        t.status === "open" ? "in progress" : "closed"
                      )
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                  >
                    {t.status === "open" ? "Start" : "Close"}
                  </button>
                )}
                <button
                  onClick={() => startEdit(t.id)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Created: {new Date(t.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default TicketPage;
