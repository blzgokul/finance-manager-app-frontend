import { useNavigate } from "react-router-dom";

export default function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // 🔑 KEY LINE
    navigate("/login");
  };

  return (
    <div className="flex gap-6 bg-gray-800 text-white p-4 items-center">
      <button onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/expenses")}>
        Expenses
      </button>

      <button onClick={() => navigate("/reports")}>
        Reports
      </button>

      <button onClick={() => navigate("/budgets")}>
        Budgets
      </button>

      <button onClick={() => navigate("/profile")}>
        Profile
      </button>

      <div className="ml-auto">
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}