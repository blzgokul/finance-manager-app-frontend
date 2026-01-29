import { useEffect, useState } from "react";
import API from "../api/axios";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  /* =========================
     FETCH BUDGET STATUS
  ========================== */
  const fetchBudgets = async () => {
    try {
      const res = await API.get("/api/budgets/status");
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to load budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  /* =========================
     UPDATE BUDGET AMOUNT
  ========================== */
  const saveBudget = async (id) => {
    if (!editAmount || editAmount <= 0) {
      alert("Enter a valid budget amount");
      return;
    }

    await API.put(`/api/budgets/${id}`, {
      amount: editAmount,
    });

    setEditId(null);
    setEditAmount("");
    fetchBudgets();
  };

  /* =========================
     DELETE BUDGET
  ========================== */
  const deleteBudget = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );
    if (!confirmDelete) return;

    await API.delete(`/api/budgets/${id}`);
    fetchBudgets();
  };

  /* =========================
     COLOR LOGIC
  ========================== */
  const getColor = (remaining, budget) => {
    if (remaining < 0) return "border-red-500 bg-red-50";
    if (remaining <= budget * 0.2) return "border-yellow-500 bg-yellow-50";
    return "border-green-500 bg-green-50";
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-2">📊 Budget Status</h2>
      <p className="text-gray-600 mb-6">
        Monthly budget vs actual expenses (auto-calculated).
      </p>

      {budgets.length === 0 ? (
        <p className="text-gray-500">No budgets set yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((b) => (
            <div
              key={b._id}
              className={`border rounded p-4 ${getColor(
                b.remaining,
                b.budget
              )}`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{b.category}</h3>
                {b.exceeded && (
                  <span className="text-red-600 font-semibold">
                    ⚠ Over Budget
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <p>Budget: ₹{b.budget}</p>
              <p>Spent: ₹{b.spent}</p>
              <p className="font-semibold">
                Remaining: ₹{b.remaining}
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-200 h-2 rounded mt-3">
                <div
                  className={`h-2 rounded ${
                    b.remaining < 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (b.spent / b.budget) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {/* ACTIONS */}
              {editId === b._id ? (
                <div className="flex gap-2 mt-4">
                  <input
                    type="number"
                    className="border p-1 w-32"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <button
                    onClick={() => saveBudget(b._id)}
                    className="bg-green-600 text-white px-3"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="border px-3"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 mt-4 text-sm">
                 
                  <button
                    onClick={() => {
                      setEditId(b._id);
                      setEditAmount(b.budget);
                    }}
                    className="text-green-600"
                  >
                    ✏️ Edit Budget
                  </button>

                  <button
                    onClick={() => deleteBudget(b._id)}
                    className="text-red-600"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}