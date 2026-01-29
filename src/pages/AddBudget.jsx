import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddBudget() {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ basic validation
    if (!category.trim() || Number(limit) <= 0) {
      alert("Please enter valid category and amount");
      return;
    }

    try {
      await API.post("/api/budgets", {
        category: category.trim(),
        amount: Number(limit),
        period,
      });

      // ✅ go back to list (forces refresh)
      navigate("/budgets", { replace: true });
    } catch (err) {
      console.error("Create budget error:", err);
      alert("Failed to create budget");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold">➕ Create Budget</h1>

        <input
          type="text"
          placeholder="Category (e.g. Food)"
          className="w-full border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Limit Amount"
          className="w-full border p-2"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          min="1"
          required
        />

        <select
          className="w-full border p-2"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Save Budget
        </button>
      </form>
    </div>
  );
}