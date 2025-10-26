import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Ticket schema:
 * {
 *   id: string,
 *   title: string,          // required
 *   status: "open"|"in_progress"|"closed", // required
 *   description?: string,
 *   priority?: string,
 *   createdAt: number
 * }
 *
 * Storage key: ticketapp_tickets (array)
 */

/* -------------------- Helpers -------------------- */

const STORAGE_KEY = "ticketapp_tickets";
const SESSION_KEY = "ticketapp_session";
const ALLOWED_STATUS = ["open", "in_progress", "closed"] as const;
type Status = (typeof ALLOWED_STATUS)[number];

const statusColor = (s: Status) =>
  s === "open" ? "bg-green-100 text-green-800" : s === "in_progress" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700";

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/* -------------------- TicketForm Component -------------------- */

export const TicketForm: React.FC<{
  initial?: Partial<{ title: string; status: Status; description: string; priority: string }>;
  onCancel: () => void;
  onSave: (ticket: { title: string; status: Status; description?: string; priority?: string }) => void;
}> = ({ initial, onCancel, onSave }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "open");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "");
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!ALLOWED_STATUS.includes(status)) return "Status must be one of: open, in_progress, closed.";
    if (description && description.length > 1000) return "Description is too long.";
    if (priority && !/^(low|medium|high)$/i.test(priority)) return "Priority must be low, medium, or high.";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    onSave({ title: title.trim(), status, description: description.trim() || undefined, priority: priority.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium">Title <span className="text-red-600">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
          aria-required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status <span className="text-red-600">*</span></label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
          aria-required
        >
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="closed">closed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Priority (optional)</label>
        <input
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="low, medium, high"
          className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
};

/* -------------------- TicketManager Component -------------------- */

type Ticket = {
  id: string;
  title: string;
  status: Status;
  description?: string;
  priority?: string;
  createdAt: number;
};

const TicketManager: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [showForm, setShowForm] = useState(false);

  const ensureAuth = () => {
    const s = localStorage.getItem(SESSION_KEY);
    if (!s) {
      // session missing or expired
      setToast("Your session has expired — please log in again.");
      setTimeout(() => navigate("/login"), 900);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!ensureAuth()) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = safeParse<Ticket[]>(raw, []);
      setTickets(parsed.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error("Load tickets error:", err);
      setLoadingError("Failed to load tickets. Please retry.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (next: Ticket[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setTickets(next);
    } catch {
      setToast("Failed to save tickets. Please retry.");
    }
  };

  const handleCreate = (payload: { title: string; status: Status; description?: string; priority?: string }) => {
    if (!ensureAuth()) return;
    const newTicket: Ticket = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
      title: payload.title,
      status: payload.status,
      description: payload.description,
      priority: payload.priority,
      createdAt: Date.now(),
    };
    const next = [newTicket, ...tickets];
    persist(next);
    setToast("Ticket created.");
    setShowForm(false);
    setTimeout(() => setToast(null), 1800);
  };

  const handleUpdate = (id: string, payload: { title: string; status: Status; description?: string; priority?: string }) => {
    if (!ensureAuth()) return;
    const next = tickets.map((t) => (t.id === id ? { ...t, ...payload } : t));
    persist(next);
    setToast("Ticket updated.");
    setEditing(null);
    setShowForm(false);
    setTimeout(() => setToast(null), 1800);
  };

  const handleDelete = (id: string) => {
    if (!ensureAuth()) return;
    const t = tickets.find((x) => x.id === id);
    if (!t) {
      setToast("Ticket not found.");
      setTimeout(() => setToast(null), 1500);
      return;
    }
    const confirmed = window.confirm(`Delete ticket "${t.title}"? This action cannot be undone.`);
    if (!confirmed) return;
    const next = tickets.filter((x) => x.id !== id);
    persist(next);
    setToast("Ticket deleted.");
    setTimeout(() => setToast(null), 1500);
  };

  if (loadingError) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded">
          <h3 className="font-semibold">Error</h3>
          <p className="mt-2">{loadingError}</p>
          <div className="mt-4">
            <button
              onClick={() => {
                setLoadingError(null);
                try {
                  const raw = localStorage.getItem(STORAGE_KEY);
                  const parsed = safeParse<Ticket[]>(raw, []);
                  setTickets(parsed);
                } catch {
                  setLoadingError("Failed to load tickets. Please retry.");
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ticket Manager</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!ensureAuth()) return;
              setEditing(null);
              setShowForm((s) => !s);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showForm ? "Close" : "Create Ticket"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(SESSION_KEY);
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Form area */}
      {showForm && !editing && (
        <div className="mb-6 bg-white p-6 rounded shadow border">
          <h2 className="font-semibold mb-3">New Ticket</h2>
          <TicketForm
            onCancel={() => setShowForm(false)}
            onSave={(payload) => handleCreate(payload)}
          />
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mb-6 bg-white p-6 rounded shadow border">
          <h2 className="font-semibold mb-3">Edit Ticket</h2>
          <TicketForm
            initial={{ title: editing.title, status: editing.status, description: editing.description, priority: editing.priority }}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSave={(payload) => handleUpdate(editing.id, payload)}
          />
        </div>
      )}

      {/* Tickets list */}
      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <div className="text-center p-8 bg-white border rounded">
            <p className="text-gray-600">No tickets yet. Create your first ticket.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <article key={t.id} className="bg-white p-4 rounded shadow border flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg">{t.title}</h3>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
                {t.description && <p className="mt-2 text-sm text-gray-600">{t.description}</p>}
                <div className="mt-3 text-xs text-gray-500">Created: {new Date(t.createdAt).toLocaleString()}</div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(t);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed right-4 bottom-6 bg-slate-800/95 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
};

export default TicketManager;
