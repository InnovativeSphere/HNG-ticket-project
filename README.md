# 🎫 React Ticket Management App

A simple **Ticket Management System** built with **React**.  
This project implements user authentication (Signup & Login), route protection, error handling, and full CRUD operations for managing tickets — all using **localStorage** (no backend required).

---

## 🚀 Project Overview

This project was created as part of a front-end development task to demonstrate:
- React component structuring
- Authentication without a backend
- CRUD operations (Create, Read, Update, Delete)
- Global and local error handling
- Protected routes and session management
- Clean and minimal UI design

All data (users, sessions, and tickets) are saved in the browser’s `localStorage`, allowing persistence across page reloads.

---

## 📁 Folder Structure

```

src/
│
├── components/
│   ├── Navbar.tsx          # App navigation bar with Logout
│   ├── Footer.tsx          # Footer section
│   ├── PrivateRoute.tsx    # Protects routes that require login
│
├── context/
│   └── ToastContext.tsx    # (Optional) Toast message handler
│
├── pages/
│   ├── Home.tsx            # Landing page
│   ├── About.tsx           # Info/about section
│   ├── Login.tsx           # User login page
│   ├── Signup.tsx          # User signup page
│   ├── Dashboard.tsx       # Main user area (requires auth)
│   └── TicketManager.tsx   # CRUD management for tickets
│
├── App.tsx                 # App entry point with routes & global error handling
├── App.css                 # Global styles
└── main.tsx / index.tsx    # React root rendering

````

---

## ⚙️ Features Implemented

### 🔐 **Authentication System**
- **Signup** and **Login** pages allow user creation and login using localStorage.
- Credentials are stored securely in browser storage.
- `ticketapp_session` key tracks active sessions.
- Redirects automatically if user is not logged in and tries to access protected routes.

### 📄 **Protected Routes**
- The `PrivateRoute` component ensures that only authenticated users can access `/dashboard` and `/tickets`.

### 🧾 **Ticket CRUD Functionality**
- Users can:
  - ➕ **Create** a new ticket
  - 🖊️ **Edit** existing tickets
  - 🗑️ **Delete** tickets
- All tickets are stored in localStorage.
- State updates instantly after each operation — no refresh required.

### ⚠️ **Error Handling**
- **Local:** Try/catch blocks in auth and ticket logic.
- **Global:** A `window.onerror` listener in `App.tsx` catches unexpected runtime errors and alerts the user.

### 🧭 **Routing**
- Implemented via `react-router-dom`:
  - `/` → Home
  - `/about` → About
  - `/login` → Login page
  - `/signup` → Signup page
  - `/dashboard` → Protected dashboard
  - `/tickets` → Ticket management page

### 🎨 **UI/UX**
- Clean and minimal layout using Tailwind CSS classes.
- Responsive design across desktop and mobile.
- Navbar includes Logout button (clears session and redirects).

---

## 💾 Data Storage

All data is stored in **localStorage**.  
Keys used:
| Key | Description |
|-----|--------------|
| `ticketapp_users` | Stores all registered users as JSON array |
| `ticketapp_session` | Stores the current logged-in user's username |
| `ticketapp_tickets` | Stores all tickets as JSON array per user |

---

## 🧩 Error Handling Details

**Global Error Handler (App.tsx):**
```ts
useEffect(() => {
  const handleGlobalError = (event: ErrorEvent) => {
    console.error("❌ Global error:", event.error);
    alert("An unexpected error occurred. Please try again.");
  };
  window.addEventListener("error", handleGlobalError);
  return () => window.removeEventListener("error", handleGlobalError);
}, []);
````

**Local Error Handling (Example in Login/Signup):**

```ts
try {
  // Logic for signup/login
} catch (error) {
  alert("Something went wrong. Please try again.");
}
```

---

## 🧠 How It Works

1. **Signup:**

   * User enters name, email, and password.
   * Info is validated and stored in `ticketapp_users`.

2. **Login:**

   * Credentials are verified against stored users.
   * A session (`ticketapp_session`) is created.

3. **Dashboard:**

   * Accessible only when logged in.
   * Shows overview and navigation to Ticket Manager.

4. **Ticket Manager:**

   * Fetches tickets from localStorage.
   * Allows creating, editing, and deleting tickets.
   * Automatically updates localStorage after every change.

5. **Logout:**

   * Clears `ticketapp_session` and redirects to `/login`.

---

## 🧩 Technologies Used

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| **React (TypeScript)** | Frontend framework                   |
| **React Router DOM**   | Page routing                         |
| **Tailwind CSS**       | Styling                              |
| **LocalStorage API**   | Persistent storage                   |
| **Vite**               | Build tool (if used for scaffolding) |

---

## 🧪 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/ticket-app.git
cd ticket-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the app

```bash
npm run dev
```

Then open your browser and go to:

```
http://localhost:5173
```

---

## 🧩 Future Improvements (Optional)

* Add toast notifications instead of alerts
* Add ticket search and filtering
* Store tickets by user ID instead of globally
* Add dark mode toggle
* Connect to a real backend API (Node.js, Firebase, etc.)

---

## 🏁 Conclusion

This project successfully demonstrates:

* Building a **React CRUD application** without a backend
* Implementing **authentication and protected routes**
* Managing state with **localStorage**
* Handling errors gracefully
* Delivering a **clean, functional UI**

---

### 👨‍💻 Author

**Salim Sambo**
Frontend Developer & UI Engineer

