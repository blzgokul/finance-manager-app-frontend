import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import BudgetList from "./pages/BudgetList";
import AddBudget from "./pages/AddBudget";
import Navbar from "./components/Navbar";

/* ======================
   AUTH GUARD
====================== */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔑 CHECK TOKEN ON APP LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {/* ✅ Navbar only AFTER login */}
      {isAuthenticated && (
        <Navbar setIsAuthenticated={setIsAuthenticated} />
      )}

      <Routes>
        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route path="/register" element={<Register />} />

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/income"
          element={
            <PrivateRoute>
              <Income />
            </PrivateRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <BudgetList />
            </PrivateRoute>
          }
        />

        <Route
          path="/budgets/add"
          element={
            <PrivateRoute>
              <AddBudget />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;