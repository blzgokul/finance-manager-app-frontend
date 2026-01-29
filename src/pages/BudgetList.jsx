import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await API.get("/api/budgets");

      // 🔒 SAFETY: always force array
      if (Array.isArray(res.data)) {
        setBudgets(res.data);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Failed to fetch budgets", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading budgets...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">💰 Budgets</h1>

          <button
            onClick={() => navigate("/budgets/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Budget
          </button>
        </div>

        {/* CONTENT */}
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center">
            No budgets created yet
          </p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Category</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Period</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="border p-2">{b.category}</td>
                  <td className="border p-2">₹{b.amount}</td>
                  <td className="border p-2">{b.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}