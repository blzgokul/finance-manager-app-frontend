import { useState } from "react";
import API from "../api/axios";

export default function BudgetForm({ onAdded }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!category || !amount) {
      alert("All fields required");
      return;
    }

    await API.post("/api/budgets", {
      category,
      amount,
    });

    setCategory("");
    setAmount("");
    onAdded && onAdded();
  };

  return (
    <div className="bg-gray-50 border rounded p-4">
      <h3 className="font-semibold mb-3">➕ Set Monthly Budget</h3>

      <div className="flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Category (Food, Rent...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Budget Amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4"
        >
          Save
        </button>
      </div>
    </div>
  );
}