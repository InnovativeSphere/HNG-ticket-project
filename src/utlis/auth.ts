// src/utils/auth.ts
export type User = {
  name: string;
  email: string;
  password: string; // stored in localStorage for mock (never do this in prod)
};

export type Session = {
  token: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
};

const USERS_KEY = "ticketapp_users";
const SESSION_KEY = "ticketapp_session";

/** --- Users helper (mock DB in localStorage) --- */
export const loadUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  return loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
};

/** --- Session helpers --- */
export const saveSession = (session: Session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => !!getSession();

/** --- Mock register / login flows --- */
export const registerUser = (user: User): { ok: true } | { ok: false; message: string } => {
  const existing = findUserByEmail(user.email);
  if (existing) {
    return { ok: false, message: "A user with that email already exists." };
  }
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return { ok: true };
};

export const loginUser = (email: string, password: string): { ok: true; session: Session } | { ok: false; message: string } => {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, message: "Invalid credentials." };
  if (user.password !== password) return { ok: false, message: "Invalid credentials." };

  const token = cryptoRandomHex(24);
  const session: Session = {
    token,
    user: { name: user.name, email: user.email },
    createdAt: new Date().toISOString(),
  };
  saveSession(session);
  return { ok: true, session };
};

/** tiny random hex for token */
const cryptoRandomHex = (size = 16) =>
  Array.from(window.crypto.getRandomValues(new Uint8Array(size))).map((b) => b.toString(16).padStart(2, "0")).join("");
